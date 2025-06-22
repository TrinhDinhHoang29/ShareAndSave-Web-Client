import { EPostType } from '@/models/enums'
import {
	IApiResponse,
	IListTypeParams,
	IMyPostRequest,
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
	detail: 'posts/slug',
	myPost: 'posts/my-post'
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
	async myPost(
		params: IListTypeParams<EPostType>
	): Promise<IApiResponse<IPostResponse>> {
		return axiosPrivate.get(postEndpoints.myPost, {
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
	},
	async update(
		postID: number,
		data: IMyPostRequest,
		signal?: AbortSignal
	): Promise<IApiResponse<string>> {
		return axiosPrivate.patch(postEndpoints.post + '/' + postID, data, {
			signal
		})
	}
}

export default postApi
