import { IApiResponse, IItemSuggestion } from '@/models/interfaces'

import axiosPublic from '../client/public.client'

const itemEndpoints = {
	common: 'items'
}

const itemApi = {
	async suggestion(params: {
		searchBy: string
		searchValue: string
	}): Promise<IApiResponse<{ items: IItemSuggestion[] }>> {
		return axiosPublic.get(itemEndpoints.common, { params })
	}
}

export default itemApi
