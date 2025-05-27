import { FieldError, UseFormRegister } from 'react-hook-form'

interface DatePickerProps {
	name: string
	label: string
	register: UseFormRegister<any>
	error?: FieldError
}

const DatePicker: React.FC<DatePickerProps> = ({
	name,
	label,
	register,
	error
}) => {
	return (
		<div>
			<label className='text-foreground mb-2 block text-sm font-medium'>
				{label}
			</label>
			<input
				type='datetime-local'
				{...register(name)}
				className='border-border bg-card text-card-foreground focus:ring-primary w-full rounded-lg border px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
			/>
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}
		</div>
	)
}

export default DatePicker
