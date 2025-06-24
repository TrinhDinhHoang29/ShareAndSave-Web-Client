import { Dialog, Transition } from '@headlessui/react'
import { motion } from 'framer-motion'
import { AlertCircle, Clock, RefreshCw, X } from 'lucide-react'
import React, { useRef } from 'react'

interface NoticeDialogProps {
	isOpen: boolean
	onClose: () => void
	title?: string
	className?: string
}

const NoticeDialog: React.FC<NoticeDialogProps> = ({
	isOpen,
	onClose,
	title = 'Lưu ý quan trọng',
	className = ''
}) => {
	const dialogRef = useRef<HTMLDivElement>(null)

	const styles = {
		container: 'bg-card border-border text-card-foreground',
		icon: 'text-muted-foreground',
		title: 'text-foreground',
		tip: 'border-border bg-muted',
		button: 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
	}

	const backdropVariants = {
		hidden: { opacity: 0, backdropFilter: 'blur(0px)' },
		visible: { opacity: 0.5, backdropFilter: 'blur(8px)' }
	}

	const dialogVariants = {
		hidden: { opacity: 0, scale: 0.9, y: 20 },
		visible: { opacity: 1, scale: 1, y: 0 }
	}

	return (
		<Transition
			appear
			show={isOpen}
			as={React.Fragment}
		>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={onClose}
			>
				<Transition.Child
					as={React.Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<motion.div
						variants={backdropVariants}
						initial='hidden'
						animate='visible'
						exit='hidden'
						transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
						className='fixed inset-0 bg-black/50'
					/>
				</Transition.Child>

				<div className='fixed inset-0 flex items-center justify-center p-4'>
					<Transition.Child
						as={React.Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-95'
						enterTo='opacity-100 scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100'
						leaveTo='opacity-0 scale-95'
					>
						<motion.div
							variants={dialogVariants}
							initial='hidden'
							animate='visible'
							exit='hidden'
							transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
							className={`relative w-full max-w-md ${className}`}
						>
							<Dialog.Panel
								className={`rounded-lg border shadow-lg ${styles.container}`}
								ref={dialogRef}
							>
								{/* Header */}
								<div className='flex items-start justify-between p-6 pb-0'>
									<div className='flex items-start gap-3'>
										<motion.div
											animate={{ scale: [1, 1.2, 1] }}
											transition={{ duration: 0.3 }}
										>
											<AlertCircle
												className={`mt-0.5 h-5 w-5 flex-shrink-0 ${styles.icon}`}
											/>
										</motion.div>
										<Dialog.Title
											as='h3'
											className={`text-base font-semibold ${styles.title}`}
										>
											{title}
										</Dialog.Title>
									</div>
									<button
										onClick={onClose}
										className={`rounded-md p-1.5 transition-all duration-200 hover:scale-110 hover:bg-black/5 dark:hover:bg-white/5 ${styles.icon}`}
										aria-label='Đóng thông báo'
									>
										<X className='h-4 w-4' />
									</button>
								</div>

								{/* Content */}
								<div className='px-6 py-4'>
									<div className='ml-8 space-y-4 text-sm'>
										<motion.div
											initial={{ x: -10, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ delay: 0.1 }}
											className='flex items-start gap-3'
										>
											<Clock
												className={`mt-0.5 h-4 w-4 flex-shrink-0 ${styles.icon}`}
											/>
											<p className='leading-relaxed'>
												<strong>
													Phiếu đăng ký chỉ có hiệu lực trong ngày
												</strong>
												, qua ngày sau phiếu đăng ký sẽ được làm mới.
											</p>
										</motion.div>

										<motion.div
											initial={{ x: -10, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ delay: 0.2 }}
											className='flex items-start gap-3'
										>
											<motion.div
												animate={{ rotate: [0, 360] }}
												transition={{
													duration: 1,
													repeat: Infinity,
													ease: 'linear'
												}}
											>
												<RefreshCw
													className={`mt-0.5 h-4 w-4 flex-shrink-0 ${styles.icon}`}
												/>
											</motion.div>
											<p className='leading-relaxed'>
												Hệ thống sẽ <strong>duyệt phiếu đăng ký của bạn</strong>{' '}
												và thông báo lịch hẹn trong thời gian sớm nhất.
											</p>
										</motion.div>

										<motion.div
											initial={{ y: 10, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ delay: 0.3 }}
											className={`rounded-md border p-3 text-xs ${styles.tip} backdrop-blur-sm`}
										>
											<div className='flex items-center gap-2'>
												<span className='text-base'>💡</span>
												<div>
													<strong>Mẹo:</strong> Hãy đăng ký sớm để đảm bảo có
													chỗ trong ngày bạn mong muốn
												</div>
											</div>
										</motion.div>
									</div>
								</div>

								{/* Actions */}
								<div className='flex justify-end p-6 pt-0'>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={onClose}
										className={`button-ripple rounded-md px-6 py-2.5 text-sm font-medium transition-all duration-200 ${styles.button}`}
									>
										Đã hiểu
									</motion.button>
								</div>
							</Dialog.Panel>
						</motion.div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}

export default NoticeDialog
