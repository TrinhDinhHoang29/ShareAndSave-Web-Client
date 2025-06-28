import { motion } from 'framer-motion'
import { EyeIcon, EyeOffIcon, LucideIcon } from 'lucide-react'
import React from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface InputTextProps {
	name: string
	label?: string
	type?: 'text' | 'email' | 'tel' | 'password' | 'textarea'
	placeholder?: string
	register: UseFormRegister<any>
	error?: FieldError
	rows?: number // For textarea
	icon?: LucideIcon // For left icon
	showToggle?: boolean // For password visibility toggle
	animationDelay?: number // For motion animation
	autocompleted?: 'off' | 'on' // Autocomplete prop
	disabled?: boolean // Added disabled prop
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
	animationDelay = 0.2,
	autocompleted = 'on',
	disabled = false // Default to false
}) => {
	const [showPassword, setShowPassword] = React.useState(false)

	const commonClasses = `w-full px-4 py-3 border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
		error
			? 'border-destructive bg-destructive/10'
			: 'border-border hover:border-border/80'
	} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

	// CSS cho autocomplete fix
	const autocompleteStyles = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px var(--card) inset !important;
      -webkit-text-fill-color: var(--foreground) !important;
      transition: background-color 5000s ease-in-out 0s;
    }
    
    /* Đảm bảo icon không bị ảnh hưởng */
    .input-icon-wrapper .lucide {
      z-index: 20;
      position: relative;
    }
  `

	React.useEffect(() => {
		// Inject CSS styles nếu chưa có
		if (!document.getElementById('autocomplete-fix-styles')) {
			const style = document.createElement('style')
			style.id = 'autocomplete-fix-styles'
			style.textContent = autocompleteStyles
			document.head.appendChild(style)
		}
	}, [])

	return (
		<motion.div
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ delay: animationDelay, duration: 0.3 }}
		>
			{label && (
				<label className='text-foreground mb-2 block text-sm font-medium'>
					{label}
				</label>
			)}
			<div className='input-icon-wrapper relative'>
				{Icon && (
					<div className='pointer-events-none absolute inset-y-0 left-0 z-20 flex items-center pl-3'>
						<Icon className='text-foreground/50 h-5 w-5' />
					</div>
				)}
				{type === 'textarea' ? (
					<textarea
						{...register(name)}
						rows={rows}
						className={`${commonClasses} ${Icon ? 'pl-10' : 'pl-4'} resize-none`}
						placeholder={placeholder}
						autoComplete={autocompleted}
						disabled={disabled}
					/>
				) : (
					<input
						type={type === 'password' && showPassword ? 'text' : type}
						{...register(name)}
						className={`${commonClasses} ${showToggle ? 'pr-12' : 'pr-4'} ${
							Icon && 'pl-12'
						}`}
						placeholder={placeholder}
						autoComplete={autocompleted}
						disabled={disabled}
						style={{
							// Inline styles để đảm bảo autocomplete fix hoạt động
							WebkitBoxShadow: 'none',
							transition: 'background-color 5000s ease-in-out 0s'
						}}
					/>
				)}
				{type === 'password' && showToggle && (
					<button
						type='button'
						onClick={() => setShowPassword(!showPassword)}
						className='hover:text-foreground/70 absolute inset-y-0 right-0 z-10 flex items-center pr-3 transition-colors'
						disabled={disabled}
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
