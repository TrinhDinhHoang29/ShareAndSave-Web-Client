import { IApiResponse, INotiResponse } from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const notiEndpoints = {
	common: 'client/notifications',
	noti: 'notifications'
}

const notiApi = {
	async list(params: {
		page?: number
		limit?: number
	}): Promise<IApiResponse<INotiResponse>> {
		return axiosPrivate.get(notiEndpoints.common, {
			params
		})
	},
	async updateByID(notificationID: number): Promise<IApiResponse<string>> {
		return axiosPrivate.patch(notiEndpoints.noti + '/' + notificationID)
	},
	async updateAll(): Promise<IApiResponse<string>> {
		return axiosPrivate.patch(notiEndpoints.noti)
	}
}

export default notiApi
