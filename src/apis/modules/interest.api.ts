import { EInterestType } from '@/models/enums'
import {
	IApiResponse,
	IListTypeParams,
	IPostInterestResponse
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const interestEndpoints = {
	common: 'interests'
}

const interestApi = {
	async list(
		params: IListTypeParams<EInterestType>
	): Promise<IApiResponse<IPostInterestResponse>> {
		return axiosPrivate.get(interestEndpoints.common, {
			params
		})
	},
	async create(data: {
		postID: number
	}): Promise<IApiResponse<{ interestID: number }>> {
		return axiosPrivate.post(interestEndpoints.common, data)
	},
	async delete(postID: number): Promise<IApiResponse<{ interestID: number }>> {
		return axiosPrivate.delete(interestEndpoints.common + '/' + postID)
	}
}

export default interestApi
