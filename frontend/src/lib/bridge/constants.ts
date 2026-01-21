// Bridge constants and ABIs for Circle xReserve integration
import { parseUnits } from 'viem';
import { ADDRESSES, STACKS_DOMAIN } from '../../config/constants';

// xReserve ABI (minimal for deposit)
export const X_RESERVE_ABI = [
  {
    name: 'depositToRemote',
    type: 'function',
    inputs: [
      { name: 'value', type: 'uint256' },
      { name: 'remoteDomain', type: 'uint32' },
      { name: 'remoteRecipient', type: 'bytes32' },
      { name: 'localToken', type: 'address' },
      { name: 'maxFee', type: 'uint256' },
      { name: 'hookData', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const;

// USDC ERC20 ABI (minimal for approve)
export const USDC_ABI = [
  {
    name: 'approve',
    type: 'function',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    name: 'allowance',
    type: 'function',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    name: 'balanceOf',
    type: 'function',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;

// Bridge status types
export type BridgeStatus = 
  | 'idle'
  | 'approving'
  | 'approved'
  | 'depositing'
  | 'pending_attestation'
  | 'minting'
  | 'completed'
  | 'failed';

export interface BridgeState {
  status: BridgeStatus;
  ethTxHash?: string;
  stacksTxId?: string;
  hookData?: string;
  amount?: string;
  error?: string;
}

// Helper to format USDC amount (6 decimals)
export function parseUSDC(amount: string): bigint {
  return parseUnits(amount, 6);
}

export function formatUSDC(amount: bigint): string {
  return (Number(amount) / 1_000_000).toFixed(2);
}

export { ADDRESSES, STACKS_DOMAIN };
