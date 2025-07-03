import clsx from 'clsx'
import { ArrowRightLeft, Bell, Clipboard, Clock } from 'lucide-react'
import React from 'react'

import { formatNearlyDateTimeVN } from '@/lib/utils'
import { ENotiTargetType, ENotiType } from '@/models/enums'
import { INoti } from '@/models/interfaces'

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

const NotificationItem: React.FC<{
	notification: INoti
	handleNavigate: (notification: INoti) => void
}> = ({ notification, handleNavigate }) => {
	const { bgGradient, icon } = getNotificationType(
		notification.type,
		notification.targetType
	)
	return (
		<div
			className={clsx(
				'group border-border/30 flex items-start gap-4 border-b p-4 last:border-b-0',
				'hover:from-accent/5 hover:to-primary/5 transition-all duration-200 hover:bg-gradient-to-r',
				'relative cursor-pointer overflow-hidden',
				!notification.isRead && 'from-primary/5 to-accent/5 bg-gradient-to-r'
			)}
			onClick={() => handleNavigate(notification)}
		>
			{/* Icon with background */}
			<div className='relative flex-shrink-0'>
				<div
					className={clsx(
						'flex h-10 w-10 items-center justify-center rounded-full',
						'bg-gradient-to-br shadow-sm',
						bgGradient
					)}
				>
					{icon}
				</div>
				{!notification.isRead && (
					<div className='bg-destructive border-card absolute -top-1 -right-1 h-3 w-3 rounded-full border-2' />
				)}
			</div>

			<div className='min-w-0 flex-1'>
				<div className='space-y-1'>
					{/* Sender Name */}
					<div className='flex items-center gap-2'>
						<p className='text-foreground text-sm font-semibold'>
							{notification.senderName || `Hệ thống`}
						</p>
						<span className='text-muted-foreground text-xs'>
							{formatNearlyDateTimeVN(notification.createdAt)}
						</span>
					</div>

					{/* Content */}
					<p className='text-muted-foreground text-sm leading-relaxed'>
						{notification.content || 'Thông báo mới'}
					</p>
				</div>
			</div>

			{/* Hover effect overlay */}
			<div className='via-primary/2 absolute inset-0 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
		</div>
	)
}

export default NotificationItem
