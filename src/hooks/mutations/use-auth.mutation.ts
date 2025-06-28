import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import authApi from '@/apis/modules/auth.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	IApiErrorResponse,
	IUser,
	IVerifySignupError
} from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

interface useLoginMutationOptions {
	onSuccess?: () => void
	onError?: (message: string) => void
	onSettled?: () => void
	onMutate?: () => void
}

interface useRegisterMutaionOptions {
	onSuccess?: () => void
	onError?: (message: string) => void
	onSettled?: () => void
	onMutate?: () => void
}

interface useVerifyOTPMutaionOptions {
	onSuccess?: (verifyOTP: string) => void
	onError?: (message: string) => void
	onSettled?: () => void
}

interface useVerifySignupMutaionOptions {
	onSuccess?: () => void
	onError?: (error: IVerifySignupError) => void
	onSettled?: () => void
}

interface UseUpdateUserMutationOptions {
	onSuccess?: (user: IUser) => void
	onError?: () => void
	onSettled?: () => void
}

export const useLoginMutation = ({
	onSuccess,
	onError,
	onSettled,
	onMutate
}: useLoginMutationOptions = {}) => {
	const { login } = useAuthStore()

	return useMutation({
		mutationFn: authApi.login,
		onMutate: () => {
			onMutate?.()
		},
		onSuccess: res => {
			if (res.code === 200 || res.code === 201) {
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

export const useRegisterMutation = ({
	onSuccess,
	onError,
	onSettled,
	onMutate
}: useRegisterMutaionOptions = {}) => {
	return useMutation({
		mutationFn: authApi.register,
		onMutate: () => {
			onMutate?.()
		},
		onSuccess: res => {
			if (res.code === 200 || res.code === 201) {
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

export const useSendOTPMutation = ({
	onSuccess,
	onError,
	onSettled
}: useRegisterMutaionOptions = {}) => {
	return useMutation({
		mutationFn: authApi.sendOTP,
		onSuccess: res => {
			if (res.code === 200 || res.code === 201) {
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

export const useVerifyOTPMutation = ({
	onSuccess,
	onError,
	onSettled
}: useVerifyOTPMutaionOptions = {}) => {
	return useMutation({
		mutationFn: authApi.verifyOTP,
		onSuccess: res => {
			if (res.code === 200 || res.code === 201) {
				onSuccess?.(res.data.verifyToken)
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

export const useVerifySignupMutation = ({
	onSuccess,
	onError,
	onSettled
}: useVerifySignupMutaionOptions = {}) => {
	return useMutation({
		mutationFn: authApi.verifySignup,
		onSuccess: res => {
			if (res.code === 200 || res.code === 201) {
				onSuccess?.()
			}
		},
		onError: (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
			const field = errorMessage.split(':')[0].trim()
			const message =
				errorMessage.split(':')[1]?.trim() || 'Đã xảy ra lỗi không xác định'
			onError?.({
				field,
				message
			})
		},
		onSettled: () => {
			onSettled?.()
		}
	})
}

export const useResetPasswordMutation = ({
	onSuccess,
	onError,
	onSettled
}: useRegisterMutaionOptions = {}) => {
	return useMutation({
		mutationFn: authApi.resetPassword,
		onSuccess: res => {
			if (res.code === 200 || res.code === 201) {
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
	const { showLoading, showError, showSuccess } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: ({ clientID, data }: { clientID: number; data: IUser }) => {
			abortControllerRef.current = new AbortController()
			return authApi.update(clientID, data, abortControllerRef.current.signal)
		},
		onMutate: () => {
			showLoading({
				loadingMessage: 'Đang cập nhật thông tin...'
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
