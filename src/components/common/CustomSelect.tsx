import clsx from 'clsx'
import { ChevronDown } from 'lucide-react'
import React from 'react'

import { IOption } from '@/models/interfaces'

interface CustomSelectProps {
	value: string | number
	onChange: (value: string | number) => void
	options: IOption[]
	className?: string
}

const CustomSelect: React.FC<CustomSelectProps> = ({
	value,
	onChange,
	options,
	className = ''
}) => {
	return (
		<div className={clsx('relative', className)}>
			<select
				value={value}
				onChange={e => onChange(e.target.value)}
				className={`bg-card text-foreground focus:ring-primary w-full appearance-none rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:outline-none`}
			>
				{options.map(option => (
					<option
						key={option.value}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</select>
			{/* Thêm icon dropdown tùy chỉnh */}
			<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-3'>
				<ChevronDown />
			</div>
		</div>
	)
}

export default CustomSelect
