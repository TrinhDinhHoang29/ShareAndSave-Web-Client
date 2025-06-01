import { motion } from 'framer-motion'
import { EyeIcon, EyeOffIcon, LucideIcon } from 'lucide-react'
import React from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface InputTextProps {
	name: string
	label: string
	type?: 'text' | 'email' | 'tel' | 'password' | 'textarea'
	placeholder?: string
	register: UseFormRegister<any>
	error?: FieldError
	rows?: number // For textarea
	icon?: LucideIcon // For left icon
	showToggle?: boolean // For password visibility toggle
	animationDelay?: number // For motion animation
}

const InputText: React.FC<InputTextProps> = ({
	name,
	label,
	type = 'text',
	placeholder,
	register,
	error,
	rows = 8,
	icon: Icon,
	showToggle = false,
	animationDelay = 0.2
}) => {
	const [showPassword, setShowPassword] = React.useState(false)

	const commonClasses = `w-full px-4 py-3 border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
		error
			? 'border-destructive bg-destructive/10'
			: 'border-border hover:border-border/80'
	}`

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: animationDelay, duration: 0.3 }}
		>
			<label className='text-foreground mb-2 block text-sm font-medium'>
				{label}
			</label>
			<div className='relative'>
				{Icon && (
					<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
						<Icon className='text-foreground/50 h-5 w-5' />
					</div>
				)}
				{type === 'textarea' ? (
					<textarea
						{...register(name)}
						rows={rows}
						className={`${commonClasses} ${Icon ? 'pl-10' : 'pl-4'} resize-none`}
						placeholder={placeholder}
					/>
				) : (
					<input
						type={type === 'password' && showPassword ? 'text' : type}
						{...register(name)}
						className={`${commonClasses} ${showToggle ? 'pr-12' : 'pr-4'} ${Icon && 'pl-12'}`}
						placeholder={placeholder}
					/>
				)}
				{type === 'password' && showToggle && (
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='hover:text-foreground/70 absolute inset-y-0 right-0 flex items-center pr-3 transition-colors'
					>
						{showPassword ? (
							<EyeOffIcon className='text-foreground/50 h-5 w-5' />
						) : (
							<EyeIcon className='text-foreground/50 h-5 w-5' />
						)}
					</button>
				)}
			</div>
			{error && (
				<motion.p
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className='text-destructive mt-1 text-sm'
				>
					{error.message}
				</motion.p>
			)}
		</motion.div>
	)
}

export default InputText
