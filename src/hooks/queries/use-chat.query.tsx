import { useInfiniteQuery } from '@tanstack/react-query'

import messageApi from '@/apis/modules/message.api'
import { IListMessageParams, IMessageResponse } from '@/models/interfaces'

export const useListMessageQuery = (params: IListMessageParams) => {
	return useInfiniteQuery<IMessageResponse[], Error>({
		queryKey: ['messages', params],
		queryFn: async ({ pageParam = 1 }) => {
			const response = await messageApi.list({
				...params,
				page: Number(pageParam)
			})
			return response.data.messages
		},
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage || lastPage.length === 0) {
				return undefined
			}
			return allPages.length + 1
		},
		initialPageParam: 1,
		enabled: !!params.interestID,
		staleTime: 5 * 60 * 1000,
		gcTime: 10 * 60 * 1000
	})
}
