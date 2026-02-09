// Custom hook for bridge operations
import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract, useBalance, usePublicClient } from 'wagmi';
import { 
  X_RESERVE_ABI, 
  USDC_ABI, 
  parseUSDC, 
  ADDRESSES,
  STACKS_DOMAIN,
  type BridgeState,
} from '../lib/bridge';
import { stacksAddressToBytes32, generateHookData } from '../lib/bridge/address';
import { pollForMint } from '../lib/bridge/tracker';
import { getParsedError } from '../lib/utils';
import { ERROR_MESSAGES } from '../lib/errors';
import { TransactionType, TransactionStatus } from '../lib/transactions';
import { useTransactionTrackerContext } from '../providers/TransactionTrackerProvider';

export function useBridge() {
  const { address: ethAddress } = useAccount();
  const publicClient = usePublicClient();
  const [bridgeState, setBridgeState] = useState<BridgeState>({ status: 'idle' });
  const { addTransaction, trackTransaction } = useTransactionTrackerContext();
  
  // Contract write hooks
  const { writeContractAsync: writeApprove } = useWriteContract();
  const { writeContractAsync: writeDeposit } = useWriteContract();
  
  // Read USDC allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: ADDRESSES.USDC as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'allowance',
    args: ethAddress ? [ethAddress, ADDRESSES.X_RESERVE as `0x${string}`] : undefined,
  });

  // Read USDC balance
  const { data: usdcBalanceData } = useReadContract({
    address: ADDRESSES.USDC as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: ethAddress ? [ethAddress] : undefined,
  });

  // Read ETH balance
  const { data: ethBalanceData } = useBalance({
    address: ethAddress,
  });

  /**
   * Approve USDC spending for xReserve contract.
   * @param amount - Amount of USDC to approve (in human readable format, e.g. "1.0")
   * @returns Transaction hash of approval
   */
  const approveUSDC = useCallback(async (amount: string) => {
    if (!ethAddress) {
      const error = new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }
    if (!publicClient) {
      const error = new Error(ERROR_MESSAGES.RPC_ERROR);
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }
    
    setBridgeState({ status: 'approving' });
    
    try {
      const amountWei = parseUSDC(amount);
      
      const hash = await writeApprove({
        address: ADDRESSES.USDC as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [ADDRESSES.X_RESERVE as `0x${string}`, amountWei],
      });
      
      // Wait for transaction to be mined before updating state
      await publicClient.waitForTransactionReceipt({ hash });
      
      // Only update state after transaction is confirmed
      setBridgeState({ status: 'approved', ethTxHash: hash });
      await refetchAllowance();
      
      return hash;
    } catch (error: any) {
      const parsedError = getParsedError(error);
      setBridgeState({ 
        status: 'failed', 
        error: parsedError.message,
        errorCategory: parsedError.category,
        errorSeverity: parsedError.severity,
      });
      throw error;
    }
  }, [ethAddress, writeApprove, refetchAllowance, publicClient]);

  /**
   * Bridge USDC from Ethereum to Stacks via Circle CCTP.
   * @param amount - Amount to bridge (in human readable format)
   * @param stacksRecipient - Recipient Stacks address (e.g. ST1...)
   * @returns Object containing transaction hash and hook data
   */
  const bridgeToStacks = useCallback(async (amount: string, stacksRecipient: string) => {
    if (!ethAddress) {
      const error = new Error(ERROR_MESSAGES.WALLET_NOT_CONNECTED);
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }
    if (!publicClient) {
      const error = new Error(ERROR_MESSAGES.RPC_ERROR);
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }

    // Validate amount
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      const error = new Error(ERROR_MESSAGES.INVALID_AMOUNT);
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }

    // Validate Stacks address format
    if (!stacksRecipient || (!stacksRecipient.startsWith('ST') && !stacksRecipient.startsWith('SP'))) {
      const error = new Error(ERROR_MESSAGES.INVALID_ADDRESS);
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }
    
    setBridgeState({ status: 'depositing', amount });
    
    try {
      const amountWei = parseUSDC(amount);
      const hookData = generateHookData();
      const remoteRecipient = stacksAddressToBytes32(stacksRecipient);
      
      const hash = await writeDeposit({
        address: ADDRESSES.X_RESERVE as `0x${string}`,
        abi: X_RESERVE_ABI,
        functionName: 'depositToRemote',
        args: [
          amountWei,
          STACKS_DOMAIN,
          remoteRecipient,
          ADDRESSES.USDC as `0x${string}`,
          0n, // maxFee
          hookData,
        ],
      });
      
      // Immediately show tracking UI after user signs (don't wait for mining)
      setBridgeState({ 
        status: 'pending_attestation', 
        ethTxHash: hash, 
        hookData,
        amount,
      });
      
      // Wait for transaction confirmation in background
      publicClient.waitForTransactionReceipt({ hash }).then(() => {
        // Transaction confirmed, attestation can start
        console.log('Bridge transaction confirmed:', hash);
      }).catch((error) => {
        console.error('Bridge transaction failed:', error);
        const parsedError = getParsedError(error);
        setBridgeState({ 
          status: 'failed', 
          error: parsedError.message,
          errorCategory: parsedError.category,
          errorSeverity: parsedError.severity,
        });
      });
      
      // Start polling for mint
      pollForMint(hookData, stacksRecipient).then((result) => {
        if (result.success) {
          setBridgeState(prev => ({
            ...prev,
            status: 'completed',
            stacksTxId: result.txId,
          }));
        }
      });
      
      return { hash, hookData };
    } catch (error: any) {
      const parsedError = getParsedError(error);
      setBridgeState({ 
        status: 'failed', 
        error: parsedError.message,
        errorCategory: parsedError.category,
        errorSeverity: parsedError.severity,
      });
      throw error;
    }
  }, [ethAddress, writeDeposit, publicClient]);

  /**
   * Check if sufficient allowance exists
   */
  const hasAllowance = useCallback((amount: string): boolean => {
    if (!allowance) return false;
    const amountWei = parseUSDC(amount);
    return allowance >= amountWei;
  }, [allowance]);

  /**
   * Reset bridge state
   */
  const reset = useCallback(() => {
    setBridgeState({ status: 'idle' });
  }, []);

  return {
    bridgeState,
    allowance: allowance ? Number(allowance) / 1_000_000 : 0,
    usdcBalance: usdcBalanceData ? Number(usdcBalanceData) / 1_000_000 : 0,
    ethBalance: ethBalanceData ? Number(ethBalanceData.value) / 1e18 : 0,
    approveUSDC,
    bridgeToStacks,
    hasAllowance,
    reset,
  };
}
