// Custom hook for reading vault contract data
import { useState, useEffect, useCallback } from 'react';
import { CHAIN_CONFIG, ADDRESSES } from '../config/constants';
import { useStacksWallet } from '../providers/StacksWalletProvider';

interface VaultData {
  totalAssets: number;
  totalSupply: number;
  exchangeRate: number;
  userShares: number;
  userAssets: number;
  apy: number;
  isLoading: boolean;
  error: string | null;
}

const VAULT_CONTRACT = ADDRESSES.APEX_VAULT;

async function callReadOnly(
  contractId: string,
  functionName: string,
  args: any[] = [],
  sender: string
): Promise<any> {
  const [contractAddress, contractName] = contractId.split('.');
  
  const response = await fetch(
    `${CHAIN_CONFIG.stacks.apiUrl}/v2/contracts/call-read/${contractAddress}/${contractName}/${functionName}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender,
        arguments: args,
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.okay) {
    throw new Error(data.cause || 'Contract call failed');
  }
  
  return data.result;
}

function parseUintResult(result: string): number {
  // Parse Clarity uint response
  // Format: (ok u1000000) or just u1000000
  const match = result.match(/u(\d+)/);
  if (match) {
    return parseInt(match[1]);
  }
  return 0;
}

export function useVaultData(): VaultData {
  const { isConnected, address } = useStacksWallet();
  const [data, setData] = useState<VaultData>({
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
            [`0x${Buffer.from(address).toString('hex')}`], // Principal as hex
            sender
          );
          userShares = parseUintResult(userBalanceResult);
        } catch (e) {
          // User might not have any shares
          console.warn('Could not fetch user balance:', e);
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
      console.error('Error fetching vault data:', error);
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

  return data;
}
