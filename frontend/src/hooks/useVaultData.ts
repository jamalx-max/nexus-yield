// Custom hook for reading vault contract data
import { useState, useEffect, useCallback } from 'react';
import { ADDRESSES } from '../config/constants';
import { useStacksWallet } from '../providers/StacksWalletProvider';
import { callReadOnly, parseUintResult, principalToHex } from '../lib/stacks/contracts';

interface VaultDataState {
  totalAssets: number;
  totalSupply: number;
  exchangeRate: number;
  userShares: number;
  userAssets: number;
  apy: number;
  isLoading: boolean;
  error: string | null;
}

interface VaultData extends VaultDataState {
  refetch: () => Promise<void>;
}

const VAULT_CONTRACT = ADDRESSES.APEX_VAULT;

export function useVaultData(): VaultData {
  const { isConnected, address } = useStacksWallet();
  const [data, setData] = useState<VaultDataState>({
    totalAssets: 0,
    totalSupply: 0,
    exchangeRate: 1_000_000, // 1.0 with 6 decimals
    userShares: 0,
    userAssets: 0,
    apy: 13.5, // Default APY based on yield simulation
    isLoading: true,
    error: null,
  });

  const fetchVaultData = useCallback(async () => {
    const sender = address || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM';
    
    try {
      // Fetch total assets
      const totalAssetsResult = await callReadOnly(
        VAULT_CONTRACT,
        'get-total-assets',
        [],
        sender
      );
      const totalAssets = parseUintResult(totalAssetsResult);
      
      // Fetch total supply
      const totalSupplyResult = await callReadOnly(
        VAULT_CONTRACT,
        'get-total-supply',
        [],
        sender
      );
      const totalSupply = parseUintResult(totalSupplyResult);
      
      // Fetch exchange rate
      const exchangeRateResult = await callReadOnly(
        VAULT_CONTRACT,
        'get-exchange-rate',
        [],
        sender
      );
      const exchangeRate = parseUintResult(exchangeRateResult);
      
      // Fetch user balance if connected
      let userShares = 0;
      if (isConnected && address) {
        try {
          const userBalanceResult = await callReadOnly(
            VAULT_CONTRACT,
            'get-balance',
            [principalToHex(address)], // Properly encoded principal
            sender
          );
          userShares = parseUintResult(userBalanceResult);
        } catch (e) {
          // User might not have any shares - silent fail
        }
      }
      
      // Calculate user assets based on shares and exchange rate
      const userAssets = totalSupply > 0 
        ? Math.floor((userShares * totalAssets) / totalSupply)
        : userShares;
      
      setData({
        totalAssets: totalAssets / 1_000_000, // Convert to decimal
        totalSupply: totalSupply / 1_000_000,
        exchangeRate: exchangeRate / 1_000_000, // 6 decimals
        userShares: userShares / 1_000_000,
        userAssets: userAssets / 1_000_000,
        apy: 13.5, // Based on 10 bps per 100 blocks
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      // Silent fail on vault data errors - set error state for UI handling
      setData(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  }, [isConnected, address]);

  useEffect(() => {
    fetchVaultData();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchVaultData, 30000);
    
    return () => clearInterval(interval);
  }, [fetchVaultData]);

  return {
    ...data,
    refetch: fetchVaultData,
  };
}
