export const formatBalance = (balance, decimals = 12, fixed = 4) => {
    if (!balance) return '0.0000';
    
    // Remove commas if present and parse to number
    const divisor = Math.pow(10, decimals);
    const numericBalance = parseFloat(balance.toString().replace(/,/g, ''));
    
    // Format to fixed decimal places
    return (numericBalance / divisor).toFixed(fixed);
  };

export const parseBalance = (amount, decimals = 12) => {
  if (!amount) return '0';

  const multiplier = BigInt(10 ** decimals);
  const [whole, fractional = ''] = amount.toString().split('.');

  // Ensure fractional is padded to correct decimals length
  const paddedFractional = (fractional + '0'.repeat(decimals)).slice(0, decimals);

  const numericAmount = BigInt(whole) * multiplier + BigInt(paddedFractional);
  return numericAmount.toString();
};
