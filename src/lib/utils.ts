import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function mapArray<T>(arr: Array<T>, key: string): { [key: string]: T } {
  const result = {}
  arr.forEach((item) => (result[item[key]] = item))
  return result
}

export const selects = {
  card_full: () => `*, reviews:user_card_review_plus(*)` as const,
  deck_full: () => `*, cards:user_card_plus(${selects.card_full()})` as const,
  phrase_full: () => `*, translations:phrase_translation(*)` as const,
  language_full: () =>
    `*, phrases:phrase_plus(${selects.phrase_full()})` as const,
}
