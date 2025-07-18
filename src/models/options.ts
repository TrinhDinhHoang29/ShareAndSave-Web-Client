import {
	EAppointmentStatus,
	EMethod,
	EPostType,
	ERequestStatus,
	ESortOrder
} from './enums'

export const statusOptions = [
	{ value: ERequestStatus.ALL, label: 'Tất cả trạng thái' },
	{ value: ERequestStatus.PENDING, label: 'Đang xử lý' },
	{ value: ERequestStatus.APPROVE, label: 'Đã duyệt' },
	{ value: ERequestStatus.REJECT, label: 'Bị từ chối' },
	{ value: ERequestStatus.WAITING_USER, label: 'Chờ phản hồi từ bạn' },
	{ value: ERequestStatus.FAIL, label: 'Đã hủy' }
]

export const typeOptions = [
	{ value: EPostType.ALL, label: 'Tất cả' },
	{ value: EPostType.CAMPAIGN, label: 'Chiến dịch	' },
	{ value: EPostType.GIVE_AWAY_OLD_ITEM, label: 'Cho tặng đồ cũ' },
	{ value: EPostType.FOUND_ITEM, label: 'Nhặt được đồ thất lạc' },
	{ value: EPostType.SEEK_LOSE_ITEM, label: 'Tìm đồ thất lạc' },
	{ value: EPostType.WANT_OLD_ITEM, label: 'Xin nhận đồ cũ' },
	{ value: EPostType.OTHER, label: 'Khác' }
]

export const sortOptions = [
	{ value: ESortOrder.DESC, label: 'Mới nhất' },
	{ value: ESortOrder.ASC, label: 'Cũ nhất' }
]

export const sortQuantityOptions = [
	{ value: ESortOrder.DESC, label: 'Giảm dần' },
	{ value: ESortOrder.ASC, label: 'Tăng dần' }
]

export const methodOptions = [
	{
		value: EMethod.IN_PERSON,
		label: EMethod.IN_PERSON
	},
	{
		value: EMethod.SHIP,
		label: EMethod.SHIP
	}
]

export const appointmentStatusOptions = [
	{ value: EAppointmentStatus.ALL, label: 'Tất cả' },
	{ value: EAppointmentStatus.APPROVED, label: 'Đã xác nhận' },
	{ value: EAppointmentStatus.REJECTED, label: 'Đã từ chối' }
]
