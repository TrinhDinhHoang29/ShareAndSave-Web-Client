import { FieldError, UseFormRegister } from 'react-hook-form'

interface InputTextProps {
	name: string
	label: string
	type?: 'text' | 'email' | 'tel' | 'textarea'
	placeholder?: string
	register: UseFormRegister<any>
	error?: FieldError
	rows?: number // Dành cho textarea
}

const InputText: React.FC<InputTextProps> = ({
	name,
	label,
	type = 'text',
	placeholder,
	register,
	error,
	rows = 8
}) => {
	const commonClasses =
		'w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200'

	return (
		<div>
			<label className='text-foreground mb-2 block text-sm font-medium'>
				{label}
			</label>
			{type === 'textarea' ? (
				<textarea
					{...register(name)}
					rows={rows}
					className={`${commonClasses} resize-none`}
					placeholder={placeholder}
				/>
			) : (
				<input
					type={type}
					{...register(name)}
					className={commonClasses}
					placeholder={placeholder}
				/>
			)}
			{error && (
				<p className='text-destructive mt-1 text-sm'>{error.message}</p>
			)}
		</div>
	)
}

export default InputText
