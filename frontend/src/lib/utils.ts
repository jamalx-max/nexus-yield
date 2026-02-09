import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseError, formatErrorMessage, logError } from './error-parser'
import type { ParsedError } from './errors'

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

/**
 * Get a friendly error message from any error object
 * Uses the advanced error parser for categorization and enrichment
 */
export function getFriendlyErrorMessage(error: any): string {
  const parsedError = parseError(error);
  logError(parsedError);
  return formatErrorMessage(parsedError);
}

/**
 * Get the full parsed error with all details
 * Useful when you need category, severity, and suggested actions
 */
export function getParsedError(error: any): ParsedError {
  const parsedError = parseError(error);
  logError(parsedError);
  return parsedError;
}
