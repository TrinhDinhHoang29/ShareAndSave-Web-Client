import { AnimatePresence, motion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

// ========== BASE DIALOG COMPONENT ==========
interface BaseDialogProps {
	isOpen: boolean
	onClose: () => void
	title: string
	subtitle: string
	headerColor?: string // Optional, defaults to bg-primary
	children: React.ReactNode
	maxWidth?: string
}

const AuthLayoutDialog: React.FC<BaseDialogProps> = ({
	isOpen,
	onClose,
	title,
	subtitle,
	headerColor = 'bg-primary',
	children,
	maxWidth = 'max-w-md'
}) => {
	const dialogRef = useRef<HTMLDivElement>(null)

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dialogRef.current &&
				!dialogRef.current.contains(event.target as Node)
			) {
				onClose()
			}
		}

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen, onClose])

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='bg-background/50 fixed inset-0 z-40 backdrop-blur-sm'
					/>

					{/* Dialog */}
					<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
						<motion.div
							ref={dialogRef}
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							className={`bg-card w-full rounded-2xl shadow-2xl ${maxWidth} mx-auto max-h-[90vh] overflow-hidden overflow-y-auto`}
						>
							{/* Header */}
							<div className={`relative ${headerColor} px-6 py-8`}>
								<button
									onClick={onClose}
									className='hover:bg-primary/10 text-foreground absolute top-4 right-4 rounded-full p-2 transition-colors'
								>
									<XIcon className='h-5 w-5' />
								</button>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1, duration: 0.3 }}
								>
									<h1 className='text-foreground mb-2 text-2xl font-bold'>
										{title}
									</h1>
									<p className='text-foreground/80 text-sm'>{subtitle}</p>
								</motion.div>
							</div>

							{/* Content */}
							{children}
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>
	)
}

export default AuthLayoutDialog
