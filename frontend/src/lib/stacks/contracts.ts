// Shared utilities for Stacks contract read-only calls
import { CHAIN_CONFIG } from '../../config/constants';
import { cvToHex, principalCV, deserializeCV, ClarityType } from '@stacks/transactions';

/**
 * Call a read-only function on a Stacks contract
 * @param contractId - Contract identifier (e.g., 'ST1234.contract-name')
 * @param functionName - Name of the function to call
 * @param args - Array of Clarity value arguments (hex-encoded)
 * @param sender - Principal making the call
 * @returns The result from the contract call
 */
export async function callReadOnly(
  contractId: string,
  functionName: string,
  args: string[] = [],
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

/**
 * Parse a Clarity uint response to a JavaScript number
 * @param result - Hex-encoded Clarity result (e.g., '0x070100000000000000000003197500')
 * @returns Parsed number
 */
export function parseUintResult(result: string): number {
  try {
    // Decode hex-encoded Clarity value
    const clarityValue = deserializeCV(result);
    
    // Handle (ok uint) response type
    if (clarityValue.type === ClarityType.ResponseOk) {
      const innerValue = clarityValue.value;
      if (innerValue.type === ClarityType.UInt) {
        return Number(innerValue.value);
      }
    }
    
    // Handle direct uint type
    if (clarityValue.type === ClarityType.UInt) {
      return Number(clarityValue.value);
    }
    
    console.warn('Unexpected Clarity value type:', clarityValue.type);
    return 0;
  } catch (error) {
    console.error('Error parsing Clarity result:', error, result);
    return 0;
  }
}

/**
 * Convert a Stacks principal address to hex-encoded Clarity value
 * @param address - Stacks principal address (e.g., 'ST1234...')
 * @returns Hex-encoded principal CV
 */
export function principalToHex(address: string): string {
  const principalValue = principalCV(address);
  return cvToHex(principalValue);
}
