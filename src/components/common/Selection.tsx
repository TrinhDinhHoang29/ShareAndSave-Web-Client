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
			<select
				{...register(name, { valueAsNumber: true })}
				disabled={disabled || isLoading}
				className={`border-border bg-card text-foreground focus:border-primary focus:ring-primary w-full rounded-md border p-2 transition-colors ${
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
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}
		</div>
	)
}

export default Selection
