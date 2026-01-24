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
import { getFriendlyErrorMessage } from '../lib/utils';

export function useBridge() {
  const { address: ethAddress } = useAccount();
  const publicClient = usePublicClient();
  const [bridgeState, setBridgeState] = useState<BridgeState>({ status: 'idle' });
  
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
   * Approve USDC spending for xReserve
   */
  const approveUSDC = useCallback(async (amount: string) => {
    if (!ethAddress) throw new Error('Wallet not connected');
    if (!publicClient) throw new Error('Public client not available');
    
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
      setBridgeState({ status: 'failed', error: getFriendlyErrorMessage(error) });
      throw error;
    }
  }, [ethAddress, writeApprove, refetchAllowance, publicClient]);

  /**
   * Bridge USDC from Ethereum to Stacks
   */
  const bridgeToStacks = useCallback(async (amount: string, stacksRecipient: string) => {
    if (!ethAddress) throw new Error('Wallet not connected');
    if (!publicClient) throw new Error('Public client not available');
    
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
        setBridgeState({ status: 'failed', error: getFriendlyErrorMessage(error) });
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
      setBridgeState({ status: 'failed', error: getFriendlyErrorMessage(error) });
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
