import clsx from 'clsx'
import { Bell, Clock, Heart, Loader2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

import Dropdown from '@/components/common/Dropdown'
import Loading from '@/components/common/Loading'
import { useListNotiQuery } from '@/hooks/queries/use-noti.query'
import { getAccessToken } from '@/lib/token'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import { ENotiTargetType, ENotiType } from '@/models/enums'
import { INoti } from '@/models/interfaces'

const DropdownNoti: React.FC = () => {
	const token = getAccessToken()

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		error,
		refetch
	} = useListNotiQuery(token || '', { limit: 10 })

	const { ref, inView } = useInView({
		threshold: 0,
		rootMargin: '100px'
	})

	// Infinite scroll effect
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

	// Get all notifications and unread count
	const allNotifications = data?.pages.flatMap(page => page.notifications) || []
	const unreadCount = data?.pages[0]?.unreadCount || 0

	// Get notification icon based on type and target type
	const getNotificationIcon = (
		type: ENotiType,
		targetType: ENotiTargetType
	) => {
		if (type === ENotiType.SYSTEM) {
			return <Bell className='text-warning h-5 w-5' />
		}

		// For NORMAL notifications, differentiate by targetType
		switch (targetType) {
			case ENotiTargetType.INTEREST:
				return <Heart className='text-primary h-5 w-5' />
			case ENotiTargetType.APPOINTMENT:
				return <Clock className='text-accent h-5 w-5' />
			default:
				return <Bell className='text-muted-foreground h-5 w-5' />
		}
	}

	const NotificationItem: React.FC<{ notification: INoti }> = ({
		notification
	}) => (
		<div
			className={clsx(
				'group border-border/30 flex items-start gap-4 border-b p-4 last:border-b-0',
				'hover:from-accent/5 hover:to-primary/5 transition-all duration-200 hover:bg-gradient-to-r',
				'relative cursor-pointer overflow-hidden',
				!notification.isRead && 'from-primary/5 to-accent/5 bg-gradient-to-r'
			)}
		>
			{/* Icon with background */}
			<div className='relative flex-shrink-0'>
				<div
					className={clsx(
						'flex h-10 w-10 items-center justify-center rounded-full',
						'bg-gradient-to-br shadow-sm',
						notification.type === ENotiType.SYSTEM
							? 'from-warning/20 to-warning/10'
							: notification.targetType === ENotiTargetType.INTEREST
								? 'from-primary/20 to-primary/10'
								: 'from-accent/20 to-accent/10'
					)}
				>
					{getNotificationIcon(notification.type, notification.targetType)}
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
							{notification.senderName || `Người dùng ${notification.senderID}`}
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

	const LoadingState = () => (
		<div className='flex items-center justify-center p-8'>
			<div className='relative'>
				<Loader2 className='text-primary h-6 w-6 animate-spin' />
				<div className='bg-primary/20 absolute inset-0 animate-pulse rounded-full' />
			</div>
			<span className='text-muted-foreground ml-3 text-sm'>
				Đang tải thông báo...
			</span>
		</div>
	)

	const EmptyState = () => (
		<div className='flex flex-col items-center justify-center p-12 text-center'>
			<div className='relative mb-4'>
				<div className='from-muted/50 to-muted/20 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br'>
					<Bell className='text-muted-foreground/50 h-8 w-8' />
				</div>
				<div className='from-primary/10 to-accent/10 absolute inset-0 animate-pulse rounded-full bg-gradient-to-br' />
			</div>
			<h3 className='text-foreground mb-2 font-medium'>Chưa có thông báo</h3>
			<p className='text-muted-foreground max-w-48 text-sm'>
				Thông báo mới sẽ xuất hiện tại đây khi có hoạt động
			</p>
		</div>
	)

	const ErrorState = () => (
		<div className='flex flex-col items-center justify-center p-12 text-center'>
			<div className='from-destructive/20 to-destructive/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br'>
				<span className='text-2xl'>⚠️</span>
			</div>
			<h3 className='text-destructive mb-2 font-medium'>
				Không thể tải thông báo
			</h3>
			<p className='text-muted-foreground mb-4 text-sm'>Vui lòng thử lại sau</p>
			<button
				onClick={() => refetch()}
				className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2 text-sm transition-colors'
			>
				Thử lại
			</button>
		</div>
	)

	// Trigger button
	const trigger = (
		<button
			className='hover:bg-muted relative rounded-full p-2 transition-colors'
			title='Thông báo'
		>
			<Bell className='h-5 w-5' />
			{unreadCount > 0 && (
				<span className='bg-destructive absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full'>
					{unreadCount > 99 ? (
						<span className='text-primary-foreground text-[8px] font-bold'>
							99+
						</span>
					) : unreadCount > 9 ? (
						<span className='text-primary-foreground text-[8px] font-bold'>
							{unreadCount}
						</span>
					) : (
						<span className='text-primary-foreground text-[10px] font-bold'>
							{unreadCount}
						</span>
					)}
				</span>
			)}
		</button>
	)

	return (
		<Dropdown
			trigger={trigger}
			position='right'
		>
			<div className='bg-card w-96 overflow-hidden rounded-md shadow-xl backdrop-blur-xl'>
				{/* Header */}
				<div className='from-primary/5 to-accent/5 border-border/30 border-b bg-gradient-to-r p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-3'>
							<div className='from-primary to-accent flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br'>
								<Bell className='h-4 w-4 text-white' />
							</div>
							<h3 className='text-foreground font-semibold'>Thông báo</h3>
						</div>
						<div className='flex items-center gap-3'>
							{unreadCount > 0 && (
								<span className='text-primary bg-primary/10 rounded-full px-2 py-1 text-xs font-medium'>
									{unreadCount} mới
								</span>
							)}
						</div>
					</div>
				</div>

				{/* Content */}
				<div className='custom-scrollbar max-h-[400px] overflow-y-auto'>
					{isLoading ? (
						<LoadingState />
					) : error ? (
						<ErrorState />
					) : allNotifications.length === 0 ? (
						<EmptyState />
					) : (
						<>
							{allNotifications.map(notification => (
								<NotificationItem
									key={notification.id}
									notification={notification}
								/>
							))}

							{/* Infinite scroll trigger */}
							{hasNextPage && (
								<div
									ref={ref}
									className='h-4'
								>
									{isFetchingNextPage && <Loading size='sm' />}
								</div>
							)}

							{!hasNextPage && allNotifications.length > 0 && (
								<div className='py-4 text-center'>
									<span className='text-muted-foreground text-sm'>
										Đã hiển thị tất cả thông báo
									</span>
								</div>
							)}
						</>
					)}
				</div>
			</div>
		</Dropdown>
	)
}

export default DropdownNoti
