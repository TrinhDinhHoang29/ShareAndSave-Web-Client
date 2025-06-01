import { Check, ChevronRight, Clock, X } from 'lucide-react'
import React from 'react'

import { ERequestStatus, ERequestType } from '@/models/enums'

interface Request {
	id: number
	type: ERequestType
	item: string
	status: ERequestStatus
	date: string
	location: string
}

interface RequestItemProps {
	request: Request
	onSelect: (request: Request) => void
}

const getStatusConfig = (status: ERequestStatus) => {
	const configs: Record<
		ERequestStatus,
		{
			label: string
			icon: React.ComponentType<{ className?: string }>
			className: string
		}
	> = {
		[ERequestStatus.PENDING]: {
			label: 'Đang xử lý',
			icon: Clock,
			className: 'bg-amber-50 text-amber-700 border-amber-200'
		},
		[ERequestStatus.APPROVE]: {
			label: 'Đã duyệt',
			icon: Check,
			className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
		},
		[ERequestStatus.REJECT]: {
			label: 'Từ chối',
			icon: X,
			className: 'bg-red-50 text-red-700 border-red-200'
		},
		[ERequestStatus.WAITING_USER]: {
			label: 'Chờ phản hồi',
			icon: Clock,
			className: 'bg-blue-50 text-blue-700 border-blue-200'
		},
		[ERequestStatus.FAIL]: {
			label: 'Đã hủy',
			icon: X,
			className: 'bg-gray-50 text-gray-700 border-gray-200'
		},
		[ERequestStatus.ALL]: {
			label: 'Không xác định',
			icon: Clock,
			className: 'bg-gray-50 text-secondary border-gray-200'
		}
	}
	return configs[status] || configs[ERequestStatus.ALL]
}

const getTypeConfig = (type: ERequestType) => {
	const configs: Partial<
		Record<ERequestType, { label: string; className: string }>
	> = {
		[ERequestType.SEND_OLD]: {
			label: 'Gửi đồ cũ',
			className: 'bg-blue-50 text-blue-700 border-blue-200'
		},
		[ERequestType.SEND_LOSE]: {
			label: 'Gửi đồ thất lạc',
			className: 'bg-teal-50 text-teal-700 border-teal-200'
		}
	}
	return (
		configs[type] || {
			label: type,
			className: 'bg-gray-50 text-secondary border-gray-200'
		}
	)
}

const RequestItem: React.FC<RequestItemProps> = ({ request, onSelect }) => {
	const statusConfig = getStatusConfig(request.status)
	const typeConfig = getTypeConfig(request.type)
	const StatusIcon = statusConfig.icon

	console.log(typeConfig)

	return (
		<div
			className='hover:bg-primary/5 group cursor-pointer p-6 transition-colors'
			onClick={() => onSelect(request)}
		>
			<div className='mb-2 flex items-start justify-between'>
				<div className='flex items-center gap-3'>
					<span
						className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium ${typeConfig.className}`}
					>
						{typeConfig.label}
					</span>
					<span
						className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium ${statusConfig.className}`}
					>
						<StatusIcon className='h-3 w-3' />
						{statusConfig.label}
					</span>
				</div>
				<ChevronRight className='h-5 w-5 text-gray-400 transition-colors group-hover:text-gray-600' />
			</div>
			<div className='space-y-2'>
				<h3 className='text-foreground group-hover:text-primary/80 text-lg font-medium transition-colors'>
					{request.item}
				</h3>
				<div className='text-secondary flex items-center justify-between text-sm'>
					<span>📍 {request.location}</span>
					<span>📅 {request.date}</span>
				</div>
			</div>
		</div>
	)
}

export default RequestItem
