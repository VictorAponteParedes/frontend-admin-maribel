export const formatCurrency = (
  amount: number,
  prefix = 'Gs. '
): string => {
  const formatted = new Intl.NumberFormat('es-PY', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));
  return `${prefix}${formatted}`;
};

export const formatGuarani = (amount: number): string => {
  return new Intl.NumberFormat('es-PY', {
    maximumFractionDigits: 0,
  }).format(Math.round(amount || 0));
};

export const parseGuarani = (value: string): number => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned ? parseInt(cleaned, 10) : 0;
};

export const formatDate = (
  date: string | Date,
  locale = 'es-PY'
): string => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};
