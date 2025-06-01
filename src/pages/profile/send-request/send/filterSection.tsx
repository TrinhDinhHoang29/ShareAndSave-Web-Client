import { Filter } from 'lucide-react'
import React from 'react'

import { ERequestStatus, ERequestType } from '@/models/enums'
import { statusOptions, typeOptions } from '@/models/options'

interface FilterSectionProps {
	selectedType: ERequestType
	setSelectedType: (value: ERequestType) => void
	selectedStatus: ERequestStatus
	setSelectedStatus: (value: ERequestStatus) => void
}

const FilterSection: React.FC<FilterSectionProps> = ({
	selectedType,
	setSelectedType,
	selectedStatus,
	setSelectedStatus
}) => {
	return (
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
						onChange={e => setSelectedType(e.target.value as ERequestType)}
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
						onChange={e => setSelectedStatus(e.target.value as ERequestStatus)}
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
	)
}

export default FilterSection
