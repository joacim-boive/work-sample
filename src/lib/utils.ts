import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(timestamp: number) {
  /** TODO: should fetch the user's locale. Can't use navigator.language because it doesn't cover every use case. Like browser in English but lives in Sweden */
  return new Intl.DateTimeFormat('sv-SE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(timestamp);
}

export function formatCurrency(
  amount: number = 0,
  locale: string = 'sv-SE',
  currency: string = 'SEK'
): string {
  const formatter = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(amount);
}
