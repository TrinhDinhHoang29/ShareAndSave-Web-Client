import { useQuery } from '@tanstack/react-query'

import interestApi from '@/apis/modules/interest.api'
import { EInterestType } from '@/models/enums'
import {
	IListTypeParams,
	IPostInterest,
	IPostInterestResponse
} from '@/models/interfaces'

export const useListPostInterestQuery = (
	params: IListTypeParams<EInterestType>
) => {
	return useQuery<IPostInterestResponse, Error>({
		queryKey: ['postInterests', params], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await interestApi.list(params)
			return res.data
		},
		enabled: !!params.type // Chỉ chạy query khi type và search được cung cấp
	})
}

export const useDetailPostInterestQuery = (interestID: number) => {
	return useQuery<IPostInterest | null, Error>({
		queryKey: ['detailPostInterests', interestID], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await interestApi.detail(interestID)
			return res.data.interest || null
		},
		enabled: !!interestID // Chỉ chạy query khi type và search được cung cấp
	})
}
