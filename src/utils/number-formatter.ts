/**
 * Formats a number with comma separators
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted number string with comma separators
 */
export const formatNumberWithCommas = (value: number | string, decimals: number = 0): string => {
  if (value === null || value === undefined) return '';
  
  // Convert to number if string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if the value is a valid number
  if (isNaN(numValue)) return '';
  
  // Format the number with commas and specified decimal places
  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats a price with comma separators and currency symbol
 * @param value - The price to format
 * @param currency - Currency symbol (default: '')
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted price string with comma separators and currency symbol
 */
export const formatPrice = (value: number | string, currency: string = '', decimals: number = 0): string => {
  const formattedNumber = formatNumberWithCommas(value, decimals);
  return currency ? `${currency}${formattedNumber}` : formattedNumber;
}; 