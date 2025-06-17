import clsx from 'clsx'
import { useEffect, useState } from 'react'

const AlertPing = ({ isPulse: initialPulse = false }) => {
	const [isPulse, setIsPulse] = useState(initialPulse)

	useEffect(() => {
		let timer: NodeJS.Timeout
		if (initialPulse) {
			setIsPulse(true) // Kích hoạt animation
			timer = setTimeout(() => {
				setIsPulse(false) // Tắt animation sau 3 giây
			}, 3000) // 3000ms = 3s
		}
		return () => clearTimeout(timer) // Cleanup timer khi component unmount
	}, [initialPulse])

	return (
		<span className='absolute -top-1 -right-2 flex size-4'>
			<span
				className={clsx(
					'absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75',
					isPulse && 'animate-ping'
				)}
			></span>
			<span className='relative inline-flex size-4 rounded-full bg-red-600'></span>
		</span>
	)
}

export default AlertPing
