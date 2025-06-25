import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import postApi from '@/apis/modules/post.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	IApiErrorResponse,
	IMyPostRequest,
	IPostActionRequest,
	IPostActionResponse
} from '@/models/interfaces'

interface UseCreatePostMutationOptions {
	onSuccess?: (data: IPostActionResponse) => void
	onError?: () => void
	onSettled?: () => void
}

interface UseUpdatePostMutationOptions {
	onSuccess?: () => void
}

interface UseDeletePostMutationOptions {
	onSuccess?: () => void
}

export const useCreatePostMutation = ({
	onSuccess,
	onError,
	onSettled
}: UseCreatePostMutationOptions = {}) => {
	const { showLoading, showError, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: (data: IPostActionRequest) => {
			abortControllerRef.current = new AbortController()
			return postApi.create(data, abortControllerRef.current.signal)
		},
		onMutate: () => {
			showLoading({
				loadingMessage: 'Đang gửi bài đăng...',
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
					errorTitle: 'Lỗi gửi bài đăng',
					errorMessage:
						res.message ||
						'Đã xảy ra lỗi khi gửi bài đăng. Vui lòng thử lại sau.',
					errorButtonText: 'Thử lại'
				})
			}
		},
		onError: (error: any) => {
			if (error.name === 'AbortError') {
				return // Skip error modal for user cancellation
			}
			showError({
				errorTitle: 'Lỗi gửi bài đăng',
				errorMessage:
					(error as IApiErrorResponse).message ||
					'Đã xảy ra lỗi khi gửi bài đăng. Vui lòng thử lại sau.',
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

export const useUpdatePostMutation = ({
	onSuccess
}: UseUpdatePostMutationOptions = {}) => {
	const { showSuccess, showError, showLoading, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: ({
			postID,
			data
		}: {
			postID: number
			data: IMyPostRequest
		}) => {
			abortControllerRef.current = new AbortController()
			return postApi.update(postID, data, abortControllerRef.current.signal)
		},
		onMutate: async () => {
			showLoading({
				loadingMessage: 'Đang cập nhật...',
				showCancel: true,
				onCancel: () => {
					abortControllerRef.current?.abort()
					close()
				}
			})
		},
		onSuccess: async res => {
			if (res.code === 200) {
				showSuccess({
					successButtonText: 'Xác nhận',
					successMessage: 'Cập nhật bài đăng thành công',
					successTitle: 'Thông tin bài đăng',
					onConfirm: close // Đóng modal khi nhấn "Xác nhận" trên success
				})
				onSuccess?.()
			} else {
				const errorMessage = res.message.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: errorMessage,
					errorTitle: 'Lỗi thông tin bài đăng',
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
		}
	})
}

export const useDeletePostMutation = ({
	onSuccess
}: UseDeletePostMutationOptions = {}) => {
	const { showSuccess, showError, showLoading, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: (postID: number) => {
			abortControllerRef.current = new AbortController()
			return postApi.delete(postID, abortControllerRef.current.signal)
		},
		onMutate: async () => {
			showLoading({
				loadingMessage: 'Đang tiến hành xóa...',
				showCancel: true,
				onCancel: () => {
					abortControllerRef.current?.abort()
					close()
				}
			})
		},
		onSuccess: async res => {
			if (res.code === 200) {
				showSuccess({
					successButtonText: 'Xác nhận',
					successMessage: 'Xóa bài đăng thành công',
					successTitle: 'Thông tin bài đăng',
					onConfirm: close // Đóng modal khi nhấn "Xác nhận" trên success
				})
				onSuccess?.()
			} else {
				const errorMessage = res.message.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: errorMessage,
					errorTitle: 'Lỗi thông tin bài đăng',
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
		}
	})
}
