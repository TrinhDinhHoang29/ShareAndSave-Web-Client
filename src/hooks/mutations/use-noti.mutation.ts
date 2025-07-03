import { useMutation, useQueryClient } from '@tanstack/react-query'

import notiApi from '@/apis/modules/noti.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse, INoti } from '@/models/interfaces'

interface useUpdateMutationOptions {
	onSuccess?: () => void
}

export const useUpdateNotiByIDMutation = ({
	onSuccess
}: useUpdateMutationOptions = {}) => {
	const { showError } = useAlertModalContext()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: notiApi.updateByID,
		// Optimistic update - cập nhật ngay lập tức trước khi API trả về
		onMutate: async (notiId: number) => {
			// Hủy bỏ các queries đang pending để tránh conflict
			await queryClient.cancelQueries({ queryKey: ['noti'] })

			// Lấy snapshot của data hiện tại để rollback nếu cần
			const previousData = queryClient.getQueryData(['noti'])

			// Optimistically update - đánh dấu notification đã đọc
			queryClient.setQueryData(['noti'], (old: any) => {
				if (!old) return old

				return {
					...old,
					pages: old.pages.map((page: any) => ({
						...page,
						notifications: page.notifications.map((notification: INoti) =>
							notification.id === notiId
								? { ...notification, isRead: true }
								: notification
						),
						// Giảm unreadCount nếu notification chưa được đọc
						unreadCount: page.notifications.some(
							(n: INoti) => n.id === notiId && !n.isRead
						)
							? Math.max(0, page.unreadCount - 1)
							: page.unreadCount
					}))
				}
			})

			// Trả về context để có thể rollback
			return { previousData }
		},

		onSuccess: async res => {
			if (res.code === 200 || res.code === 201) {
				// Invalidate để đảm bảo data sync với server (nhẹ hơn refetch)
				queryClient.invalidateQueries({
					queryKey: ['noti'],
					exact: false
				})
				onSuccess?.()
			} else {
				const errorMessage = res.message.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: errorMessage,
					errorTitle: 'Lỗi thông báo',
					onConfirm: close
				})
			}
		},

		// Rollback nếu có lỗi
		onError: async (error: any, notiId, context) => {
			// Khôi phục data trước đó
			if (context?.previousData) {
				queryClient.setQueryData(['noti'], context.previousData)
			}

			const errorMessage = (error as IApiErrorResponse).message
				.split(':')[0]
				.trim()
			showError({
				errorButtonText: 'Thử lại',
				errorMessage: errorMessage,
				errorTitle: 'Lỗi thông báo',
				onConfirm: close
			})
		},

		// Luôn invalidate sau khi settled để đảm bảo consistency
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['noti'],
				exact: false
			})
		}
	})
}

export const useUpdateNotiAllMutation = ({
	onSuccess
}: useUpdateMutationOptions = {}) => {
	const { showError } = useAlertModalContext()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: notiApi.updateAll,

		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: ['noti'] })

			const previousData = queryClient.getQueryData(['noti'])

			// Đánh dấu tất cả notification đã đọc
			queryClient.setQueryData(['noti'], (old: any) => {
				if (!old) return old

				return {
					...old,
					pages: old.pages.map((page: any) => ({
						...page,
						notifications: page.notifications.map((notification: INoti) => ({
							...notification,
							isRead: true
						})),
						unreadCount: 0 // Reset unread count
					}))
				}
			})

			return { previousData }
		},

		onSuccess: async res => {
			if (res.code === 200 || res.code === 201) {
				queryClient.invalidateQueries({
					queryKey: ['noti'],
					exact: false
				})
				onSuccess?.()
			} else {
				const errorMessage = res.message.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: errorMessage,
					errorTitle: 'Lỗi thông báo',
					onConfirm: close
				})
			}
		},

		onError: async (error: any, variables, context) => {
			if (context?.previousData) {
				queryClient.setQueryData(['noti'], context.previousData)
			}

			const errorMessage = (error as IApiErrorResponse).message
				.split(':')[0]
				.trim()
			showError({
				errorButtonText: 'Thử lại',
				errorMessage: errorMessage,
				errorTitle: 'Lỗi thông báo',
				onConfirm: close
			})
		},

		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ['noti'],
				exact: false
			})
		}
	})
}
