import { IApiResponse, IPostRequest, IPostResponse } from '@/models/interfaces'

import axiosPublic from '../client/public.client'

const postEndpoints = {
	post: 'posts'
}

const postApi = {
	async create(
		data: IPostRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<IPostResponse>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.post(postEndpoints.post, data, {
				signal
			})
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

export default postApi
