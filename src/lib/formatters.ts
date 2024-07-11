export function formatCurrency(
  amount: number,
  format = 'en-US',
  currency = 'USD'
) {
  const CURRENCY_FORMATTER = new Intl.NumberFormat(format, {
    currency,
    style: 'currency',
    minimumFractionDigits: 0,
  });

  return CURRENCY_FORMATTER.format(amount);
}

export function formatNumber(number: number, format = 'en-US') {
  const NUMBER_FORMATTER = new Intl.NumberFormat(format);

  return NUMBER_FORMATTER.format(number);
}
