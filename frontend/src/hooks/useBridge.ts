// Custom hook for bridge operations
import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useReadContract } from 'wagmi';
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

export function useBridge() {
  const { address: ethAddress } = useAccount();
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
  const { data: usdcBalance } = useReadContract({
    address: ADDRESSES.USDC as `0x${string}`,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: ethAddress ? [ethAddress] : undefined,
  });

  /**
   * Approve USDC spending for xReserve
   */
  const approveUSDC = useCallback(async (amount: string) => {
    if (!ethAddress) throw new Error('Wallet not connected');
    
    setBridgeState({ status: 'approving' });
    
    try {
      const amountWei = parseUSDC(amount);
      
      const hash = await writeApprove({
        address: ADDRESSES.USDC as `0x${string}`,
        abi: USDC_ABI,
        functionName: 'approve',
        args: [ADDRESSES.X_RESERVE as `0x${string}`, amountWei],
      });
      
      setBridgeState({ status: 'approved', ethTxHash: hash });
      await refetchAllowance();
      
      return hash;
    } catch (error: any) {
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }
  }, [ethAddress, writeApprove, refetchAllowance]);

  /**
   * Bridge USDC from Ethereum to Stacks
   */
  const bridgeToStacks = useCallback(async (amount: string, stacksRecipient: string) => {
    if (!ethAddress) throw new Error('Wallet not connected');
    
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
      
      setBridgeState({ 
        status: 'pending_attestation', 
        ethTxHash: hash, 
        hookData,
        amount,
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
      setBridgeState({ status: 'failed', error: error.message });
      throw error;
    }
  }, [ethAddress, writeDeposit]);

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
    usdcBalance: usdcBalance ? Number(usdcBalance) / 1_000_000 : 0,
    approveUSDC,
    bridgeToStacks,
    hasAllowance,
    reset,
  };
}
