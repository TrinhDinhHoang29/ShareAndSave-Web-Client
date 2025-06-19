import { ChevronDown } from 'lucide-react'
import React from 'react'

const ScrollToBottomButton = React.memo(
	({
		onClick,
		unreadCount,
		show
	}: {
		onClick: () => void
		unreadCount: number
		show: boolean
	}) => {
		if (!show) return null

		return (
			<div className='absolute bottom-20 left-1/2 z-10 -translate-x-1/2'>
				<button
					onClick={onClick}
					className='bg-primary hover:bg-primary/90 text-primary-foreground relative flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition-all duration-200 hover:shadow-xl'
				>
					<ChevronDown className='h-4 w-4' />
					{unreadCount > 0 && (
						<div className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white'>
							{unreadCount > 99 ? '99+' : unreadCount}
						</div>
					)}
				</button>
			</div>
		)
	}
)

export default ScrollToBottomButton
