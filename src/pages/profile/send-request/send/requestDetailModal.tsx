import { Calendar, Check, Clock, MapPin, X } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

import { ERequestStatus, ERequestType } from '@/models/enums'
import { IRequest } from '@/models/interfaces'

interface RequestDetailsModalProps {
	request: IRequest
	onClose: () => void
}

const autoTextOptions: { value: ERequestStatus; message: string }[] = [
	{
		value: ERequestStatus.PENDING,
		message:
			'Yêu cầu của bạn đang được xem xét. Chúng tôi sẽ thông báo khi có kết quả.'
	},
	{
		value: ERequestStatus.APPROVE,
		message:
			'Yêu cầu của bạn đã được chấp nhận. Vui lòng đến địa điểm và thời gian đã hẹn.'
	},
	{
		value: ERequestStatus.REJECT,
		message:
			'Yêu cầu của bạn đã bị từ chối. Vui lòng kiểm tra lại thông tin hoặc liên hệ để biết thêm chi tiết.'
	}
]

const getStatusConfig = (status: ERequestStatus) => {
	const configs: Record<
		ERequestStatus,
		{
			label: string
			icon: React.ComponentType<{ className?: string }>
			className: string
			bgColor: string
		}
	> = {
		[ERequestStatus.PENDING]: {
			label: 'Đang xử lý',
			icon: Clock,
			className: 'text-amber-700',
			bgColor: 'bg-gradient-to-r from-amber-50 to-orange-50'
		},
		[ERequestStatus.APPROVE]: {
			label: 'Đã duyệt',
			icon: Check,
			className: 'text-emerald-700',
			bgColor: 'bg-gradient-to-r from-emerald-50 to-green-50'
		},
		[ERequestStatus.REJECT]: {
			label: 'Từ chối',
			icon: X,
			className: 'text-red-700',
			bgColor: 'bg-gradient-to-r from-red-50 to-pink-50'
		},
		[ERequestStatus.WAITING_USER]: {
			label: 'Chờ phản hồi',
			icon: Clock,
			className: 'text-blue-700',
			bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50'
		},
		[ERequestStatus.FAIL]: {
			label: 'Đã hủy',
			icon: X,
			className: 'text-gray-700',
			bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50'
		},
		[ERequestStatus.ALL]: {
			label: 'Không xác định',
			icon: Clock,
			className: 'text-gray-700',
			bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50'
		}
	}
	return configs[status] || configs[ERequestStatus.ALL]
}

const getTypeConfig = (type: ERequestType) => {
	const configs: Partial<
		Record<ERequestType, { label: string; className: string; bgColor: string }>
	> = {
		[ERequestType.SEND_OLD]: {
			label: 'Gửi đồ cũ',
			className: 'text-blue-700',
			bgColor: 'bg-gradient-to-r from-blue-50 to-cyan-50'
		},
		[ERequestType.SEND_LOSE]: {
			label: 'Gửi đồ thất lạc',
			className: 'text-teal-700',
			bgColor: 'bg-gradient-to-r from-teal-50 to-emerald-50'
		}
	}
	return (
		configs[type] || {
			label: type,
			className: 'text-gray-700',
			bgColor: 'bg-gradient-to-r from-gray-50 to-slate-50'
		}
	)
}

const getInstructions = (type: ERequestType): string => {
	const instructions: Partial<Record<ERequestType, string>> = {
		[ERequestType.SEND_OLD]:
			'Vui lòng mang vật phẩm đến địa điểm hẹn vào thời gian đã thỏa thuận. Đảm bảo vật phẩm được đóng gói cẩn thận.',
		[ERequestType.SEND_LOSE]:
			'Vui lòng mang vật phẩm thất lạc đến văn phòng quản lý đồ thất lạc vào thời gian hẹn.'
	}
	return (
		instructions[type] ||
		'Vui lòng đến địa điểm hẹn theo thời gian đã thỏa thuận.'
	)
}

