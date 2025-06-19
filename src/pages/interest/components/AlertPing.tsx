import clsx from 'clsx'
import { useEffect, useState } from 'react'

interface AlertPingProps {
	isPulse?: boolean
	duration?: number // Thời gian ping (ms), mặc định 3000ms
}

const AlertPing = ({ isPulse = false }: AlertPingProps) => {
	return (
		<span className='absolute -top-1 -right-2 flex size-4'>
			<span
				className={clsx(
					'absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75',
					isPulse && 'animate-ping'
				)}
			/>
			<span className='relative inline-flex size-4 rounded-full bg-red-600' />
		</span>
	)
}

export default AlertPing
