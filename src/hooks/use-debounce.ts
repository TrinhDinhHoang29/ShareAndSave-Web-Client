import { useEffect, useState } from 'react'

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)

		// Cleanup khi component unmount hoặc value thay đổi trước khi timeout
		return () => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return debouncedValue
}

export default useDebounce
