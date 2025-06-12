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
	return useMutation({
		mutationFn: transactionApi.create,
		onSuccess: res => {
			if (res.code === 200) {
				onSuccess?.(res.data.transaction)
			} else {
				const errorMessage = res.message
				const cleanedMessage = errorMessage.split(':')[0].trim()
				console.log(cleanedMessage)
			}
		},
		onError: (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
			const cleanedMessage = errorMessage.split(':')[0].trim()
			console.log(cleanedMessage)
		}
	})
}

export const useUpdateTransactionMutation = ({
	onSuccess
}: useUpdateTransactionMutationOptions = {}) => {
	const { showSuccess, showError, showLoading } = useAlertModalContext()
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
		onMutate: () => {
			showLoading({
				loadingMessage: 'Đang cập nhật...',
				showCancel: true,
				onCancel: () => {
					abortControllerRef.current?.abort()
					close()
				}
			})
		},
		onSuccess: res => {
			if (res.code === 200) {
				const status =
					res.data.transaction.status.toString() as ETransactionStatus
				if (status === ETransactionStatus.PENDING) {
					showSuccess({
						successButtonText: 'Xác nhận',
						successMessage: 'Cập nhật thông tin giao dịch thành công',
						successTitle: 'Thông tin giao dịch'
					})
				} else if (status === ETransactionStatus.CANCELLED) {
					showSuccess({
						successButtonText: 'Xác nhận',
						successMessage: 'Đã từ chối giao dịch thành công',
						successTitle: 'Thông tin giao dịch'
					})
				} else if (status === ETransactionStatus.SUCCESS) {
					showSuccess({
						successButtonText: 'Xác nhận',
						successMessage: 'Đã hoàn tất giao dịch thành công',
						successTitle: 'Thông tin giao dịch'
					})
				}
				onSuccess?.(status)
			} else {
				const errorMessage = res.message
				const cleanedMessage = errorMessage.split(':')[0].trim()
				showError({
					errorButtonText: 'Thử lại',
					errorMessage: cleanedMessage,
					errorTitle: 'Lỗi thông tin giao dịch'
				})
			}
		},
		onError: (error: any) => {
			const errorMessage = (error as IApiErrorResponse).message
			const cleanedMessage = errorMessage.split(':')[0].trim()
			showError({
				errorButtonText: 'Thử lại',
				errorMessage: cleanedMessage,
				errorTitle: 'Lỗi thông tin giao dịch'
			})
		}
	})
}
