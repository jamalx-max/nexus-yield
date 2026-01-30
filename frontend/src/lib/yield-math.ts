/**
 * Yield Calculation Utilities
 * 
 * Provides precise calculations for APY, compound interest, and projected returns.
 * Based on the Stacks block time of ~10 minutes and the vault's accrual strategy.
 */

// Constants
export const BLOCKS_PER_DAY = 144; // ~10 minutes per block
export const DAYS_PER_YEAR = 365;

/**
 * Calculate projected earnings for a given amount and APY
 * @param principal - The initial deposit amount
 * @param apy - The Annual Percentage Yield (e.g., 12.5 for 12.5%)
 * @returns Object containing daily, weekly, monthly, and yearly earnings
 */
export function calculateProjections(principal: number, apy: number) {
  const rate = apy / 100;
  
  // Daily rate (simple interest approximation for short term)
  const dailyRate = rate / DAYS_PER_YEAR;
  
  return {
    daily: principal * dailyRate,
    weekly: principal * dailyRate * 7,
    monthly: principal * (rate / 12),
    yearly: principal * rate,
  };
}

/**
 * Calculate the difference in earnings between two rates
 * @param principal - The investment amount
 * @param baseApy - The lower APY (e.g., Aave or Bank)
 * @param targetApy - The higher APY (Apex Yield)
 * @returns The extra earnings per year
 */
export function calculateAdvantage(principal: number, baseApy: number, targetApy: number): number {
  const baseReturn = principal * (baseApy / 100);
  const targetReturn = principal * (targetApy / 100);
  return targetReturn - baseReturn;
}

/**
 * Format a number as currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
