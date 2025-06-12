import { useQuery } from '@tanstack/react-query'

import postApi from '@/apis/modules/post.api'
import { EPostType } from '@/models/enums'
import {
	IListTypeParams,
	IPostDetail,
	IPostResponse
} from '@/models/interfaces'

export const useListPostQuery = (params: IListTypeParams<EPostType>) => {
	return useQuery<IPostResponse>({
		queryKey: ['posts', params], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await postApi.list(params)
			return res.data
		},
		// keepPreviousData: true, // Giữ dữ liệu cũ khi thay đổi page/limit (option not available in current react-query version)
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}

export const useDetailPostQuery = (slug: string) => {
	return useQuery<IPostDetail | null>({
		queryKey: ['posts', slug], // Key để cache, dựa trên id
		queryFn: async () => {
			const res = await postApi.detail(slug)
			return res.data.post.id === 0 ? null : res.data.post // Trả về null nếu post không tồn tại
		},
		enabled: !!slug, // Chỉ chạy query khi id tồn tại và lớn hơn 0
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}

export const useDetailPostQueryByID = (id: number) => {
	return useQuery<IPostDetail | null>({
		queryKey: ['posts', id], // Key để cache, dựa trên id
		queryFn: async () => {
			const res = await postApi.detailByID(id)
			return res.data.post.id === 0 ? null : res.data.post // Trả về null nếu post không tồn tại
		},
		enabled: !!id && id > 0, // Chỉ chạy query khi id tồn tại và lớn hơn 0
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}
