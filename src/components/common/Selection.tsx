import React from 'react'
import { FieldError } from 'react-hook-form'

interface SelectionProps {
	name: string
	label?: string
	options: { id: number; name: string }[]
	isLoading: boolean
	register: any
	error?: FieldError
	disabled?: boolean
	animationDelay?: number
	defaulTextOption?: string
}

const Selection: React.FC<SelectionProps> = ({
	name,
	label,
	options,
	isLoading,
	register,
	error,
	disabled,
	animationDelay,
	defaulTextOption
}) => {
	return (
		<div
			className={`space-y-1 transition-all duration-200 ${
				animationDelay ? `delay-${animationDelay * 100}` : ''
			}`}
		>
			{label && (
				<label className='text-foreground block text-sm font-medium'>
					{label}
				</label>
			)}
			<div className='relative'>
				<select
					{...register(name, { valueAsNumber: true })}
					disabled={disabled || isLoading}
					className={`border-border bg-card text-foreground focus:border-primary focus:ring-primary w-full appearance-none rounded-md border p-2 pr-8 transition-colors ${
						error
							? 'border-destructive text-destructive placeholder-destructive'
							: ''
					} ${disabled || isLoading ? 'bg-muted text-muted-foreground' : ''}`}
				>
					<option value={0}>
						{isLoading ? 'Đang tải...' : `Chọn ${defaulTextOption || 'option'}`}
					</option>
					{options.map(option => (
						<option
							key={option.id}
							value={option.id}
						>
							{option.name}
						</option>
					))}
				</select>
				{/* Thêm icon dropdown tùy chỉnh */}
				<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2'>
					<svg
						className='text-foreground h-5 w-5'
						fill='none'
						stroke='currentColor'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M19 9l-7 7-7-7'
						/>
					</svg>
				</div>
			</div>
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}
		</div>
	)
}

export default Selection
