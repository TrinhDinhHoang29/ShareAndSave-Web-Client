import { IApiResponse, IRequestSendItemRequest } from '@/models/interfaces'

import axiosPublic from '../client/public.client'

const requestEndpoints = {
	sendOldItemL: 'requests' + '/' + 'send-old-item'
}

const requestApi = {
	async sendOldItem(
		data: IRequestSendItemRequest
	): Promise<IApiResponse<IRequestSendItemRequest>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(requestEndpoints.sendOldItemL, data)
		} catch (error) {
			throw error
		}
	}
	//   async list(params: {
	//     page?: number;
	//     limit?: number;
	//     filters?: FilterSearch[];
	//     sort?: keyof Irequest | "";
	//     order?: ESortOrderValue;
	//   }): Promise<IApiResponse<Irequest[]>> {
	//     return axiosPrivate.get(requestEndpoints.common, {
	//       params: { ...params, filters: JSON.stringify(params.filters) },
	//     });
	//   },
	//   async add(data: { ten: string }): Promise<IApiResponse> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//       return await axiosPrivate.post(requestEndpoints.common, data);
	//     } catch (error) {
	//       throw error;
	//     }
	//   },
	//   async delete(id: number | string): Promise<IApiResponse> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//       return await axiosPrivate.delete(requestEndpoints.common + "/" + id);
	//     } catch (error) {
	//       throw error;
	//     }
	//   },
	//   async edit(data: {
	//     id: string | number;
	//     ten: string;
	//   }): Promise<IApiResponse> {
	//     // eslint-disable-next-line no-useless-catch
	//     try {
	//       return await axiosPrivate.put(requestEndpoints.common, data);
	//     } catch (error) {
	//       throw error;
	//     }
	//   },
}

export default requestApi
