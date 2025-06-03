import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import React, { Fragment } from 'react'

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
	children,
	maxWidth = 'max-w-md'
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<Transition
					appear
					show={isOpen}
					as={Fragment}
				>
					<Dialog
						as='div'
						className='relative z-50'
						onClose={onClose}
					>
						{/* Backdrop */}
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-200'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<motion.div
								className='bg-background/50 fixed inset-0 backdrop-blur-sm'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2, ease: 'easeInOut' }}
							/>
						</Transition.Child>

						{/* Dialog */}
						<div className='fixed inset-0 flex items-center justify-center p-4'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-200'
								enterFrom='opacity-0 scale-95 translate-y-5'
								enterTo='opacity-100 scale-100 translate-y-0'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100 translate-y-0'
								leaveTo='opacity-0 scale-95 translate-y-5'
							>
								<Dialog.Panel
									as={motion.div}
									initial={{ opacity: 0, scale: 0.95, y: 10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95, y: 10 }}
									className={`w-full ${maxWidth} bg-card mx-auto max-h-[90vh] overflow-y-auto rounded-2xl shadow-lg will-change-transform`}
								>
									{/* Header */}
									<div className={`bg-background relative px-6 py-8`}>
										<button
											onClick={onClose}
											className='text-foreground hover:bg-fotext-foreground/20 absolute top-4 right-4 rounded-full p-2 transition-colors'
											aria-label='Close'
										>
											<X className='h-5 w-5' />
										</button>
										<motion.div
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.2,
												delay: 0.1,
												ease: 'easeOut'
											}}
										>
											<Dialog.Title
												as='h1'
												className='text-foreground mb-2 text-xl font-bold'
											>
												{title}
											</Dialog.Title>
											<Dialog.Description
												as='p'
												className='text-foreground/80 text-sm'
											>
												{subtitle}
											</Dialog.Description>
										</motion.div>
									</div>

									{/* Content */}
									{children}
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition>
			)}
		</AnimatePresence>
	)
}

export default AuthLayoutDialog
