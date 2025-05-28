import axiosPrivate from '@/apis/client/private.client'
import { ESortOrderValue } from '@/models/enums/option'
import { FilterSearch, IApiResponse, IWarrantyTime } from '@/models/interfaces'

const warrantyTimeEndpoints = {
	common: 'thoi-gian-bao-hanh'
}

const warrantyTimeApi = {
	async list(params: {
		page?: number
		limit?: number
		filters?: FilterSearch[]
		sort?: keyof IWarrantyTime | ''
		order?: ESortOrderValue
	}): Promise<IApiResponse<IWarrantyTime[]>> {
		return axiosPrivate.get(warrantyTimeEndpoints.common, {
			params: { ...params, filters: JSON.stringify(params.filters) }
		})
	},
	async add(data: { ten: string }): Promise<IApiResponse> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.post(warrantyTimeEndpoints.common, data)
		} catch (error) {
			throw error
		}
	},
	async delete(id: number | string): Promise<IApiResponse> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.delete(warrantyTimeEndpoints.common + '/' + id)
		} catch (error) {
			throw error
		}
	},
	async edit(data: {
		id: string | number
		ten: string
	}): Promise<IApiResponse> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.put(warrantyTimeEndpoints.common, data)
		} catch (error) {
			throw error
		}
	}
}

export default warrantyTimeApi
