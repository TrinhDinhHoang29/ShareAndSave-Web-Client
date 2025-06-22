import {
	IApiResponse,
	IItemWarehouseParams,
	IItemWarehouseResponse
} from '@/models/interfaces'

import axiosPublic from '../client/public.client'

const itemWarehouseEndpoints = {
	itemWarehouse: 'itemWarehouses',
	listItemWarehouses: 'client/item-warehouses/old-stock',
	detail: 'itemWarehouses/slug'
}

const itemWarehouseApi = {
	// async create(
	//     data: IitemWarehouseActionRequest,
	//     signal?: AbortSignal
	// ): Promise<IApiResponse<IitemWarehouseActionResponse>> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//         return await axiosPrivate.itemWarehouse(itemWarehouseEndpoints.itemWarehouse, data, {
	//             signal
	//         })
	//     } catch (error) {
	//         throw error
	//     }
	// },
	async list(
		params: IItemWarehouseParams
	): Promise<IApiResponse<IItemWarehouseResponse>> {
		return axiosPublic.get(itemWarehouseEndpoints.listItemWarehouses, {
			params
		})
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
