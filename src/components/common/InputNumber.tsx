import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import React from 'react'
import { FieldError, UseFormRegister } from 'react-hook-form'

interface InputNumberProps {
	name: string
	label: string
	placeholder?: string
	register: UseFormRegister<any>
	error?: FieldError
	min?: number
	icon?: LucideIcon
	animationDelay?: number
}

const InputNumber: React.FC<InputNumberProps> = ({
	name,
	label,
	placeholder,
	register,
	error,
	min = 1,
	icon: Icon,
	animationDelay = 0.2
}) => {
	const commonClasses = `w-full px-4 py-3 border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
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
				<input
					type='number'
					{...register(name, {
						valueAsNumber: true,
						min: { value: min, message: `Số lượng tối thiểu là ${min}` }
					})}
					className={`${commonClasses} ${Icon ? 'pl-12' : 'pl-4'}`}
					placeholder={placeholder}
					min={min}
				/>
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

export default InputNumber
