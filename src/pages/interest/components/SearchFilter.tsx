import { Calendar, ChevronDown, Search, X } from 'lucide-react'
import React, { useState } from 'react'

interface SortOrder {
	type: 'newest' | 'oldest'
}

interface SearchFilterProps {
	onSearch: (
		searchBy: 'post' | 'person',
		searchValue: string,
		sortOrder: SortOrder,
		activeTab: 'active' | 'completed'
	) => void
	activeTab: 'active' | 'completed'
}

const SearchFilter: React.FC<SearchFilterProps> = ({ onSearch, activeTab }) => {
	const [searchBy, setSearchBy] = useState<'post' | 'person'>('post')
	const [searchValue, setSearchValue] = useState('')
	const [sortOrder, setSortOrder] = useState<SortOrder>({ type: 'newest' })
	const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false)
	const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchValue(value)
		onSearch(searchBy, value, sortOrder, activeTab)
	}

	const handleSearchBySelect = (type: 'post' | 'person') => {
		setSearchBy(type)
		setSearchValue('')
		onSearch(type, '', sortOrder, activeTab)
		setIsSearchDropdownOpen(false)
	}

	const handleSortSelect = (type: SortOrder['type']) => {
		const newSortOrder: SortOrder = { type }
		setSortOrder(newSortOrder)
		onSearch(searchBy, searchValue, newSortOrder, activeTab)
		setIsSortDropdownOpen(false)
	}

	const clearSearch = () => {
		setSearchValue('')
		onSearch(searchBy, '', sortOrder, activeTab)
	}

	const searchByLabel = () => {
		return searchBy === 'post' ? 'Bài đăng' : 'Người quan tâm'
	}

	const sortLabel = () => {
		return sortOrder.type === 'newest' ? 'Mới nhất' : 'Cũ nhất'
	}

	return (
		<div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center'>
			{/* Search By Dropdown */}
			<div className='relative w-full sm:w-40'>
				<button
					onClick={() => setIsSearchDropdownOpen(!isSearchDropdownOpen)}
					className='border-border bg-card/05 text-foreground flex w-full items-center justify-between rounded-lg border px-4 py-2 text-sm'
				>
					<span>{searchByLabel()}</span>
					<ChevronDown
						className={`h-4 w-4 transition-transform ${isSearchDropdownOpen ? 'rotate-180' : ''}`}
					/>
				</button>
				{isSearchDropdownOpen && (
					<div className='border-border bg-card absolute z-10 mt-2 w-full rounded-lg border shadow-lg'>
						<div className='px-2 py-1'>
							{['post', 'person'].map(type => (
								<button
									key={type}
									onClick={() =>
										handleSearchBySelect(type as 'post' | 'person')
									}
									className='text-foreground hover:bg-muted w-full rounded-md px-4 py-2 text-left text-sm'
								>
									{type === 'post' ? 'Bài đăng' : 'Người quan tâm'}
								</button>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Search Input */}
			<div className='relative flex-1'>
				<div className='relative'>
					<Search className='text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2' />
					<input
						type='text'
						value={searchValue}
						onChange={handleSearchChange}
						placeholder={`Tìm kiếm theo ${searchBy === 'post' ? 'tiêu đề bài viết' : 'tên người quan tâm'}`}
						className='border-border bg-card/80 text-foreground focus:ring-chart-accent-1 w-full rounded-lg border py-2 pr-10 pl-10 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
					/>
					{searchValue && (
						<button
							onClick={clearSearch}
							className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2'
						>
							<X className='h-5 w-5' />
						</button>
					)}
				</div>
			</div>

			{/* Sort Dropdown */}
			<div className='relative w-full sm:w-40'>
				<button
					onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
					className='border-border bg-card/05 text-foreground flex w-full items-center justify-between rounded-lg border px-4 py-2 text-sm'
				>
					<span className='flex items-center gap-2'>
						<Calendar className='text-muted-foreground h-4 w-4' />
						{sortLabel()}
					</span>
					<ChevronDown
						className={`h-4 w-4 transition-transform ${isSortDropdownOpen ? 'rotate-180' : ''}`}
					/>
				</button>
				{isSortDropdownOpen && (
					<div className='border-border bg-card absolute z-10 mt-2 w-full rounded-lg border shadow-lg'>
						<div className='px-2 py-1'>
							{['newest', 'oldest'].map(type => (
								<button
									key={type}
									onClick={() => handleSortSelect(type as SortOrder['type'])}
									className='text-foreground hover:bg-muted w-full rounded-md px-4 py-2 text-left text-sm'
								>
									{type === 'newest' ? 'Mới nhất' : 'Cũ nhất'}
								</button>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default SearchFilter
