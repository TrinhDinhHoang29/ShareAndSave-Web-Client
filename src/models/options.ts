import { EPostType, ERequestStatus, ESortOrder } from './enums'

export const statusOptions = [
	{ value: ERequestStatus.ALL, label: 'Tất cả trạng thái' },
	{ value: ERequestStatus.PENDING, label: 'Đang xử lý' },
	{ value: ERequestStatus.APPROVE, label: 'Đã duyệt' },
	{ value: ERequestStatus.REJECT, label: 'Bị từ chối' },
	{ value: ERequestStatus.WAITING_USER, label: 'Chờ phản hồi từ bạn' },
	{ value: ERequestStatus.FAIL, label: 'Đã hủy' }
]

export const typeOptions = [
	{ value: '', label: 'Tất cả' },
	{ value: EPostType.GIVE_AWAY_OLD_ITEM, label: 'Cho tặng đồ cũ' },
	{ value: EPostType.FOUND_ITEM, label: 'Tìm thấy đồ' },
	{ value: EPostType.SEEK_LOSE_ITEM, label: 'Tìm đồ bị mất' },
	{ value: EPostType.OTHER, label: 'Khác' }
]

export const sortOptions = [
	{ value: ESortOrder.DESC, label: 'Mới nhất' },
	{ value: ESortOrder.ASC, label: 'Cũ nhất' }
]

export const methodOptions = [
	{
		value: 'Gặp trực tiếp',
		label: 'Gặp trực tiếp'
	},
	{
		value: 'Giao hàng',
		label: 'Giao hàng'
	}
]
