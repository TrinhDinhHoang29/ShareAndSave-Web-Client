import { ChevronLeft, ChevronRight } from 'lucide-react'
import React from 'react'

interface PaginationProps {
	currentPage: number
	totalPages: number
	setCurrentPage: (page: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
	currentPage,
	totalPages,
	setCurrentPage
}) => {
	if (totalPages <= 1) return null

	const handlePageChange = (page: number) => {
		if (page >= 1 && page <= totalPages) {
			console.log('Page changed:', { page })
			setCurrentPage(page)
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	return (
		<div className='border-t border-gray-200 bg-gray-50 px-6 py-4'>
			<div className='flex items-center justify-end'>
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
						{Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
						))}
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
	)
}

export default Pagination
