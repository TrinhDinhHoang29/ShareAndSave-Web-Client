import clsx from 'clsx'
import React from 'react'

interface BaseModalProps {
	isOpen: boolean
	onClose: () => void
	children: React.ReactNode
	className?: string
	showCloseButton?: boolean
	backdropClose?: boolean
}

const BaseModal: React.FC<BaseModalProps> = ({
	isOpen,
	onClose,
	children,
	className = '',
	showCloseButton = true,
	backdropClose = true
}) => {
	if (!isOpen) return null

	return (
		<div
			className={clsx(
				'fixed inset-0 bg-gradient-to-br from-black/40 via-gray-900/50 to-black/60',
				'modal-backdrop z-[1000] flex items-center justify-center p-4'
			)}
			onClick={e => {
				if (e.target === e.currentTarget && backdropClose) {
					onClose()
				}
			}}
		>
			<div
				className={clsx(
					'bg-card/80 border-border/50 modal-enter relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl backdrop-blur-md',
					className
				)}
			>
				<div className='gradient-shift absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-20' />
				<div className='relative rounded-3xl bg-white/90 backdrop-blur-sm'>
					{showCloseButton && (
						<div className='flex justify-end p-4 pb-0'>
							<button
								onClick={onClose}
								className={clsx(
									'rounded-full p-2 text-gray-400 hover:bg-white/50 hover:text-gray-600',
									'backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:rotate-90'
								)}
							>
								<svg
									className='h-5 w-5'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M6 18L18 6M6 6l12 12'
									/>
								</svg>
							</button>
						</div>
					)}
					{children}
				</div>
			</div>
		</div>
	)
}

export default BaseModal
