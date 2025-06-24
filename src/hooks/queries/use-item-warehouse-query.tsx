import { useQuery } from '@tanstack/react-query'

import itemWarehouseApi from '@/apis/modules/item-warehouse.api'
import {
	IItemWarehouse,
	IItemWarehouseParams,
	IItemWarehouseResponse
} from '@/models/interfaces'

export const useListItemWarehouseQuery = (params: IItemWarehouseParams) => {
	return useQuery<IItemWarehouseResponse>({
		queryKey: ['item-warehouses', params], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await itemWarehouseApi.list(params)
			return res.data
		},
		// keepPreviousData: true, // Giữ dữ liệu cũ khi thay đổi page/limit (option not available in current react-query version)
		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
	})
}

export const useMyItemWarehouseQuery = (isAuthenticated: boolean) => {
	return useQuery<IItemWarehouse[]>({
		queryKey: ['my-item-warehouses'], // Key để cache, dựa trên params
		queryFn: async () => {
			const res = await itemWarehouseApi.myItemWarehouse()
			return res.data.claimRequests
		},
		enabled: isAuthenticated
	})
}

// export const useDetailPostQuery = (slug: string) => {
// 	return useQuery<IPostDetail | null>({
// 		queryKey: ['posts', slug], // Key để cache, dựa trên id
// 		queryFn: async () => {
// 			const res = await postApi.detail(slug)
// 			return res.data.post.id === 0 ? null : res.data.post // Trả về null nếu post không tồn tại
// 		},
// 		enabled: !!slug, // Chỉ chạy query khi id tồn tại và lớn hơn 0
// 		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
// 		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
// 	})
// }

// export const useDetailPostQueryByID = (id: number) => {
// 	return useQuery<IPostDetail | null>({
// 		queryKey: ['posts', id], // Key để cache, dựa trên id
// 		queryFn: async () => {
// 			const res = await postApi.detailByID(id)
// 			return res.data.post.id === 0 ? null : res.data.post // Trả về null nếu post không tồn tại
// 		},
// 		enabled: !!id && id > 0, // Chỉ chạy query khi id tồn tại và lớn hơn 0
// 		staleTime: 5 * 60 * 1000, // Dữ liệu tươi trong 5 phút
// 		gcTime: 10 * 60 * 1000 // Cache trong 10 phút
// 	})
// }
