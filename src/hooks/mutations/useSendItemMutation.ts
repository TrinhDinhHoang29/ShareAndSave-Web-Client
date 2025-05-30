import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import requestApi from '@/apis/modules/request.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse, IRequestSendItemRequest } from '@/models/interfaces'

interface UseSendItemMutationOptions {
	onSuccess?: () => void
	onError?: () => void
	onSettled?: () => void
}

export const useSendItemMutation = ({
	onSuccess,
	onError,
	onSettled
}: UseSendItemMutationOptions = {}) => {
	const { showLoading, showSuccess, showError, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: (data: IRequestSendItemRequest) => {
			abortControllerRef.current = new AbortController()
			return requestApi.sendOldItem(data, abortControllerRef.current.signal)
		},
		onMutate: () => {
			console.log('loading...')
			showLoading({
				loadingMessage: 'Đang gửi yêu cầu...',
				showCancel: true,
				onCancel: () => {
					abortControllerRef.current?.abort()
					close()
				}
			})
		},
		onSuccess: (res, variables) => {
			if (res.code === 200) {
				showSuccess({
					successTitle: 'Gửi yêu cầu thành công!',
					successMessage: `Vui lòng để ý email ${variables.email} để nhận thông tin sớm nhất.`,
					successButtonText: 'Hoàn tất'
				})
				onSuccess?.()
			} else {
				showError({
					errorTitle: 'Lỗi gửi yêu cầu',
					errorMessage:
						res.message ||
						'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.',
					errorButtonText: 'Thử lại'
				})
			}
		},
		onError: (error: any) => {
			if (error.name === 'AbortError') {
				return // Skip error modal for user cancellation
			}
			showError({
				errorTitle: 'Lỗi gửi yêu cầu',
				errorMessage:
					(error as IApiErrorResponse).message ||
					'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.',
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
