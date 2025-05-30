import { ReactNode } from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface RadioGroupOption {
	value: string // Thay đổi từ string thành number
	title: string
	description: string
	icon: ReactNode
}

interface RadioGroupComponentProps {
	name: string
	label?: string
	options: RadioGroupOption[]
	register: UseFormRegister<any>
	error?: FieldError
	defaultValue?: string // Thay đổi từ string thành number
}

const RadioGroupComponent: React.FC<RadioGroupComponentProps> = ({
	name,
	label,
	options,
	register,
	error,
	defaultValue
}) => {
	return (
		<div>
			{/* Label chính cho Radio Group */}
			{label && (
				<label className='text-foreground mb-2 block text-sm font-medium'>
					{label}
				</label>
			)}

			{/* Container cho các radio options */}
			<div className='space-y-2'>
				{options.map(option => (
					<label
						key={option.value}
						className='border-border bg-card hover:bg-muted/20 group flex cursor-pointer items-center justify-between rounded-lg border p-4 transition-all duration-200'
					>
						{/* Phần title và description */}
						<div className='flex-1'>
							<p className='text-foreground font-medium'>{option.title}</p>
							<p className='text-muted-foreground text-sm'>
								{option.description}
							</p>
						</div>

						{/* Phần icon */}
						<div className='flex items-center space-x-3'>
							<div className='text-muted-foreground group-hover:text-primary transition-colors duration-200'>
								{option.icon}
							</div>

							{/* Input radio ẩn */}
							<input
								type='radio'
								value={option.value}
								{...register(name)}
								defaultChecked={defaultValue === option.value}
								className='peer sr-only'
							/>
							{/* Vòng tròn biểu thị trạng thái active */}
							<div className='border-border peer-checked:border-primary peer-checked:bg-primary/20 peer-checked:ring-primary/50 h-5 w-5 rounded-full border transition-all duration-200 peer-checked:ring-2'></div>
						</div>
					</label>
				))}
			</div>

			{/* Hiển thị lỗi nếu có */}
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}
		</div>
	)
}

export default RadioGroupComponent
