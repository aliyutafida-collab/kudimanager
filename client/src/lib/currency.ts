/**
 * Currency formatting utilities for Nigerian Naira (₦)
 */

/**
 * Formats a number as Nigerian Naira currency
 * @param amount - The amount to format
 * @param options - Optional formatting options
 * @returns Formatted currency string with ₦ symbol
 * 
 * Examples:
 * formatCurrency(12500) => "₦12,500"
 * formatCurrency(1234567.89) => "₦1,234,567.89"
 * formatCurrency(0) => "₦0"
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options?: {
    showDecimals?: boolean;
    showSymbol?: boolean;
  }
): string {
  const { showDecimals = false, showSymbol = true } = options || {};
  
  // Handle null/undefined/empty values
  const numericAmount = typeof amount === 'string' 
    ? parseFloat(amount) 
    : amount;
  
  if (numericAmount === null || numericAmount === undefined || isNaN(numericAmount)) {
    return showSymbol ? '₦0' : '0';
  }

  // Format using Nigerian locale
  const formatted = numericAmount.toLocaleString('en-NG', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 2,
  });

  return showSymbol ? `₦${formatted}` : formatted;
}

/**
 * Formats a number without currency symbol, using Nigerian number formatting
 * @param amount - The amount to format
 * @returns Formatted number string
 */
export function formatNumber(amount: number | string | null | undefined): string {
  return formatCurrency(amount, { showSymbol: false });
}

/**
 * Parses a currency string and returns the numeric value
 * @param currencyString - String like "₦12,500" or "12500"
 * @returns Numeric value
 */
export function parseCurrency(currencyString: string): number {
  if (!currencyString) return 0;
  
  // Remove currency symbol and commas
  const cleaned = currencyString.replace(/[₦,\s]/g, '');
  const parsed = parseFloat(cleaned);
  
  return isNaN(parsed) ? 0 : parsed;
}
