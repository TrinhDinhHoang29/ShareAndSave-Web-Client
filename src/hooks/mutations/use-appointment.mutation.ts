import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import appointmentApi from '@/apis/modules/appointment.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse, IAppointmentRequest } from '@/models/interfaces'

interface useUpdateAppointmentMutationOptions {
	onSuccess?: () => void
}

export const useUpdateAppointmentMutation = ({
	onSuccess
}: useUpdateAppointmentMutationOptions = {}) => {
	const { showSuccess, showError, showLoading, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: ({
			appointmentID,
			data
		}: {
			appointmentID: number
			data: IAppointmentRequest
		}) => {
			abortControllerRef.current = new AbortController()
			return appointmentApi.update(
				appointmentID,
				data,
				abortControllerRef.current.signal
			)
		},
		onMutate: async () => {
			showLoading({
				loadingMessage: 'Đang cập nhật...'
			})
		},
		onSuccess: async res => {
			if (res.code === 200 || res.code === 201) {
				showSuccess({
					successButtonText: 'Xác nhận',
					successMessage: 'Cập nhật thông tin giao dịch thành công',
					successTitle: 'Thông tin giao dịch',
					onConfirm: close // Đóng modal khi nhấn "Xác nhận" trên success
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
		}
	})
}
