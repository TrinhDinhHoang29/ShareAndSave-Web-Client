import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { Search, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import CustomSelect from '@/components/common/CustomSelect'
import { EMethod, ETransactionStatus } from '@/models/enums'
import { IOption, IUserInterest } from '@/models/interfaces'
import { InterestItem } from '@/pages/interest/components/InterestItem'

interface InterestListDialogProps {
	isOpen: boolean
	onClose: () => void
	interests: IUserInterest[]
	postID: number
	authorID: number
	title?: string
}

const FILTER_OPTIONS: IOption[] = [
	{ value: 'all', label: 'Tất cả trạng thái' },
	{ value: ETransactionStatus.PENDING, label: 'Đang chờ giao dịch' },
	{ value: ETransactionStatus.SUCCESS, label: 'Thành công' },
	{ value: ETransactionStatus.CANCELLED, label: 'Từ chối' },
	{ value: ETransactionStatus.REJECTED, label: 'Đã hủy' }
]

const METHOD_OPTIONS: IOption[] = [
	{ value: 'all', label: 'Tất cả phương thức' },
	{ value: EMethod.IN_PERSON, label: EMethod.IN_PERSON },
	{ value: EMethod.SHIP, label: EMethod.SHIP }
]

const SORT_OPTIONS: IOption[] = [
	{ value: 'default', label: 'Mặc định' },
	{ value: 'date_asc', label: 'Cũ nhất' },
	{ value: 'date_desc', label: 'Mới nhất' }
]

const InterestListDialog = ({
	isOpen,
	onClose,
	interests,
	postID,
	authorID,
	title = 'Danh sách quan tâm'
}: InterestListDialogProps) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedFilter, setSelectedFilter] = useState<string>('all')
	const [selectedMethod, setSelectedMethod] = useState<string | number>('all')
	const [selectedSort, setSelectedSort] = useState<string | number>('default')
	const [newInterests, setNewInterests] = useState<IUserInterest[]>(interests)

	useEffect(() => {
		setNewInterests(interests)
	}, [interests])

	const updateTransactionStatus = (
		interestId: number,
		status: ETransactionStatus,
		method: EMethod
	) => {
		console.log('updateTransactionStatus', interestId, status)
		setNewInterests(prevInterests =>
			prevInterests.map(interest =>
				interest.id === interestId
					? { ...interest, transactionStatus: status, method }
					: interest
			)
		)
	}

	// Filter và search logic
	const filteredInterests = useMemo(() => {
		let filtered = [...newInterests]

		// Apply search filter
		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim()
			filtered = filtered.filter(
				interest =>
					interest.userName.toLowerCase().includes(query) ||
					interest.newMessage?.toLowerCase().includes(query)
			)
		}

		// Apply status filter
		if (selectedFilter !== 'all') {
			filtered = filtered.filter(
				interest =>
					(interest.transactionStatus?.toString() as ETransactionStatus) ===
					(selectedFilter.toString() as ETransactionStatus)
			)
		}

		// Apply method filter (assuming IUserInterest has method property)
		if (selectedMethod !== 'all') {
			filtered = filtered.filter(
				interest => (interest.method?.toString() as EMethod) === selectedMethod // Type assertion needed, adjust based on your interface
			)
		}

		// Apply sorting
		if (selectedSort !== 'default') {
			filtered.sort((a, b) => {
				switch (selectedSort) {
					case 'date_asc':
						return (
							new Date(a.updatedAt || 0).getTime() -
							new Date(b.updatedAt || 0).getTime()
						)
					case 'date_desc':
						return (
							new Date(b.updatedAt || 0).getTime() -
							new Date(a.updatedAt || 0).getTime()
						)
					default:
						return 0
				}
			})
		}

		return filtered
	}, [newInterests, searchQuery, selectedFilter, selectedMethod, selectedSort])
	useEffect(() => {
		if (!isOpen) {
			setSearchQuery('')
			setSelectedFilter('all')
			setSelectedMethod('all')
			setSelectedSort('default')
		}
	}, [isOpen])

	const handleResetFilters = () => {
		setSearchQuery('')
		setSelectedFilter('all')
		setSelectedMethod('all')
		setSelectedSort('default')
	}

	const hasActiveFilters =
		searchQuery ||
		selectedFilter !== 'all' ||
		selectedMethod !== 'all' ||
		selectedSort !== 'default'

	return (
		<Dialog
			as='div'
			className='relative z-50'
			open={isOpen}
			onClose={onClose}
		>
			{/* Backdrop */}
			<div className='fixed inset-0 bg-black/25 backdrop-blur-sm' />

			{/* Dialog container */}
			<div className='fixed inset-0 overflow-y-auto'>
				<div className='flex min-h-full items-center justify-center p-4'>
					<DialogPanel className='bg-card w-full max-w-5xl transform overflow-hidden rounded-2xl shadow-2xl'>
						{/* Header */}
						<div className='border-border bg-card border-b px-6 py-4'>
							<div className='flex items-center justify-between'>
								<DialogTitle className='text-foreground text-xl font-semibold'>
									{title}
									<span className='text-muted-foreground ml-2 text-sm font-normal'>
										({filteredInterests.length} kết quả)
									</span>
								</DialogTitle>
								<button
									onClick={onClose}
									className='text-muted-foreground hover:bg-muted hover:text-foreground rounded-full p-2 transition-colors'
								>
									<X className='h-5 w-5' />
								</button>
							</div>

							{/* Search and Filter Bar */}
							<div className='mt-4 space-y-3'>
								{/* Search Input */}
								<div className='relative'>
									<Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
									<input
										type='text'
										placeholder='Tìm kiếm theo tên hoặc tin nhắn...'
										value={searchQuery}
										onChange={e => setSearchQuery(e.target.value)}
										className='border-border bg-input focus:border-primary focus:ring-primary/20 text-foreground w-full rounded-lg border py-2.5 pr-4 pl-10 text-sm focus:ring-2 focus:outline-none'
									/>
								</div>

								{/* Filter Controls Row */}
								<div className='flex flex-col gap-3 sm:flex-row'>
									{/* Status Filter */}
									<div className='flex-1'>
										<CustomSelect
											value={selectedFilter}
											onChange={value =>
												setSelectedFilter(value as ETransactionStatus)
											}
											options={FILTER_OPTIONS}
											className='w-full'
										/>
									</div>

									{/* Method Filter */}
									<div className='flex-1'>
										<CustomSelect
											value={selectedMethod}
											onChange={setSelectedMethod}
											options={METHOD_OPTIONS}
											className='w-full'
										/>
									</div>

									{/* Sort Options */}
									<div className='flex-1'>
										<CustomSelect
											value={selectedSort}
											onChange={setSelectedSort}
											options={SORT_OPTIONS}
											className='w-full'
										/>
									</div>
								</div>

								{/* Reset Filters Button */}
								{hasActiveFilters && (
									<div className='flex justify-end'>
										<button
											onClick={handleResetFilters}
											className='text-muted-foreground hover:text-foreground text-sm underline transition-colors'
										>
											Xóa tất cả bộ lọc
										</button>
									</div>
								)}
							</div>
						</div>

						{/* Content */}
						<div className='max-h-[calc(100vh-20rem)] overflow-y-auto'>
							{filteredInterests.length > 0 ? (
								<div className='space-y-3 p-6'>
									{filteredInterests.map(interest => (
										<InterestItem
											isQuick={true}
											key={interest.id}
											userInterest={interest}
											postID={postID}
											authorID={authorID}
											updateTransactionStatus={updateTransactionStatus}
										/>
									))}
								</div>
							) : (
								<div className='flex flex-col items-center justify-center py-12 text-center'>
									<div className='bg-muted mb-4 rounded-full p-4'>
										<Search className='text-muted-foreground h-8 w-8' />
									</div>
									<h3 className='text-foreground mb-2 text-lg font-medium'>
										Không tìm thấy kết quả
									</h3>
									<p className='text-muted-foreground max-w-sm'>
										{searchQuery
											? `Không có kết quả nào phù hợp với "${searchQuery}"`
											: 'Không có mục quan tâm nào phù hợp với bộ lọc đã chọn'}
									</p>
									{hasActiveFilters && (
										<button
											onClick={handleResetFilters}
											className='bg-primary text-primary-foreground hover:bg-primary/90 mt-4 rounded-lg px-4 py-2 text-sm font-medium transition-colors'
										>
											Xóa tất cả bộ lọc
										</button>
									)}
								</div>
							)}
						</div>

						{/* Footer */}
						{filteredInterests.length > 0 && (
							<div className='border-border bg-muted border-t px-6 py-4'>
								<div className='text-muted-foreground flex items-center justify-between text-sm'>
									<span>
										Hiển thị {filteredInterests.length} / {newInterests.length}{' '}
										mục quan tâm
										{hasActiveFilters && ' (đã lọc)'}
									</span>
									<button
										onClick={onClose}
										className='bg-card border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium transition-colors'
									>
										Đóng
									</button>
								</div>
							</div>
						)}
					</DialogPanel>
				</div>
			</div>
		</Dialog>
	)
}

export default InterestListDialog
