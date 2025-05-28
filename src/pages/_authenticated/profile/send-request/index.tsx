import {
	Check,
	ChevronLeft,
	ChevronRight,
	Clock,
	Filter,
	X
} from 'lucide-react'
import React, { useState } from 'react'

interface Request {
	id: number
	type: 'donate' | 'receive_old' | 'receive_lost'
	item: string
	status: 'pending' | 'approved' | 'rejected'
	date: string
	location: string
}

const SentRequests = () => {
	const [selectedType, setSelectedType] = useState('')
	const [selectedStatus, setSelectedStatus] = useState('')
	const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 6

	const requests: Request[] = [
		{
			id: 1,
			type: 'receive_lost',
			item: 'Ví tiền',
			status: 'pending',
			date: '15/03/2024',
			location: 'Thư viện'
		},
		{
			id: 2,
			type: 'donate',
			item: 'Chìa khóa',
			status: 'approved',
			date: '10/03/2024',
			location: 'Căn tin'
		},
		{
			id: 3,
			type: 'receive_old',
			item: 'Điện thoại',
			status: 'rejected',
			date: '05/03/2024',
			location: 'Phòng học A1'
		},
		{
			id: 4,
			type: 'receive_lost',
			item: 'Túi xách',
			status: 'pending',
			date: '12/03/2024',
			location: 'Sân trường'
		},
		{
			id: 5,
			type: 'donate',
			item: 'Sách giáo khoa',
			status: 'approved',
			date: '08/03/2024',
			location: 'Lớp học B2'
		},
		{
			id: 6,
			type: 'receive_old',
			item: 'Laptop cũ',
			status: 'rejected',
			date: '03/03/2024',
			location: 'Phòng máy tính'
		}
	]

	const typeOptions = [
		{ value: '', label: 'Tất cả loại' },
		{ value: 'donate', label: 'Gửi đồ cũ' },
		{ value: 'receive_old', label: 'Nhận đồ cũ' },
		{ value: 'receive_lost', label: 'Nhận đồ thất lạc' }
	]

	const statusOptions = [
		{ value: '', label: 'Tất cả trạng thái' },
		{ value: 'pending', label: 'Đang xử lý' },
		{ value: 'approved', label: 'Đã duyệt' },
		{ value: 'rejected', label: 'Từ chối' }
	]

	const getStatusConfig = (status: string) => {
		const configs = {
			pending: {
				label: 'Đang xử lý',
				icon: Clock,
				className: 'bg-amber-50 text-amber-700 border-amber-200'
			},
			approved: {
				label: 'Đã duyệt',
				icon: Check,
				className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
			},
			rejected: {
				label: 'Từ chối',
				icon: X,
				className: 'bg-red-50 text-red-700 border-red-200'
			}
		}
		return (
			configs[status as keyof typeof configs] || {
				label: status,
				icon: Clock,
				className: 'bg-gray-50 text-secondary border-gray-200'
			}
		)
	}

	const getTypeConfig = (type: string) => {
		const configs = {
			donate: {
				label: 'Gửi đồ cũ',
				className: 'bg-blue-50 text-blue-700 border-blue-200'
			},
			receive_old: {
				label: 'Nhận đồ cũ',
				className: 'bg-purple-50 text-purple-700 border-purple-200'
			},
			receive_lost: {
				label: 'Nhận đồ thất lạc',
				className: 'bg-orange-50 text-orange-700 border-orange-200'
			}
		}
		return (
			configs[type as keyof typeof configs] || {
				label: type,
				className: 'bg-gray-50 text-secondary border-gray-200'
			}
		)
	}

	const filteredRequests = requests.filter(request => {
		const matchesType = !selectedType || request.type === selectedType
		const matchesStatus = !selectedStatus || request.status === selectedStatus
		return matchesType && matchesStatus
	})

	const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedRequests = filteredRequests.slice(
		startIndex,
		startIndex + itemsPerPage
	)

	const handlePageChange = (page: number) => {
		setCurrentPage(page)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}

	return (
		<div className='bg-card text-foreground mx-auto max-w-4xl space-y-6 rounded-lg border border-gray-200 p-6 shadow-md'>
			{/* Header */}
			<div className='space-y-2'>
				<h1 className='text-foreground text-2xl font-semibold'>
					Yêu cầu đã gửi
				</h1>
				<p className='text-foreground/60'>
					Quản lý và theo dõi các yêu cầu của bạn
				</p>
			</div>

			{/* Filters */}
			<div className='bg-background rounded-lg border border-gray-200 p-4'>
				<div className='mb-4 flex items-center gap-2'>
					<Filter className='h-4 w-4 text-gray-500' />
					<h3 className='text-foreground text-sm font-medium'>Bộ lọc</h3>
				</div>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
					<div>
						<label className='text-secondary mb-2 block text-sm font-medium'>
							Loại yêu cầu
						</label>
						<select
							value={selectedType}
							onChange={e => setSelectedType(e.target.value)}
							className='bg-card w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
						>
							{typeOptions.map(option => (
								<option
									key={option.value}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className='text-secondary mb-2 block text-sm font-medium'>
							Trạng thái
						</label>
						<select
							value={selectedStatus}
							onChange={e => setSelectedStatus(e.target.value)}
							className='bg-card w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
						>
							{statusOptions.map(option => (
								<option
									key={option.value}
									value={option.value}
								>
									{option.label}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* Results */}
			<div className='bg- overflow-hidden rounded-lg border border-gray-200'>
				{paginatedRequests.length > 0 ? (
					<div className='divide-y divide-gray-100'>
						{paginatedRequests.map(request => {
							const statusConfig = getStatusConfig(request.status)
							const typeConfig = getTypeConfig(request.type)
							const StatusIcon = statusConfig.icon

							return (
								<div
									key={`${request.id}-${request.type}-${request.date}`}
									className='hover:bg-primary/5 group cursor-pointer p-6 transition-colors'
									onClick={() => setSelectedRequest(request)}
								>
									<div className='mb-4 flex items-start justify-between'>
										<div className='flex items-center gap-3'>
											<span
												className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${typeConfig.className}`}
											>
												{typeConfig.label}
											</span>
											<span
												className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig.className}`}
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
						})}
					</div>
				) : (
					<div className='py-16 text-center'>
						<div className='text-secondary/70 mx-auto mb-4 h-12 w-12'>
							<svg
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1}
									d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
								/>
							</svg>
						</div>
						<h3 className='text-foreground mb-2 text-lg font-medium'>
							Không có yêu cầu nào
						</h3>
						<p className='text-secondary'>
							Thử thay đổi bộ lọc để xem kết quả khác
						</p>
					</div>
				)}

				{/* Pagination */}
				{totalPages > 1 && (
					<div className='border-t border-gray-200 bg-gray-50 px-6 py-4'>
						<div className='flex items-center justify-between'>
							<div className='text-secondary text-sm'>
								Hiển thị <span className='font-medium'>{startIndex + 1}</span>{' '}
								đến{' '}
								<span className='font-medium'>
									{Math.min(startIndex + itemsPerPage, filteredRequests.length)}
								</span>{' '}
								trong{' '}
								<span className='font-medium'>{filteredRequests.length}</span>{' '}
								kết quả
							</div>

							<div className='flex items-center space-x-2'>
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className='text-secondary bg-card inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
								>
									<ChevronLeft className='mr-1 h-4 w-4' />
									Trước
								</button>

								<div className='flex items-center space-x-1'>
									{Array.from({ length: totalPages }, (_, i) => i + 1).map(
										page => (
											<button
												key={page}
												onClick={() => handlePageChange(page)}
												className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
													currentPage === page
														? 'bg-blue-600 text-white shadow-sm'
														: 'text-secondary hover:bg-gray-100'
												}`}
											>
												{page}
											</button>
										)
									)}
								</div>

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === totalPages}
									className='text-secondary bg-card inline-flex items-center rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
								>
									Sau
									<ChevronRight className='ml-1 h-4 w-4' />
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* Request Details Modal */}
			{selectedRequest && (
				<div className='bg-primary/10 fixed inset-0 z-50 flex items-center justify-center p-4'>
					<div className='bg-card w-full max-w-md space-y-4 rounded-lg p-6'>
						<div className='flex items-center justify-between'>
							<h2 className='text-xl font-semibold text-gray-900'>
								Chi tiết yêu cầu
							</h2>
							<button
								onClick={() => setSelectedRequest(null)}
								className='text-gray-400 transition-colors hover:text-gray-600'
							>
								<X className='h-6 w-6' />
							</button>
						</div>

						<div className='space-y-4'>
							<div className='flex items-center gap-3'>
								<span
									className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getTypeConfig(selectedRequest.type).className}`}
								>
									{getTypeConfig(selectedRequest.type).label}
								</span>
								<span
									className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusConfig(selectedRequest.status).className}`}
								>
									{React.createElement(
										getStatusConfig(selectedRequest.status).icon,
										{ className: 'h-3 w-3' }
									)}
									{getStatusConfig(selectedRequest.status).label}
								</span>
							</div>

							<div className='space-y-3'>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Vật phẩm
									</label>
									<p className='text-lg font-medium text-gray-900'>
										{selectedRequest.item}
									</p>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Địa điểm
									</label>
									<p className='text-gray-900'>{selectedRequest.location}</p>
								</div>
								<div>
									<label className='text-sm font-medium text-gray-500'>
										Ngày gửi
									</label>
									<p className='text-gray-900'>{selectedRequest.date}</p>
								</div>
							</div>
						</div>

						<div className='border-t pt-4'>
							<button
								onClick={() => setSelectedRequest(null)}
								className='text-secondary w-full rounded-lg bg-gray-100 px-4 py-2 font-medium transition-colors hover:bg-gray-200'
							>
								Đóng
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default SentRequests
