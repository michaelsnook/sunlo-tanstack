import { useState, useEffect, useRef, useCallback } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

// credit to: https://medium.com/swlh/using-a-debounced-callback-in-react-ade57d31ca6b
/**
 * Returns a memoized function that will only call the passed function when it hasn't been called for the wait period
 * @param func The function to be called
 * @param wait Wait period after function hasn't been called for
 * @returns A memoized function that is debounced
 */
export function useDebouncedCallback(
	func: CallableFunction,
	wait: number
): CallableFunction {
	// Use a ref to store the timeout between renders
	// and prevent changes to it from causing re-renders
	const timeout = useRef()

	return useCallback(
		(...args) => {
			const later = () => {
				clearTimeout(timeout.current)
				func(...args)
			}

			clearTimeout(timeout.current)
			timeout.current = setTimeout(later, wait)
		},
		[func, wait]
	)
}
