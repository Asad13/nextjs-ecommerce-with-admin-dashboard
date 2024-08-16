export function formatCurrency(
  amount: number,
  format = 'en-US',
  currency = 'USD'
) {
  const currencyFormatter = new Intl.NumberFormat(format, {
    currency,
    style: 'currency',
    minimumFractionDigits: 0,
  });

  return currencyFormatter.format(amount);
}

export function formatNumber(number: number, format = 'en-US') {
  const numberFormatter = new Intl.NumberFormat(format);

  return numberFormatter.format(number);
}

type DateStyle = 'full' | 'long' | 'medium' | 'short';

export function formatDate(date: Date, locale = 'en', dateStyle?: DateStyle) {
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: dateStyle ?? 'medium',
  });

  return dateFormatter.format(date);
}