const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({
	request,
	onClose
}) => {
	const typeConfig = getTypeConfig(request.type)
	const statusConfig = getStatusConfig(request.status)
	const statusMessage =
		autoTextOptions.find(opt => opt.value === request.status)?.message ||
		'Trạng thái không xác định.'
	const StatusIcon = statusConfig.icon
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				modalRef.current &&
				!modalRef.current.contains(event.target as Node)
			) {
				console.log('Clicked outside modal, closing')
				onClose()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [onClose])

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm'>
			<div
				ref={modalRef}
				className='w-full max-w-lg overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl'
			>
				{/* Header */}
				<div className='relative border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-6 py-5'>
					<div className='flex items-center justify-between'>
						<div>
							<h2 className='mb-1 text-xl font-semibold text-gray-900'>
								Chi tiết yêu cầu
							</h2>
							<span
								className={`inline-flex items-center rounded-full border-0 px-3 py-1 text-xs font-medium ${typeConfig.bgColor} ${typeConfig.className}`}
							>
								{typeConfig.label}
							</span>
						</div>
						<button
							onClick={onClose}
							className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-all duration-200 hover:bg-gray-200 hover:text-gray-700'
						>
							<X className='h-4 w-4' />
						</button>
					</div>
				</div>

				{/* Content */}
				<div className='max-h-[400px] space-y-6 overflow-y-auto px-6 py-6'>
					{/* Item Display */}
					<div className='flex items-start gap-4 rounded-xl bg-gray-50 p-4'>
						<div className='relative'>
							<img
								src={request.imageUrl || 'https://via.placeholder.com/80'}
								alt={request.item}
								className='h-20 w-20 rounded-xl border-2 border-white object-cover shadow-sm'
							/>
							<div className='absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm'>
								<div className='h-2 w-2 rounded-full bg-green-500'></div>
							</div>
						</div>
						<div className='min-w-0 flex-1'>
							<h3 className='mb-1 truncate text-lg font-semibold text-gray-900'>
								{request.item}
							</h3>
							<p className='line-clamp-2 text-sm leading-relaxed text-gray-600'>
								{request.description || 'Không có mô tả chi tiết.'}
							</p>
						</div>
					</div>

					{/* Date and Location */}
					<div className='grid grid-cols-1 gap-4'>
						<div className='flex items-center gap-3 rounded-lg bg-blue-50/50 p-3'>
							<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100'>
								<Calendar className='h-4 w-4 text-blue-600' />
							</div>
							<div className='flex-1'>
								<label className='text-xs font-medium tracking-wide text-blue-700 uppercase'>
									Ngày gửi
								</label>
								<p className='mt-0.5 text-sm font-medium text-gray-900'>
									{request.date}
								</p>
							</div>
						</div>

						<div className='flex items-center gap-3 rounded-lg bg-purple-50/50 p-3'>
							<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100'>
								<MapPin className='h-4 w-4 text-purple-600' />
							</div>
							<div className='flex-1'>
								<label className='text-xs font-medium tracking-wide text-purple-700 uppercase'>
									Địa điểm
								</label>
								<p className='mt-0.5 text-sm font-medium text-gray-900'>
									{request.location}
								</p>
							</div>
						</div>
					</div>

					{/* Status Section */}
					<div className={`rounded-xl border-0 p-4 ${statusConfig.bgColor}`}>
						<div className='mb-3 flex items-center gap-2'>
							<div className='flex h-8 w-8 items-center justify-center rounded-lg bg-white/80'>
								<StatusIcon className={`h-4 w-4 ${statusConfig.className}`} />
							</div>
							<span
								className={`text-sm font-semibold ${statusConfig.className}`}
							>
								{statusConfig.label}
							</span>
						</div>
						<p className='text-sm leading-relaxed text-gray-700'>
							{statusMessage}
						</p>
					</div>

					{/* Instructions for APPROVE */}
					{request.status === ERequestStatus.APPROVE && (
						<div className='rounded-xl border border-green-100 bg-green-50 p-4'>
							<h4 className='mb-2 flex items-center gap-2 text-sm font-semibold text-green-800'>
								<div className='h-2 w-2 rounded-full bg-green-500'></div>
								Hướng dẫn tiếp theo
							</h4>
							<p className='text-sm leading-relaxed text-green-700'>
								{getInstructions(request.type)}
							</p>
						</div>
					)}
				</div>

				{/* Footer */}
				<div className='border-t border-gray-100 bg-gray-50 px-6 py-4'>
					<button
						onClick={onClose}
						className='w-full rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50 focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 focus:outline-none'
					>
						Đóng
					</button>
				</div>
			</div>
		</div>
	)
}

export default RequestDetailsModal
