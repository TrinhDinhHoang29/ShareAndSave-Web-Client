import clsx from 'clsx'
import { useEffect, useState } from 'react'

interface AlertPingProps {
	isPulse?: boolean
	size?: string
	position?: string
	duration?: number // Thời gian hiển thị (ms)
}

const AlertPing = ({
	isPulse = false,
	size = 'size-4',
	position = '-top-1 -right-2',
	duration
}: AlertPingProps) => {
	const [isVisible, setIsVisible] = useState(true)

	useEffect(() => {
		if (duration && duration > 0) {
			const timer = setTimeout(() => {
				setIsVisible(false)
			}, duration)

			return () => clearTimeout(timer)
		}
	}, [duration])

	// Nếu có duration và đã hết thời gian thì ẩn component
	if (duration && !isVisible) {
		return null
	}

	return (
		<span className={clsx('absolute flex', size, position)}>
			<span
				className={clsx(
					'absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75',
					isPulse && 'animate-ping'
				)}
			/>
			<span
				className={clsx('relative inline-flex rounded-full bg-red-600', size)}
			/>
		</span>
	)
}

export default AlertPing
