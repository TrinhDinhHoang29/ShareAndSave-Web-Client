import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Bell, Check, CircleAlert } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

import postApi from '@/apis/modules/post.api'
import NotiSound from '@/assets/sound_effect/noti_sound.wav'
import Dropdown from '@/components/common/Dropdown'
import Loading from '@/components/common/Loading'
import { useNoti } from '@/context/notification-context'
import {
	useUpdateNotiAllMutation,
	useUpdateNotiByIDMutation
} from '@/hooks/mutations/use-noti.mutation'
import { useListNotiQuery } from '@/hooks/queries/use-noti.query'
import { getAccessToken } from '@/lib/token'
import { ENotiTargetType } from '@/models/enums'
import { INoti } from '@/models/interfaces'

import FloatingNotification from './FloatingNotification'
import NotificationItem from './NotificationItem'

const DropdownNoti: React.FC = () => {
	const queryClient = useQueryClient()
	const token = getAccessToken()
	const { noti } = useNoti()
	const [newNotification, setNewNotification] = useState<INoti | null>(null)
	const [isOpenFloatingNoti, setIsOpenFloatingNoti] = useState<boolean>(false)
	const navigate = useNavigate()
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const { mutate: updateNotiAll, isPending: isMarkingAllRead } =
		useUpdateNotiAllMutation()

	const { mutate: updateNotiByID } = useUpdateNotiByIDMutation()

	const handleNavigate = async (notification: INoti) => {
		if (!notification.isRead) {
			updateNotiByID(notification.id)
		}
		if (notification.targetType === ENotiTargetType.INTEREST) {
			navigate('/chat/' + notification.targetID)
			setIsOpen(false)
		} else if (notification.targetType === ENotiTargetType.POST) {
			const res = await postApi.detailByID(notification.targetID)
			if (res && res.data.post) {
				navigate('/bai-dang/' + res.data.post.slug)
				setIsOpen(false)
			}
		} else if (notification.targetType === ENotiTargetType.APPOINTMENT) {
			navigate('/lich-hen')
			setIsOpen(false)
		}
	}

	// Function to mark all notifications as read
	const handleMarkAllRead = async () => {
		if (unreadCount === 0) return
		updateNotiAll()
	}

	useEffect(() => {
		if (noti && noti !== newNotification) {
			queryClient.setQueryData(['noti', token], (old: any) => {
				if (!old?.pages?.[0]) {
					console.log('old', old)
					return old
				}

				const newPages = [...old.pages]
				newPages[0] = {
					...newPages[0],
					notifications: [noti, ...newPages[0].notifications],
					unreadCount: newPages[0].unreadCount + 1
				}
				console.log('newPages', newPages)

				return {
					...old,
					pages: newPages
				}
			})

			// Hiển thị floating notification
			setNewNotification(noti)
			setIsOpenFloatingNoti(true)

			// Tùy chọn: Phát âm thanh thông báo
			const audio = new Audio(NotiSound)
			audio.volume = 0.3
			audio.play().catch(() => {
				console.log('Could not play notification sound')
			})
		}
	}, [noti])

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
				<CircleAlert className='text-warning text-2xl' />
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
		<>
			<FloatingNotification
				isOpen={isOpenFloatingNoti}
				notification={newNotification}
				onClose={() => setIsOpenFloatingNoti(false)}
				autoHideDelay={5000}
			/>
			<Dropdown
				isOpen={isOpen}
				onOpenChange={setIsOpen}
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
							{unreadCount > 0 && (
								<button
									onClick={handleMarkAllRead}
									disabled={isMarkingAllRead}
									className={clsx(
										'flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all',
										'hover:bg-primary/20 text-primary hover:text-primary/80',
										'disabled:cursor-not-allowed disabled:opacity-50'
									)}
									title='Đánh dấu tất cả đã đọc'
								>
									{isMarkingAllRead ? (
										<Loading size='sm' />
									) : (
										<Check className='h-3 w-3' />
									)}
									<span className='hidden sm:inline'>
										{isMarkingAllRead ? 'Đang xử lý...' : 'Đánh dấu đã đọc'}
									</span>
								</button>
							)}
						</div>
					</div>

					{/* Content */}
					<div className='custom-scrollbar max-h-[400px] overflow-y-auto'>
						{isLoading ? (
							<div className='py-4'>
								<Loading text='Đang tải...' />
							</div>
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
										handleNavigate={handleNavigate}
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
		</>
	)
}

export default DropdownNoti
