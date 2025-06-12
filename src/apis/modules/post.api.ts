import { EPostType } from '@/models/enums'
import {
	IApiResponse,
	IListTypeParams,
	IPostActionRequest,
	IPostActionResponse,
	IPostDetail,
	IPostResponse
} from '@/models/interfaces'

import axiosPrivate from '../client/private.client'
import axiosPublic from '../client/public.client'

const postEndpoints = {
	post: 'posts',
	listPosts: 'client/posts',
	detail: 'posts/slug'
}

const postApi = {
	async create(
		data: IPostActionRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<IPostActionResponse>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPrivate.post(postEndpoints.post, data, {
				signal
			})
		} catch (error) {
			throw error
		}
	},
	async list(
		params: IListTypeParams<EPostType>
	): Promise<IApiResponse<IPostResponse>> {
		return axiosPublic.get(postEndpoints.listPosts, {
			params
		})
	},
	async detail(slug: string): Promise<IApiResponse<{ post: IPostDetail }>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.get(postEndpoints.detail + '/' + slug)
		} catch (error) {
			throw error
		}
	},
	async detailByID(id: number): Promise<IApiResponse<{ post: IPostDetail }>> {
		// eslint-disable-next-line no-useless-catch
		try {
			return await axiosPublic.get(postEndpoints.post + '/' + id)
		} catch (error) {
			throw error
		}
	}
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
