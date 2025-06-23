import {
	IApiResponse,
	IItemWarehouse,
	IItemWarehouseParams,
	IItemWarehouseRequest,
	IItemWarehouseResponse
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'
import axiosPublic from '../client/public.client'

const itemWarehouseEndpoints = {
	listItemWarehouses: 'client/item-warehouses/old-stock',
	common: 'client/item-warehouses/claim-request'
}

const itemWarehouseApi = {
	async create(
		data: IItemWarehouseRequest[],
		signal?: AbortSignal
	): Promise<IApiResponse<null>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.post(itemWarehouseEndpoints.common, data, {
				signal
			})
		} catch (error) {
			throw error
		}
	},
	async update(
		data: IItemWarehouseRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<null>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.patch(itemWarehouseEndpoints.common, data, {
				signal
			})
		} catch (error) {
			throw error
		}
	},
	async delete(
		itemID: number,
		signal?: AbortSignal
	): Promise<IApiResponse<null>> {
		// eslint-disable-next-line no-useless-catch
		try {
			const pathDelete = itemID ? `/${itemID}` : ''
			return await axiosPrivate.delete(
				itemWarehouseEndpoints.common + pathDelete,
				{
					signal
				}
			)
		} catch (error) {
			throw error
		}
	},
	async list(
		params: IItemWarehouseParams
	): Promise<IApiResponse<IItemWarehouseResponse>> {
		return axiosPublic.get(itemWarehouseEndpoints.listItemWarehouses, {
			params
		})
	},
	async myItemWarehouse(): Promise<
		IApiResponse<{ claimRequests: IItemWarehouse[] }>
	> {
		return axiosPrivate.get(itemWarehouseEndpoints.common)
	}
	// async detail(slug: string): Promise<IApiResponse<{ itemWarehouse: IitemWarehouseDetail }>> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//         return await axiosPublic.get(itemWarehouseEndpoints.detail + '/' + slug)
	//     } catch (error) {
	//         throw error
	//     }
	// },
	// async detailByID(id: number): Promise<IApiResponse<{ itemWarehouse: IitemWarehouseDetail }>> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//         return await axiosPublic.get(itemWarehouseEndpoints.itemWarehouse + '/' + id)
	//     } catch (error) {
	//         throw error
	//     }
	// }
}

export default itemWarehouseApi
