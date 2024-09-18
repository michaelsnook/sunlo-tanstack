import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// this is type-funky bc we're using dynamic keys (TODO consider Map)
export function mapArray<T, K extends keyof T>(arr: Array<T>, key: string) {
  if (!key) throw new Error('Must provide a key to map against')
  if (!arr) return null // uninitialized or null array
  // @ts-ignore
  let result: { [key: K]: T } = {}
  // @ts-ignore
  const valids = arr.filter((item: T) => typeof item[key] === 'string')
  // return empty map
  if (!valids.length) return {}
  valids.forEach((item) => {
    // @ts-ignore
    result[item[key]] = item
  })
  return result
}
