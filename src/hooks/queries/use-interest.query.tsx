import { useQuery } from '@tanstack/react-query'

import interestApi from '@/apis/modules/interest.api'
import { EInterestType } from '@/models/enums'
import { IListTypeParams, IPostInterestResponse } from '@/models/interfaces'

const useListPostInterestQuery = (params: IListTypeParams<EInterestType>) => {
	return useQuery<IPostInterestResponse, Error>({
		queryKey: ['postInterests', params], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await interestApi.list(params)
			return res.data
		},
		enabled: !!params.type, // Chỉ chạy query khi type và search được cung cấp
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}

export default useListPostInterestQuery
