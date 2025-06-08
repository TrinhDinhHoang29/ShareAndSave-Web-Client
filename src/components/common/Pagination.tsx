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

	// Generate page numbers with ellipsis logic
	const generatePageNumbers = () => {
		const pages: (number | string)[] = []
		const maxVisiblePages = 5

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i)
			}
		} else {
			// Always show first page
			pages.push(1)

			if (currentPage <= 3) {
				// Show first few pages
				for (let i = 2; i <= 4; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages)
			} else if (currentPage >= totalPages - 2) {
				// Show last few pages
				pages.push('...')
				for (let i = totalPages - 3; i <= totalPages; i++) {
					pages.push(i)
				}
			} else {
				// Show pages around current page
				pages.push('...')
				for (let i = currentPage - 1; i <= currentPage + 1; i++) {
					pages.push(i)
				}
				pages.push('...')
				pages.push(totalPages)
			}
		}

		return pages
	}

	const pageNumbers = generatePageNumbers()

	return (
		<div className='bg-transparent px-6 py-4'>
			<div className='flex items-center justify-end'>
				<div className='flex items-center space-x-2'>
					<button
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
						className='text-foreground bg-card border-border hover:bg-accent hover:text-accent-foreground disabled:hover:bg-card inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
					>
						<ChevronLeft className='mr-1 h-4 w-4' />
						Trước
					</button>

					<div className='flex items-center space-x-1'>
						{pageNumbers.map((page, index) => (
							<React.Fragment key={index}>
								{page === '...' ? (
									<span className='text-muted-foreground px-3 py-2 text-sm'>
										...
									</span>
								) : (
									<button
										onClick={() => handlePageChange(page as number)}
										className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
											currentPage === page
												? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm'
												: 'text-foreground hover:bg-accent hover:text-accent-foreground'
										}`}
									>
										{page}
									</button>
								)}
							</React.Fragment>
						))}
					</div>

					<button
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
						className='text-foreground bg-card border-border hover:bg-accent hover:text-accent-foreground disabled:hover:bg-card inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
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
