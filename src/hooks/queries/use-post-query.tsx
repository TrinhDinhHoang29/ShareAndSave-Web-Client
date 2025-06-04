import { useQuery } from '@tanstack/react-query'

import postApi from '@/apis/modules/post.api'
import { IListParams, IPost, IPostDetail } from '@/models/interfaces'

export const useListPostQuery = (params: IListParams<IPost>) => {
	return useQuery<IPost[]>({
		queryKey: ['posts', params], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await postApi.list(params)
			return res.data.posts || []
		},
		// keepPreviousData: true, // Giữ dữ liệu cũ khi thay đổi page/limit (option not available in current react-query version)
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}

export const useDetailPostQuery = (id: number | null | undefined) => {
	return useQuery<IPostDetail | null>({
		queryKey: ['posts', id], // Key để cache, dựa trên id
		queryFn: async () => {
			if (!id || id <= 0) return null // Trả về null nếu id không hợp lệ
			const res = await postApi.detail(id)
			return res.data.post.id === 0 ? null : res.data.post // Trả về null nếu post không tồn tại
		},
		enabled: !!id && id > 0, // Chỉ chạy query khi id tồn tại và lớn hơn 0
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}
