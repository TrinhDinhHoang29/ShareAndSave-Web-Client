import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import transactionApi from '@/apis/modules/transaction.api'
import {
	ITransaction,
	ITransactionParams,
	ITransactionResponse
} from '@/models/interfaces'

export const useListTransactionQuery = (params: ITransactionParams) => {
	return useInfiniteQuery<ITransactionResponse, Error>({
		queryKey: ['transactions', params],
		queryFn: async ({ pageParam = 1 }) => {
			const queryParams = { ...params, page: Number(pageParam) }
			const res = await transactionApi.list(queryParams)
			if (!res.data || !res.data.transactions) {
				throw new Error('Dữ liệu giao dịch không hợp lệ')
			}
			return res.data
		},
		getNextPageParam: (lastPage, allPages) => {
			const currentPage = allPages.length
			const totalPages = lastPage.totalPage || 0

			// If current page is less than total pages, return next page number
			if (currentPage < totalPages) {
				return currentPage + 1
			}

			// No more pages
			return undefined
		},
		initialPageParam: 1,
		enabled: !!params.postID && !!params.searchValue,
		staleTime: 5 * 60 * 1000 // Dữ liệu tươi trong 5 phút
	})
}

export const useDetailTransactionQuery = (interestID: number) => {
	return useQuery<ITransaction | null>({
		queryKey: ['transaction', 'detail', interestID], // Key để cache, dựa trên id
		queryFn: async () => {
			const res = await transactionApi.detail(interestID)
			return res.data.transaction.id === 0 ? null : res.data.transaction // Trả về null nếu post không tồn tại
		},
		enabled: !!interestID, // Chỉ chạy query khi id tồn tại và lớn hơn 0
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}
