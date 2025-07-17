import { useQuery } from '@tanstack/react-query'

import itemApi from '@/apis/modules/item.api'
import { IItemSuggestion } from '@/models/interfaces'

// Khóa query duy nhất cho gợi ý item
const QUERY_KEY_ITEM_SUGGESTIONS = 'item_suggestions'

// Custom hook để lấy danh sách gợi ý item
export const useItemSuggestionsQuery = (params: {
	searchBy: string
	searchValue: string
}) => {
	const { searchBy, searchValue } = params

	return useQuery<IItemSuggestion[], Error>({
		queryKey: [QUERY_KEY_ITEM_SUGGESTIONS, searchBy, searchValue], // Bao gồm params trong queryKey
		queryFn: async () => {
			const response = await itemApi.suggestion(params)
			// Nếu không có dữ liệu hoặc items không tồn tại, trả về mảng rỗng
			return response?.data?.items || []
		},
		// Cấu hình tùy chọn
		enabled: !!searchValue && searchValue.trim().length > 0, // Chỉ chạy query khi searchValue không rỗng
		staleTime: 5 * 60 * 1000, // Dữ liệu được coi là "mới" trong 5 phút
		gcTime: 10 * 60 * 1000, // Giữ cache trong bộ nhớ trong 10 phút trước khi xóa
		retry: 1 // Thử lại 1 lần nếu thất bại
	})
}
