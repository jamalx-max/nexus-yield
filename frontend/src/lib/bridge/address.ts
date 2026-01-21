// Address conversion utilities for cross-chain bridging
import { c32addressDecode } from 'c32check';

/**
 * Convert a Stacks address to bytes32 format for xReserve
 * @param stacksAddress - Stacks address (e.g., "ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5")
 * @returns bytes32 hex string
 */
export function stacksAddressToBytes32(stacksAddress: string): `0x${string}` {
  try {
    const [version, hash160] = c32addressDecode(stacksAddress);
    
    // Pad to 32 bytes: version (1 byte) + hash160 (20 bytes) + padding (11 bytes)
    const versionHex = version.toString(16).padStart(2, '0');
    const paddedHash = hash160.padStart(40, '0');
    const padding = '0'.repeat(22); // 11 bytes of padding at start
    
    return `0x${padding}${versionHex}${paddedHash}` as `0x${string}`;
  } catch (error) {
    throw new Error(`Invalid Stacks address: ${stacksAddress}`);
  }
}

/**
 * Convert an Ethereum address to a 32-byte buffer for Clarity
 * @param ethAddress - Ethereum address (e.g., "0x1234...")
 * @returns Uint8Array of 32 bytes
 */
export function ethAddressToBuffer(ethAddress: string): Uint8Array {
  // Remove 0x prefix and pad to 32 bytes
  const hex = ethAddress.replace('0x', '').toLowerCase();
  const padded = hex.padStart(64, '0');
  
  // Convert hex string to Uint8Array
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i++) {
    bytes[i] = parseInt(padded.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Generate unique hookData for tracking bridge deposits
 * @returns bytes20 hex string with timestamp + random bytes
 */
export function generateHookData(): `0x${string}` {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomBytes = new Uint8Array(12);
  crypto.getRandomValues(randomBytes);
  const randomHex = Array.from(randomBytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return `0x${timestamp}${randomHex}` as `0x${string}`;
}

/**
 * Shorten a transaction hash for display
 */
export function shortenTxHash(hash: string, chars = 8): string {
  if (!hash) return '';
  return `${hash.slice(0, chars + 2)}...${hash.slice(-chars)}`;
}
