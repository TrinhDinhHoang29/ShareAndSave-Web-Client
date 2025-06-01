import React, { useEffect, useState } from 'react'

import Loading from '@/components/common/Loading'
import Pagination from '@/components/common/Pagination'
import useRequestList from '@/hooks/queries/useRequestQuery'
import { ERequestStatus, ERequestType } from '@/models/enums'
import { IRequest } from '@/models/interfaces'

import FilterSection from './filterSection'
import RequestDetailsModal from './requestDetailModal'
import RequestList from './requestList'

const SendRequest: React.FC = () => {
	const [selectedType, setSelectedType] = useState<ERequestType>(
		ERequestType.ALL
	)
	const [selectedStatus, setSelectedStatus] = useState<ERequestStatus>(
		ERequestStatus.ALL
	)
	const [selectedRequest, setSelectedRequest] = useState<IRequest | null>(null)
	const [currentPage, setCurrentPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const itemsPerPage = 6

	useEffect(() => {
		console.log('Filters changed:', { selectedType, selectedStatus })
		setCurrentPage(1)
	}, [selectedType, selectedStatus])

	const { requests, isLoading, error } = useRequestList({
		currentPage,
		itemsPerPage,
		selectedType,
		selectedStatus,
		setTotalPages
	})

	return (
		<div className='bg-card text-foreground mx-auto max-w-4xl space-y-6 rounded-lg border border-gray-200 p-6 shadow-md'>
			<div className='space-y-2'>
				<h1 className='text-foreground text-2xl font-semibold'>
					Yêu cầu đã gửi
				</h1>
				<p className='text-foreground/60'>
					Quản lý và theo dõi các yêu cầu của bạn
				</p>
			</div>
			<FilterSection
				selectedType={selectedType}
				setSelectedType={setSelectedType}
				selectedStatus={selectedStatus}
				setSelectedStatus={setSelectedStatus}
			/>
			{isLoading ? (
				<Loading />
			) : error ? (
				<div className='py-16 text-center text-red-500'>
					Lỗi: {(error as Error).message}
				</div>
			) : (
				<RequestList
					requests={requests}
					onSelect={setSelectedRequest}
				/>
			)}
			<Pagination
				currentPage={currentPage}
				totalPages={totalPages}
				setCurrentPage={setCurrentPage}
			/>
			{selectedRequest && (
				<RequestDetailsModal
					request={selectedRequest}
					onClose={() => setSelectedRequest(null)}
				/>
			)}
		</div>
	)
}

export default SendRequest
