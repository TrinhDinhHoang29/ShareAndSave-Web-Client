import { IApiResponse, INotiResponse } from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const notiEndpoints = {
	common: 'client/notifications'
}

const notiApi = {
	async list(params: {
		page?: number
		limit?: number
	}): Promise<IApiResponse<INotiResponse>> {
		return axiosPrivate.get(notiEndpoints.common, {
			params
		})
	}
}

export default notiApi
