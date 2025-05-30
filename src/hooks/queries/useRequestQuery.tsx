import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import requestApi from '@/apis/modules/request.api'
import { ERequestStatus, ERequestType } from '@/models/enums'

interface UseRequestListProps {
	currentPage: number
	itemsPerPage: number
	selectedType: ERequestType
	selectedStatus: ERequestStatus
	setTotalPages: (totalPages: number) => void
}

const useRequestList = ({
	currentPage,
	itemsPerPage,
	selectedType,
	selectedStatus,
	setTotalPages
}: UseRequestListProps) => {
	const queryKey = useMemo(
		() => ['requests', currentPage, itemsPerPage, selectedType, selectedStatus],
		[currentPage, itemsPerPage, selectedType, selectedStatus]
	)

	const {
		data: response,
		isLoading,
		error
	} = useQuery({
		queryKey,
		queryFn: () =>
			requestApi.listRequests(
				currentPage,
				itemsPerPage,
				selectedType !== ERequestType.ALL ? selectedType : undefined,
				selectedStatus !== ERequestStatus.ALL ? selectedStatus : undefined
			)
	})

	const requests = response?.data.data || []
	const totalPages = response?.data.totalPages || 1

	useEffect(() => {
		console.log('Updating totalPages:', { currentPage, totalPages })
		setTotalPages(totalPages)
	}, [totalPages, setTotalPages])

	return {
		requests,
		isLoading,
		error,
		totalPages
	}
}

export default useRequestList
