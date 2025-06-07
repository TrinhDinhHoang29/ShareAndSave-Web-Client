import { useMutation } from '@tanstack/react-query'

import authApi from '@/apis/modules/auth.api'
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
