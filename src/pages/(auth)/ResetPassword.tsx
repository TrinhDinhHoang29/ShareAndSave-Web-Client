import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { LockIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

import InputText from '@/components/common/InputText'
import { useResetPasswordMutation } from '@/hooks/mutations/use-auth.mutation'
import { resetPasswordSchema } from '@/models/schema'
import { ResetPasswordFormData } from '@/models/types'

interface ResetPasswordDialogProps {
	onResetPasswordSuccess?: () => void
	email: string
	verifyToken: string
}

const ResetPasswordDialog: React.FC<ResetPasswordDialogProps> = ({
	onResetPasswordSuccess,
	email,
	verifyToken
}) => {
	const { mutate, isPending } = useResetPasswordMutation({
		onSuccess: () => {
			onResetPasswordSuccess?.()
		},
		onError: (message: string) => {
			setError('rePassword', {
				type: 'manual',
				message: message
			})
		}
	})

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		setError
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		mode: 'onChange'
	})

	const onSubmit = async (data: ResetPasswordFormData) => {
		const formatData = {
			...data,
			email,
			verifyToken
		}

		mutate(formatData)
	}

	const password = watch('password')

	// Password strength checker
	const getPasswordStrength = (password: string) => {
		if (!password) return { score: 0, text: '', color: '' }

		let score = 0
		if (password.length >= 8) score++
		if (/[a-z]/.test(password)) score++
		if (/[A-Z]/.test(password)) score++
		if (/\d/.test(password)) score++
		if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++

		const levels = [
			{ score: 0, text: '', color: '' },
			{ score: 1, text: 'Rất yếu', color: 'text-destructive' },
			{ score: 2, text: 'Yếu', color: 'text-orange-500' },
			{ score: 3, text: 'Trung bình', color: 'text-yellow-500' },
			{ score: 4, text: 'Mạnh', color: 'text-primary' },
			{ score: 5, text: 'Rất mạnh', color: 'text-green-500' }
		]

		return levels[score] || levels[0]
	}

	const passwordStrength = getPasswordStrength(password || '')

	return (
		<div className='bg-card p-6'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-5'
			>
				<div>
					<InputText
						name='password'
						label='Mật khẩu *'
						type='password'
						placeholder='Nhập mật khẩu'
						register={register}
						error={errors.password}
						icon={LockIcon}
						showToggle
						animationDelay={0.5}
					/>

					{/* Password Strength Indicator */}
					{password && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='mt-2'
						>
							<div className='flex items-center space-x-2'>
								<div className='bg-muted h-2 flex-1 rounded-full'>
									<div
										className={`h-2 rounded-full transition-all duration-300 ${
											passwordStrength.score <= 2
												? 'bg-destructive'
												: passwordStrength.score <= 3
													? 'bg-yellow-500'
													: passwordStrength.score <= 4
														? 'bg-primary'
														: 'bg-green-500'
										}`}
										style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
									/>
								</div>
								<span
									className={`text-xs font-medium ${passwordStrength.color}`}
								>
									{passwordStrength.text}
								</span>
							</div>
						</motion.div>
					)}
				</div>

				{/* Confirm Password Input */}
				<InputText
					name='rePassword'
					label='Nhập lại mật khẩu *'
					type='password'
					placeholder='Nhập lại mật khẩu'
					register={register}
					error={errors.rePassword}
					icon={LockIcon}
					showToggle
					animationDelay={0.6}
				/>

				{/* Register Button */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.3 }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type='submit'
					disabled={!isValid || isPending}
					className={`w-full rounded-xl py-3 font-semibold text-white transition-all duration-200 ${
						isValid && !isPending
							? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
							: 'bg-muted cursor-not-allowed'
					}`}
				>
					{isPending ? (
						<div className='flex items-center justify-center'>
							<div className='mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
							Đang gửi yêu cầu...
						</div>
					) : (
						'GỬI YÊU CẦU'
					)}
				</motion.button>
			</form>
		</div>
	)
}

export default ResetPasswordDialog
