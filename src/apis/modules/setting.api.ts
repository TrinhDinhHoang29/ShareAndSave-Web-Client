import { EGoodPOINTTYPE } from '@/models/enums'
import { IApiResponse, ISetting } from '@/models/interfaces'

import axiosPrivate from '../client/private.client'
import axiosPublic from '../client/public.client'

const settingEndpoints = {
	rank: 'client/users/ranks',
	mysettings: 'client/users/my-good-deeds',
	settings: 'settings'
}

const settingApi = {
	async getSettings(
		key: EGoodPOINTTYPE
	): Promise<IApiResponse<{ setting: ISetting }>> {
		return axiosPrivate.get(settingEndpoints.settings + '/' + key)
	},
	async getAllSettings(): Promise<IApiResponse<{ settings: ISetting[] }>> {
		return axiosPrivate.get(settingEndpoints.settings)
	}
}

export default settingApi
