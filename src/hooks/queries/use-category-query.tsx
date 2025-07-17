import { useQuery } from '@tanstack/react-query'

import categoryApi from '@/apis/modules/category.api'
import { ICategory } from '@/models/interfaces'

// Khóa query duy nhất cho danh sách danh mục
const QUERY_KEY_CATEGORIES = 'categories'

// Custom hook để lấy danh sách danh mục
export const useCategoriesQuery = () => {
	return useQuery<ICategory[], Error>({
		queryKey: [QUERY_KEY_CATEGORIES], // Khóa query để cache và đồng bộ hóa
		queryFn: () => categoryApi.list().then(res => res.data.categories), // Gọi API list
		// Cấu hình tùy chọn (tùy chỉnh theo nhu cầu)
		staleTime: 5 * 60 * 1000, // Dữ liệu được coi là "mới" trong 5 phút
		gcTime: 10 * 60 * 1000, // Giữ cache trong 10 phút
		retry: 1 // Thử lại 1 lần nếu thất bại
	})
}
