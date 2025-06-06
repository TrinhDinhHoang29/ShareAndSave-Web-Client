import { IApiResponse } from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const interestEndpoints = {
	common: 'interests'
}

const interestApi = {
	// async list(): Promise<IApiResponse<{ categories: Iinterest[] }>> {
	//     return axiosPublic.get(interestEndpoints.common)
	// },
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
