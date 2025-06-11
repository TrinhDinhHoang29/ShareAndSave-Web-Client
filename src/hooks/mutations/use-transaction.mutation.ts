import { useMutation } from '@tanstack/react-query'

import transactionApi from '@/apis/modules/transaction.api'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { IApiErrorResponse } from '@/models/interfaces'

interface useCreateTransactionMutationOptions {
	onSuccess?: (code: number) => void
}

export const useCreateTransactionMutation = ({
	onSuccess
}: useCreateTransactionMutationOptions = {}) => {
	const { showError } = useAlertModalContext()
	return useMutation({
		mutationFn: transactionApi.create,
		onSuccess: res => {
			if (res.code === 200) {
				onSuccess?.(res.code)
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
