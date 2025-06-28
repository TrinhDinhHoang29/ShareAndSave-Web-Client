import { EGoodPOINTTYPE } from '@/models/enums'
import {
	IApiResponse,
	IDetailGoodDeed,
	IGoodDeedSetting,
	IUserRankResponse
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'

const goodDeedEndpoints = {
	rank: 'client/users/ranks',
	myGoodDeeds: 'client/users/my-good-deeds',
	settings: 'settings'
}

const goodDeedApi = {
	async ranks(params: {
		limit?: number
		page?: number
	}): Promise<IApiResponse<IUserRankResponse>> {
		return axiosPrivate.get(goodDeedEndpoints.rank, {
			params
		})
	},
	async myGoodDeeds(): Promise<IApiResponse<{ goodDeeds: IDetailGoodDeed[] }>> {
		return axiosPrivate.get(goodDeedEndpoints.myGoodDeeds)
	},
	async getSettings(
		key: EGoodPOINTTYPE
	): Promise<IApiResponse<{ setting: IGoodDeedSetting }>> {
		return axiosPrivate.get(goodDeedEndpoints.settings + '/' + key)
	}
	// async create(data: {
	// 	postID: number
	// }): Promise<IApiResponse<{ goodDeedID: number }>> {
	// 	return axiosPrivate.post(goodDeedEndpoints.common, data)
	// },
	// async delete(postID: number): Promise<IApiResponse<{ goodDeedID: number }>> {
	// 	return axiosPrivate.delete(goodDeedEndpoints.common + '/' + postID)
	// },
}

export default goodDeedApi
