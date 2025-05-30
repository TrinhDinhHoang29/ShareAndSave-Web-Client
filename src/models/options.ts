import { Gift, Package, Search, Star, Users } from 'lucide-react'

import { ERequestStatus, ERequestType } from './enums'

export const statusOptions = [
	{ value: ERequestStatus.ALL, label: 'Tất cả trạng thái' },
	{ value: ERequestStatus.PENDING, label: 'Đang xử lý' },
	{ value: ERequestStatus.APPROVE, label: 'Đã duyệt' },
	{ value: ERequestStatus.REJECT, label: 'Bị từ chối' },
	{ value: ERequestStatus.WAITING_USER, label: 'Chờ phản hồi từ bạn' },
	{ value: ERequestStatus.FAIL, label: 'Đã hủy' }
]

export const typeOptions = [
	{ value: ERequestType.ALL, label: 'Tất cả loại' },
	{ value: ERequestType.SEND_OLD, label: 'Gửi đồ cũ' },
	{ value: ERequestType.RECEIVE_OLD, label: 'Nhận đồ cũ' },
	{ value: ERequestType.RECEIVE_LOSE, label: 'Nhận đồ thất lạc' },
	{ value: ERequestType.SEND_LOSE, label: 'Gửi đồ thất lạc' }
]
