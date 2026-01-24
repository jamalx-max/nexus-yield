// Bridge status tracking utilities
import { CHAIN_CONFIG } from '../../config/constants';

const USDCX_V1_TESTNET = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usdcx-v1';

export interface MintCheckResult {
  success: boolean;
  txId?: string;
  amount?: number;
  timestamp?: number;
}

/**
 * Check if a USDCx mint has occurred for a given hookData
 * @param hookData - The unique hookData from the deposit
 * @param _recipient - Optional recipient address (not used, kept for API compatibility)
 */
export async function checkMintStatus(
  hookData: string,
  _recipient?: string
): Promise<MintCheckResult> {
  try {
    console.log('🔍 Checking mint status for hookData:', hookData);
    
    const response = await fetch(
      `${CHAIN_CONFIG.stacks.apiUrl}/extended/v1/contract/${USDCX_V1_TESTNET}/events?limit=50`
    );
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log(`📊 Fetched ${data.results?.length || 0} events from USDCx contract`);
    
    // Find mint event matching hookData or recipient
    const mintEvent = data.results?.find((event: any) => {
      if (event.event_type !== 'smart_contract_log') return false;
      
      const repr = event.contract_log?.value?.repr || '';
      
      // Check if this is a mint event
      if (!repr.includes('(topic "mint")') && 
          !repr.includes('(topic \\"mint\\")')) return false;
      
      // ONLY match by hookData (most reliable and prevents false positives)
      if (hookData && hookData !== '0x' && hookData.length > 2) {
        const hookDataClean = hookData.replace('0x', '').toLowerCase();
        const hasMatch = repr.toLowerCase().includes(`(hook-data 0x${hookDataClean})`);
        
        if (hasMatch) {
          console.log('✅ Found matching mint event by hookData!', event.tx_id);
        }
        
        return hasMatch;
      }
      
      // If no hookData provided, don't match anything (prevent false positives)
      console.warn('⚠️ No valid hookData provided, cannot match mint events');
      return false;
    });
    
    if (mintEvent) {
      // Extract amount from the event if possible
      const amountMatch = mintEvent.contract_log?.value?.repr?.match(/mint-amount: u(\d+)/);
      const amount = amountMatch ? parseInt(amountMatch[1]) / 1_000_000 : undefined;
      
      return {
        success: true,
        txId: mintEvent.tx_id,
        amount,
        timestamp: mintEvent.block_time,
      };
    }
    
    console.log('⏳ No matching mint event found yet, will continue polling...');
    return { success: false };
  } catch (error) {
    console.error('Error checking mint status:', error);
    return { success: false };
  }
}

/**
 * Poll for mint status with retries
 * @param hookData - The unique hookData from the deposit
 * @param maxAttempts - Maximum number of polling attempts
 * @param intervalMs - Interval between polls in milliseconds
 */
export async function pollForMint(
  hookData: string,
  recipient?: string,
  maxAttempts = 60,
  intervalMs = 10000
): Promise<MintCheckResult> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await checkMintStatus(hookData, recipient);
    
    if (result.success) {
      return result;
    }
    
    // Wait before next attempt
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  return { success: false };
}

/**
 * Get estimated bridge completion time
 */
export function getEstimatedBridgeTime(): string {
  return '10-20 minutes';
}
