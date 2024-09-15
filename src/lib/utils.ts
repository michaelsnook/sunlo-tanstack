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
