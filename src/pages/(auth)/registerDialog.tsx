import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { LockIcon, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

import InputText from '@/components/common/InputText'
import { registerSchema } from '@/models/schema'
import { RegisterFormData } from '@/models/types'

interface RegisterDialogProps {
	onRegisterSuccess: () => void
	onLogin: () => void
}

const RegisterDialog: React.FC<RegisterDialogProps> = ({
	onRegisterSuccess,
	onLogin
}) => {
	// const { api, login } = useAuth()
	const [isLoading, setIsLoading] = React.useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		watch
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: 'onChange'
	})

	const password = watch('password')

	const onSubmit = async (data: RegisterFormData) => {
		setIsLoading(true)
		// try {
		//   const response = await api.post('/register', {
		//     fullName: data.fullName,
		//     phoneNumber: data.phoneNumber,
		//     email: data.email,
		//     password: data.password,
		//   })
		//   const { accessToken, refreshToken, user } = response.data
		//   login(accessToken, refreshToken, user)
		//   onRegisterSuccess()
		//   reset()
		// } catch (error) {
		//   console.error('Register error:', error)
		//   // Optionally show error message to user
		// } finally {
		//   setIsLoading(false)
		// }
	}

	const handleClose = () => {
		reset()
	}

	const handleLoginClick = () => {
		handleClose()
		onLogin()
	}

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
				{/* Full Name Input */}
				<InputText
					name='fullName'
					label='Họ và tên *'
					type='text'
					placeholder='Nhập họ và tên đầy đủ'
					register={register}
					error={errors.fullName}
					icon={UserIcon}
					animationDelay={0.2}
				/>

				{/* Phone Number Input */}
				<InputText
					name='phoneNumber'
					label='Số điện thoại *'
					type='tel'
					placeholder='Nhập số điện thoại'
					register={register}
					error={errors.phoneNumber}
					icon={PhoneIcon}
					animationDelay={0.3}
				/>

				{/* Email Input */}
				<InputText
					name='email'
					label='Email *'
					type='email'
					placeholder='Nhập địa chỉ email'
					register={register}
					error={errors.email}
					icon={MailIcon}
					animationDelay={0.4}
				/>

				{/* Password Input */}
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
					name='confirmPassword'
					label='Nhập lại mật khẩu *'
					type='password'
					placeholder='Nhập lại mật khẩu'
					register={register}
					error={errors.confirmPassword}
					icon={LockIcon}
					showToggle
					animationDelay={0.6}
				/>

				{/* Terms and Conditions */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7, duration: 0.3 }}
					className='text-foreground/70 text-xs leading-relaxed'
				>
					Bằng cách đăng ký, bạn đồng ý với{' '}
					<button
						type='button'
						className='text-primary hover:text-primary/80 underline'
					>
						Điều khoản dịch vụ
					</button>{' '}
					và{' '}
					<button
						type='button'
						className='text-primary hover:text-primary/80 underline'
					>
						Chính sách bảo mật
					</button>{' '}
					của chúng tôi.
				</motion.div>

				{/* Register Button */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8, duration: 0.3 }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					type='submit'
					disabled={!isValid || isLoading}
					className={`w-full rounded-xl py-3 font-semibold text-white transition-all duration-200 ${
						isValid && !isLoading
							? 'bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl'
							: 'bg-muted cursor-not-allowed'
					}`}
				>
					{isLoading ? (
						<div className='flex items-center justify-center'>
							<div className='mr-2 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
							Đang tạo tài khoản...
						</div>
					) : (
						'TẠO TÀI KHOẢN'
					)}
				</motion.button>
			</form>

			{/* Divider */}
			<motion.div
				initial={{ opacity: 0, scaleX: 0 }}
				animate={{ opacity: 1, scaleX: 1 }}
				transition={{ delay: 0.9, duration: 0.3 }}
				className='relative my-6'
			>
				<div className='absolute inset-0 flex items-center'>
					<div className='border-border w-full border-t' />
				</div>
				<div className='relative flex justify-center text-sm'>
					<span className='bg-card text-foreground/70 px-4 font-medium'>
						hoặc
					</span>
				</div>
			</motion.div>

			{/* Login Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.0, duration: 0.3 }}
				className='space-y-4 text-center'
			>
				<p className='text-foreground/70 text-sm'>Đã có tài khoản?</p>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleLoginClick}
					className='border-border hover:border-border/80 text-foreground hover:bg-muted w-full rounded-xl border-2 py-3 font-semibold transition-all duration-200'
				>
					ĐĂNG NHẬP NGAY
				</motion.button>
			</motion.div>
		</div>
	)
}

export default RegisterDialog
