import { useMutation } from '@tanstack/react-query'

import authApi from '@/apis/modules/auth.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse } from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

interface useLoginMutaionOptions {
	onSuccess?: () => void
	onError?: (message: string) => void
	onSettled?: () => void
}

export const useLoginMutaion = ({
	onSuccess,
	onError,
	onSettled
}: useLoginMutaionOptions = {}) => {
	const { showError } = useAlertModalContext()
	const { login } = useAuthStore()

	return useMutation({
		mutationFn: authApi.login,
		onSuccess: res => {
			if (res.code === 200) {
				login(res.data)
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
			const errorMessage = (error as IApiErrorResponse).message
			const cleanedMessage = errorMessage.split(':')[0].trim()
			onError?.(cleanedMessage)
		},
		onSettled: () => {
			onSettled?.()
		}
	})
}
