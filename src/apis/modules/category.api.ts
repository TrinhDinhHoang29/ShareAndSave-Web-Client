import { IApiResponse, ICategory } from '@/models/interfaces'

import axiosPublic from '../client/public.client'

const categoryEndpoints = {
	common: 'categories'
}

const categoryApi = {
	async list(): Promise<IApiResponse<{ categories: ICategory[] }>> {
		return axiosPublic.get(categoryEndpoints.common)
	}
}

export default categoryApi
