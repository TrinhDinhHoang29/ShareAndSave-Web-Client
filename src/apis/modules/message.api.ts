import {
	IApiResponse,
	IListMessageParams,
	IMessageResponse
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const messageEndpoints = {
	common: 'messages'
}

const messageApi = {
	async list(
		params: IListMessageParams
	): Promise<IApiResponse<{ messages: IMessageResponse[] }>> {
		return axiosPrivate.get(messageEndpoints.common, {
			params
		})
	},
	async update(interesID: number): Promise<IApiResponse<string>> {
		return axiosPrivate.patch(messageEndpoints.common + '/' + interesID)
	}
}

export default messageApi
