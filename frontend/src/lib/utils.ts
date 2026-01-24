import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return ''
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`
}

export function formatNumber(value: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value)
}

export function getFriendlyErrorMessage(error: any): string {
  if (!error) return 'Unknown error occurred';
  
  const message = error?.shortMessage || error?.message || error?.toString() || 'Unknown error occurred';
  
  // Common Wallet Errors
  if (message.includes('User rejected') || message.includes('Action rejected') || message.includes('User denied')) {
    return 'You cancelled the transaction.';
  }
  if (message.includes('insufficient funds') || message.includes('exceeds balance')) {
    return 'Insufficient funds for gas or transaction.';
  }
  if (message.includes('Connector not connected')) {
    return 'Wallet disconnected. Please reconnect.';
  }
  if (message.includes('Chain mismatch') || message.includes('network')) {
    return 'Wrong network. Please switch to the correct chain.';
  }
  
  // Truncate really long RPC errors
  return message.length > 120 ? `${message.slice(0, 120)}...` : message;
}
