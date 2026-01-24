// Custom hook for reading USDCx token balance on Stacks
import { useState, useEffect, useCallback } from 'react';
import { ADDRESSES } from '../config/constants';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { callReadOnly, parseUintResult, principalToHex } from '../lib/stacks/contracts';

interface USDCxBalanceData {
  balance: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUSDCxBalance(): USDCxBalanceData {
  const { isConnected, address } = useStacksWallet();
  const [balance, setBalance] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!isConnected || !address) {
      setBalance(0);
      setIsLoading(false);
      return;
    }

    const sender = address;
    
    try {
      setIsLoading(true);
      setError(null);

      // Call get-balance function on USDCx contract with principal argument
      const balanceResult = await callReadOnly(
        ADDRESSES.USDCX_TOKEN,
        'get-balance',
        [principalToHex(address)], // Properly encoded principal
        sender
      );
      
      const balanceMicro = parseUintResult(balanceResult);
      setBalance(balanceMicro / 1_000_000); // Convert to decimal (6 decimals)
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error fetching USDCx balance:', err);
      setError(err.message || 'Failed to fetch balance');
      setBalance(0);
      setIsLoading(false);
    }
  }, [isConnected, address]);

  useEffect(() => {
    fetchBalance();
    
    // Poll every 10 seconds for balance updates
    const interval = setInterval(fetchBalance, 10000);
    
    return () => clearInterval(interval);
  }, [fetchBalance]);

  return {
    balance,
    isLoading,
    error,
    refetch: fetchBalance,
  };
}
