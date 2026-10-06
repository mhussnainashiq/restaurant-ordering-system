export function formatPrice(amount, currency = 'USD') {
  if (currency === 'PKR') {
    return `Rs ${Number(amount).toFixed(0)}`;
  }
  // Default USD
  return `$${Number(amount).toFixed(2)}`;
}

export function getCurrencySymbol(currency = 'USD') {
  return currency === 'PKR' ? 'Rs' : '$';
}