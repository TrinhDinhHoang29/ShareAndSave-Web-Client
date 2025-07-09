import { useInfiniteQuery } from '@tanstack/react-query'

import notiApi from '@/apis/modules/noti.api'
import { INotiResponse } from '@/models/interfaces'

export const useListNotiQuery = (
	userId: number,
	params: { page?: number; limit?: number }
) => {
	return useInfiniteQuery<INotiResponse, Error>({
		queryKey: ['noti', userId],
		queryFn: async ({ pageParam = 1 }) => {
			const queryParams = { ...params, page: Number(pageParam) }
			const res = await notiApi.list(queryParams)
			if (!res.data || !res.data.notifications) {
				throw new Error('Dữ liệu thông báo không hợp lệ')
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
		enabled: !!userId,
		staleTime: 5 * 60 * 1000 // Dữ liệu tươi trong 5 phút
	})
}
