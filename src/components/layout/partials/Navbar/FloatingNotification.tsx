import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRightLeft, Bell, Clipboard, Clock, X } from 'lucide-react'
import React, { useMemo } from 'react'

import { formatNearlyDateTimeVN } from '@/lib/utils'
import { ENotiTargetType, ENotiType } from '@/models/enums'
import { INoti } from '@/models/interfaces'

interface FloatingNotificationProps {
	isOpen: boolean
	notification: INoti | null
	onClose: () => void
	autoHideDelay?: number
}

const getNotificationType = (type: ENotiType, targetType: ENotiTargetType) => {
	// Determine background gradient based on notification type and target type
	const getBgGradient = () => {
		if (type === ENotiType.SYSTEM) {
			return 'from-warning/20 to-warning/10 text-warning '
		} else {
			return 'from-primary/20 to-primary/10 text-primary'
		}
	}

	// Determine icon based on target type
	const getIcon = () => {
		switch (targetType) {
			case ENotiTargetType.INTEREST:
				return <ArrowRightLeft className='h-5 w-5' />
			case ENotiTargetType.APPOINTMENT:
				return <Clock className='h-5 w-5' />
			case ENotiTargetType.POST:
				return <Clipboard className='h-5 w-5' />
			default:
				return <Bell className='h-5 w-5' />
		}
	}

	return {
		bgGradient: getBgGradient(),
		icon: getIcon()
	}
}

const FloatingNotification: React.FC<FloatingNotificationProps> = ({
	notification,
	onClose,
	autoHideDelay = 5000,
	isOpen
}) => {
	// Auto hide effect
	React.useEffect(() => {
		if (notification && autoHideDelay > 0) {
			const timer = setTimeout(() => {
				onClose()
			}, autoHideDelay)

			return () => clearTimeout(timer)
		}
	}, [notification, autoHideDelay, onClose])

	const notificationType = useMemo(() => {
		if (notification) {
			return getNotificationType(notification.type, notification.targetType)
		}
		return null
	}, [notification])
	return (
		<div className='pointer-events-none fixed top-4 right-4 z-50'>
			<AnimatePresence>
				{isOpen && notification && (
					<motion.div
						initial={{ x: 400, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: 400, opacity: 0 }}
						transition={{
							type: 'spring',
							stiffness: 400,
							damping: 25,
							mass: 0.8
						}}
						className='bg-card/95 border-border/30 pointer-events-auto w-full max-w-sm rounded-lg border shadow-xl backdrop-blur-md'
					>
						{/* Header */}
						<div className='from-primary/5 to-accent/5 border-border/30 border-b bg-gradient-to-r p-3'>
							<div className='flex items-center justify-between'>
								<motion.span
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.1 }}
									className='text-foreground text-sm font-semibold'
								>
									Thông báo mới
								</motion.span>
								<motion.button
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={onClose}
									className='text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full p-1 transition-colors'
									aria-label='Đóng thông báo'
								>
									<X className='h-4 w-4' />
								</motion.button>
							</div>
						</div>

						{/* Content */}
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.15 }}
							className='p-4'
						>
							<div className='flex items-start gap-3'>
								{/* Icon với background */}
								<div className='relative flex-shrink-0'>
									<motion.div
										initial={{ scale: 0 }}
										animate={{ scale: 1 }}
										transition={{
											delay: 0.2,
											type: 'spring',
											stiffness: 500,
											damping: 15
										}}
										className={clsx(
											'flex h-8 w-8 items-center justify-center rounded-full',
											'bg-gradient-to-br shadow-sm',
											notificationType?.bgGradient
										)}
									>
										{notificationType?.icon}
									</motion.div>
									{!notification.isRead && (
										<motion.div
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											transition={{ delay: 0.3 }}
											className='bg-destructive border-card absolute -top-1 -right-1 h-2 w-2 rounded-full border'
										/>
									)}
								</div>

								<div className='min-w-0 flex-1'>
									<div className='space-y-1'>
										{/* Sender Name */}
										<motion.div
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.25 }}
											className='flex items-center gap-2'
										>
											<p className='text-foreground truncate text-sm font-semibold'>
												{notification.senderName || `Hệ thống`}
											</p>
											<span className='text-muted-foreground flex-shrink-0 text-xs'>
												{formatNearlyDateTimeVN(notification.createdAt)}
											</span>
										</motion.div>

										{/* Content */}
										<motion.p
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 0.3 }}
											className='text-muted-foreground line-clamp-3 text-sm leading-relaxed'
										>
											{notification.content || 'Thông báo mới'}
										</motion.p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Progress bar for auto-hide */}
						{autoHideDelay > 0 && (
							<div className='bg-muted/30 h-1 overflow-hidden rounded-b-lg'>
								<motion.div
									initial={{ width: '100%' }}
									animate={{ width: '0%' }}
									transition={{
										duration: autoHideDelay / 1000,
										ease: 'linear'
									}}
									className='from-primary to-accent h-full rounded-b-lg bg-gradient-to-r'
								/>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default FloatingNotification
