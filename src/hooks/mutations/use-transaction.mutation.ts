import { useMutation } from '@tanstack/react-query'
import { useRef } from 'react'

import transactionApi from '@/apis/modules/transaction.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { ETransactionStatus } from '@/models/enums'
import {
	IApiErrorResponse,
	ITransaction,
	ITransactionRequest
} from '@/models/interfaces'

interface useCreateTransactionMutationOptions {
	onSuccess?: (transition: ITransaction) => void
}

interface useUpdateTransactionMutationOptions {
	onSuccess?: (status: ETransactionStatus) => void
}

export const useCreateTransactionMutation = ({
	onSuccess
}: useCreateTransactionMutationOptions = {}) => {
	const { showError, showLoading, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)
	return useMutation({
		mutationFn: ({ data }: { data: ITransactionRequest }) => {
			abortControllerRef.current = new AbortController()
			return transactionApi.create(data, abortControllerRef.current.signal)
		},
		onMutate: async () => {
			showLoading({
				loadingMessage: 'Đang tạo giao dịch...',
				showCancel: true,
				onCancel: () => {
					abortControllerRef.current?.abort()
					close()
				}
			})
		},
		onSuccess: res => {
			if (res.code === 200) {
				// close()
				onSuccess?.(res.data.transaction)
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

export const useUpdateTransactionMutation = ({
	onSuccess
}: useUpdateTransactionMutationOptions = {}) => {
	const { showSuccess, showError, showLoading, close } = useAlertModalContext()
	const abortControllerRef = useRef<AbortController | null>(null)

	return useMutation({
		mutationFn: ({
			transactionID,
			data
		}: {
			transactionID: number
			data: ITransactionRequest
		}) => {
			abortControllerRef.current = new AbortController()
			return transactionApi.update(
				transactionID,
				data,
				abortControllerRef.current.signal
			)
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
				const status =
					res.data.transaction.status.toString() as ETransactionStatus
				if (status === ETransactionStatus.PENDING) {
					showSuccess({
						successButtonText: 'Xác nhận',
						successMessage: 'Cập nhật thông tin giao dịch thành công',
						successTitle: 'Thông tin giao dịch',
						onConfirm: close // Đóng modal khi nhấn "Xác nhận" trên success
					})
				} else {
					close()
				}
				onSuccess?.(status)
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
