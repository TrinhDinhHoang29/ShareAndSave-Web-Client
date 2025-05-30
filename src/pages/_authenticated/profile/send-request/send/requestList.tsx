import React from 'react'

import { IRequest } from '@/models/interfaces'

import RequestItem from './requestItem'

interface RequestListProps {
	requests: IRequest[]
	onSelect: (request: IRequest) => void
}

const RequestList: React.FC<RequestListProps> = ({ requests, onSelect }) => {
	return (
		<div className='bg- overflow-hidden rounded-lg border border-gray-200'>
			{requests.length > 0 ? (
				<div className='divide-y divide-gray-100'>
					{requests.map(request => (
						<RequestItem
							key={`${request.id}-${request.type}-${request.date}`}
							request={request}
							onSelect={onSelect}
						/>
					))}
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
		</div>
	)
}

export default RequestList
