import { Calendar } from 'lucide-react'
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
			{label && (
				<label className='text-foreground mb-2 block text-sm font-medium'>
					{label}
				</label>
			)}
			<div className='relative'>
				<Calendar className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-5 w-5 -translate-y-1/2 transform' />
				<input
					type='datetime-local'
					{...register(name)}
					className='border-border bg-card text-foreground focus:ring-primary w-full rounded-lg border py-3 pr-4 pl-12 transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
				/>
			</div>
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}
		</div>
	)
}

export default DatePicker
