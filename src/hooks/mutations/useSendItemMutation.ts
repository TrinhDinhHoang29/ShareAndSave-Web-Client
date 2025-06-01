import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import postApi from '@/apis/modules/post.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	IApiErrorResponse,
	IPostRequest,
	IPostResponse
} from '@/models/interfaces'

interface UseSendItemMutationOptions {
	onSuccess?: (data: IPostResponse) => void
	onError?: () => void
	onSettled?: () => void
}

export const useSendItemMutation = ({
	onSuccess,
	onError,
	onSettled
}: UseSendItemMutationOptions = {}) => {
	const { showLoading, showError, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: (data: IPostRequest) => {
			abortControllerRef.current = new AbortController()
			return postApi.create(data, abortControllerRef.current.signal)
		},
		onMutate: () => {
			showLoading({
				loadingMessage: 'Đang gửi yêu cầu...',
				showCancel: true,
				onCancel: () => {
					abortControllerRef.current?.abort()
					close()
				}
			})
		},
		onSuccess: res => {
			if (res.code === 200) {
				close()
				onSuccess?.(res.data)
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
