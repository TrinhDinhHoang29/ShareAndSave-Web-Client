import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import itemWarehouseApi from '@/apis/modules/item-warehouse.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse, IItemWarehouseRequest } from '@/models/interfaces'

interface useCreateItemWarehouseMutationOptions {
	onSuccess?: () => void
}

interface useUpdateItemWarehouseMutationOptions {
	onSuccess?: () => void
}

export const useCreateItemWarehouseMutation = ({
	onSuccess
}: useCreateItemWarehouseMutationOptions = {}) => {
	const { showError, showSuccess, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)
	return useMutation({
		mutationFn: ({ data }: { data: IItemWarehouseRequest[] }) => {
			abortControllerRef.current = new AbortController()
			return itemWarehouseApi.create(data, abortControllerRef.current.signal)
		},
		onSuccess: res => {
			if (res.code === 200 || res.code === 201) {
				showSuccess({
					successButtonText: 'Xác nhận',
					successMessage:
						'Đăng ký nhận đồ thành công. Vui lòng đợi thông báo để nhận phiếu hẹn.',
					successTitle: 'Thông tin đăng ký nhận đồ',
					onConfirm: close
				})
				onSuccess?.()
			} else {
				const errorMessage = res.message
				const cleanedMessage = errorMessage.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: cleanedMessage,
					errorTitle: 'Lỗi thông tin giao dịch',
					onConfirm: close
				})
			}
		},
		onError: (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
			const cleanedMessage = errorMessage.split(':')[0].trim()
			showError({
				errorButtonText: 'Thử lại',
				errorMessage: cleanedMessage,
				errorTitle: 'Lỗi thông tin giao dịch',
				onConfirm: close
			})
		}
	})
}

interface useUpdateItemWarehouseMutationOptions {
	onSuccess?: () => void
	onMutate?: (itemId: string) => void
	onSettled?: (itemId: string) => void
}

// Updated mutation hook
export const useUpdateItemWarehouseMutation = ({
	onSuccess,
	onMutate,
	onSettled
}: useUpdateItemWarehouseMutationOptions = {}) => {
	const { showSuccess, showError, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: ({ data }: { data: IItemWarehouseRequest }) => {
			abortControllerRef.current = new AbortController()
			return itemWarehouseApi.update(data, abortControllerRef.current.signal)
		},
		onMutate: async variables => {
			onMutate?.(variables.data.itemID.toString())
		},
		onSuccess: async res => {
			if (res.code === 200 || res.code === 201) {
				showSuccess({
					successButtonText: 'Xác nhận',
					successMessage: 'Cập nhật số lượng thành công!',
					successTitle: 'Thông tin đăng ký nhận đồ',
					onConfirm: close
				})
				onSuccess?.()
			} else {
				const errorMessage = res.message.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: errorMessage,
					errorTitle: 'Lỗi thông tin giao dịch',
					onConfirm: close
				})
			}
		},
		onError: async (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
				.split(':')[0]
				.trim()
			showError({
				errorButtonText: 'Thử lại',
				errorMessage: errorMessage,
				errorTitle: 'Lỗi thông tin giao dịch',
				onConfirm: close
			})
		},
		onSettled: async (_data, _error, variables) => {
			onSettled?.(variables.data.itemID.toString())
		}
	})
}

interface useDeleteItemWarehouseMutationOptions {
	onSuccess?: () => void
	onMutate?: (itemId: string) => void
	onSettled?: (itemId: string) => void
}

// Deleted mutation hook
export const useDeleteItemWarehouseMutation = ({
	onSuccess,
	onMutate,
	onSettled
}: useDeleteItemWarehouseMutationOptions = {}) => {
	const { showSuccess, showError, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: (itemID: number) => {
			abortControllerRef.current = new AbortController()
			return itemWarehouseApi.delete(itemID, abortControllerRef.current.signal)
		},
		onMutate: async variables => {
			onMutate?.(variables.toString())
		},
		onSuccess: async res => {
			if (res.code === 200 || res.code === 201) {
				showSuccess({
					successButtonText: 'Xác nhận',
					successMessage: 'Xóa thành công!',
					successTitle: 'Thông tin đăng ký nhận đồ',
					onConfirm: close
				})
				onSuccess?.()
			} else {
				const errorMessage = res.message.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: errorMessage,
					errorTitle: 'Lỗi thông tin đăng ký nhận đồ',
					onConfirm: close
				})
			}
		},
		onError: async (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
				.split(':')[0]
				.trim()
			showError({
				errorButtonText: 'Thử lại',
				errorMessage: errorMessage,
				errorTitle: 'Lỗi thông tin giao dịch',
				onConfirm: close
			})
		},
		onSettled: async (_data, _error, variables) => {
			onSettled?.(variables.toString())
		}
	})
}
