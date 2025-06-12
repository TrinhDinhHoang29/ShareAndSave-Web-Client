import { useQuery } from '@tanstack/react-query'

import transactionApi from '@/apis/modules/transaction.api'
import { ITransaction, ITransactionParams } from '@/models/interfaces'

export const useDetailTransactionQuery = (params: ITransactionParams) => {
	return useQuery<ITransaction[], Error>({
		queryKey: ['postInterests', params], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await transactionApi.list(params)
			return res.data.transactions.sort((a, b) => b.id - a.id) || []
		},
		enabled: !!params.postID && !!params.searchValue, // Chỉ chạy query khi type và search được cung cấp
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}
