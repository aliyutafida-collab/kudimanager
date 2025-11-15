import { parseCurrency } from "@/lib/currency";

interface CurrencyDisplayProps {
  amount: number | string | null | undefined;
  className?: string;
  showDecimals?: boolean;
}

/**
 * CurrencyDisplay component - Renders currency with proper styling
 * Uses CSS classes for emerald green ₦ symbol and clean Inter font
 * 
 * Example usage:
 * <CurrencyDisplay amount={12500} />
 * <CurrencyDisplay amount={totalSales} showDecimals />
 */
export function CurrencyDisplay({ 
  amount, 
  className = '',
  showDecimals = false
}: CurrencyDisplayProps) {
  let numericAmount: number;
  if (amount == null) {
    numericAmount = 0;
  } else if (typeof amount === 'string') {
    numericAmount = parseCurrency(amount);
  } else {
    numericAmount = amount;
  }
  
  const formattedAmount = numericAmount.toLocaleString('en-NG', {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  
  return (
    <span className={`currency-display ${className}`}>
      <span className="currency-symbol">₦</span>
      <span className="currency-amount">{formattedAmount}</span>
    </span>
  );
}
