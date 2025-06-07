import { useMutation } from '@tanstack/react-query'

import interestApi from '@/apis/modules/interest.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse } from '@/models/interfaces'

interface useCreateInterestMutationOptions {
	onSuccess?: (interestID: number) => void
}

export const useCreateInterestMutation = ({
	onSuccess
}: useCreateInterestMutationOptions = {}) => {
	const { showError } = useAlertModalContext()
	return useMutation({
		mutationFn: interestApi.create,
		onSuccess: res => {
			if (res.code === 200) {
				onSuccess?.(res.data.interestID)
			} else {
				const errorMessage = res.message
				const cleanedMessage = errorMessage.split(':')[0].trim()
				showError({
					errorTitle: 'Hệ thống báo lỗi',
					errorMessage:
						cleanedMessage ||
						'Đã xảy ra lỗi khi quan tâm. Vui lòng thử lại sau.',
					errorButtonText: 'Thử lại'
				})
			}
		},
		onError: (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
			const cleanedMessage = errorMessage.split(':')[0].trim()
			showError({
				errorTitle: 'Hệ thống báo lỗi',
				errorMessage:
					cleanedMessage || 'Đã xảy ra lỗi khi quan tâm. Vui lòng thử lại sau.',
				errorButtonText: 'Thử lại'
			})
		}
	})
}

interface useDeleteInterestMutationOptions {
	onSuccess?: (interestID: number) => void
	onError?: (message: string) => void
	onSettled?: () => void
}

export const useDeleteInterestMutation = ({
	onSuccess,
	onError,
	onSettled
}: useDeleteInterestMutationOptions = {}) => {
	return useMutation({
		mutationFn: interestApi.delete,
		onSuccess: res => {
			if (res.code === 200) {
				onSuccess?.(res.data.interestID)
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
