import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import authApi from '@/apis/modules/auth.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse, IUser } from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

interface useLoginMutaionOptions {
	onSuccess?: () => void
	onError?: (message: string) => void
	onSettled?: () => void
}

interface UseUpdateUserMutationOptions {
	onSuccess?: (user: IUser) => void
	onError?: () => void
	onSettled?: () => void
}

export const useLoginMutaion = ({
	onSuccess,
	onError,
	onSettled
}: useLoginMutaionOptions = {}) => {
	const { login } = useAuthStore()

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: res => {
			if (res.code === 200) {
				login(res.data)
				onSuccess?.()
			} else {
				const errorMessage = res.message
				const cleanedMessage = errorMessage.split(':')[0].trim()
				onError?.(cleanedMessage)
			}
		},
		onError: (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
			const cleanedMessage = errorMessage.split(':')[0].trim()
			onError?.(cleanedMessage)
		},
		onSettled: () => {
			onSettled?.()
		}
	})
}

export const useUpdateUserMutation = ({
	onSuccess,
	onError,
	onSettled
}: UseUpdateUserMutationOptions = {}) => {
	const { showLoading, showError, close, showSuccess } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: ({ clientID, data }: { clientID: number; data: IUser }) => {
			abortControllerRef.current = new AbortController()
			return authApi.update(clientID, data, abortControllerRef.current.signal)
		},
		onMutate: () => {
			showLoading({
				loadingMessage: 'Đang cập nhật thông tin...',
				showCancel: true,
				onCancel: () => {
					abortControllerRef.current?.abort()
					close()
				}
			})
		},
		onSuccess: res => {
			if (res.code === 200) {
				showSuccess({
					successTitle: 'Cập nhật thông tin',
					successMessage: 'Cập nhật thông tin người dùng thành công',
					successButtonText: 'Đóng'
				})
				onSuccess?.(res.data.client)
			} else {
				showError({
					errorTitle: 'Lỗi cập nhật thông tin',
					errorMessage:
						res.message ||
						'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.',
					errorButtonText: 'Thử lại'
				})
			}
		},
		onError: (error: any) => {
			if (error.name === 'AbortError') {
				return // Skip error modal for user cancellation
			}
			showError({
				errorTitle: 'Lỗi cập nhật thông tin',
				errorMessage:
					(error as IApiErrorResponse).message ||
					'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại sau.',
				errorButtonText: 'Thử lại'
			})
			onError?.()
		},
		onSettled: () => {
			abortControllerRef.current = null // Clean up
			onSettled?.()
		}
	})
}
