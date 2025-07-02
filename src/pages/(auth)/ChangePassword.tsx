import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { LockIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

import InputText from '@/components/common/InputText'
import { useResetPasswordMutation } from '@/hooks/mutations/use-auth.mutation'
import { resetPasswordSchema } from '@/models/schema'
import { ResetPasswordFormData } from '@/models/types'

interface ChangePasswordProps {
	onResetPasswordSuccess?: () => void
	verifyToken: string
	email: string
}

const ChangePassword: React.FC<ChangePasswordProps> = ({
	onResetPasswordSuccess,
	verifyToken,
	email
}) => {
	const { mutate, isPending } = useResetPasswordMutation({
		onSuccess: () => {
			onResetPasswordSuccess?.()
		},
		onError: (message: string) => {
			if (currentPassword) {
				setError('currentPassword', {
					type: 'manual',
					message: message
				})
			} else
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
			verifyToken,
			email
		}

		mutate(formatData)
	}

	const password = watch('password')
	const currentPassword = watch('currentPassword')

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
		<div className='bg-card'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-5'
			>
				<div>
					<InputText
						name='currentPassword'
						label='Mật khẩu cũ*'
						type='password'
						placeholder='Nhập mật khẩu cũ'
						register={register}
						error={errors.currentPassword}
						icon={LockIcon}
						showToggle
						animationDelay={0.1}
					/>

					{/* Current Password Strength Indicator */}
					{currentPassword && (
						<motion.div
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							className='mt-2'
						>
							<div className='flex items-center space-x-2'>
								<div className='bg-muted h-2 flex-1 rounded-full'>
									<div
										className={`h-2 rounded-full transition-all duration-300 ${
											getPasswordStrength(currentPassword).score <= 2
												? 'bg-destructive'
												: getPasswordStrength(currentPassword).score <= 3
													? 'bg-yellow-500'
													: getPasswordStrength(currentPassword).score <= 4
														? 'bg-primary'
														: 'bg-green-500'
										}`}
										style={{
											width: `${(getPasswordStrength(currentPassword).score / 5) * 100}%`
										}}
									/>
								</div>
								<span
									className={`text-xs font-medium ${getPasswordStrength(currentPassword).color}`}
								>
									{getPasswordStrength(currentPassword).text}
								</span>
							</div>
						</motion.div>
					)}
				</div>

				<div>
					<InputText
						name='password'
						label='Mật khẩu mới*'
						type='password'
						placeholder='Nhập mật khẩu mới'
						register={register}
						error={errors.password}
						icon={LockIcon}
						showToggle
						animationDelay={0.2}
					/>

					{/* New Password Strength Indicator */}
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

							{/* Password Requirements */}
							<div className='mt-3 space-y-1'>
								<p className='text-muted-foreground mb-2 text-xs font-medium'>
									Mật khẩu cần có:
								</p>
								<div className='grid grid-cols-1 gap-1 text-xs'>
									<div
										className={`flex items-center gap-2 ${password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}
									>
										<div
											className={`h-1.5 w-1.5 rounded-full ${password.length >= 8 ? 'bg-green-600' : 'bg-muted-foreground'}`}
										/>
										Ít nhất 8 ký tự
									</div>
									<div
										className={`flex items-center gap-2 ${/[a-z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}`}
									>
										<div
											className={`h-1.5 w-1.5 rounded-full ${/[a-z]/.test(password) ? 'bg-green-600' : 'bg-muted-foreground'}`}
										/>
										Chữ thường (a-z)
									</div>
									<div
										className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}`}
									>
										<div
											className={`h-1.5 w-1.5 rounded-full ${/[A-Z]/.test(password) ? 'bg-green-600' : 'bg-muted-foreground'}`}
										/>
										Chữ hoa (A-Z)
									</div>
									<div
										className={`flex items-center gap-2 ${/\d/.test(password) ? 'text-green-600' : 'text-muted-foreground'}`}
									>
										<div
											className={`h-1.5 w-1.5 rounded-full ${/\d/.test(password) ? 'bg-green-600' : 'bg-muted-foreground'}`}
										/>
										Số (0-9)
									</div>
									<div
										className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'text-green-600' : 'text-muted-foreground'}`}
									>
										<div
											className={`h-1.5 w-1.5 rounded-full ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? 'bg-green-600' : 'bg-muted-foreground'}`}
										/>
										Ký tự đặc biệt (!@#$%...)
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</div>

				{/* Confirm Password Input */}
				<InputText
					name='rePassword'
					label='Xác nhận mật khẩu mới*'
					type='password'
					placeholder='Nhập lại mật khẩu mới'
					register={register}
					error={errors.rePassword}
					icon={LockIcon}
					showToggle
					animationDelay={0.3}
				/>

				{/* Submit Button */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.3 }}
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
							Đang cập nhật mật khẩu...
						</div>
					) : (
						'CẬP NHẬT MẬT KHẨU'
					)}
				</motion.button>

				{/* Security Notice */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
					className='bg-primary/5 border-primary/20 rounded-lg border p-4'
				>
					<div className='flex items-start gap-3'>
						<div className='bg-primary/20 mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full'>
							<LockIcon className='text-primary h-3 w-3' />
						</div>
						<div className='text-muted-foreground text-sm'>
							<p className='text-foreground mb-1 font-medium'>Lưu ý bảo mật:</p>
							<ul className='space-y-1 text-xs'>
								<li>
									• Sau khi đổi mật khẩu thành công, bạn sẽ được đăng xuất tự
									động
								</li>
								<li>• Vui lòng đăng nhập lại bằng mật khẩu mới</li>
								<li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
							</ul>
						</div>
					</div>
				</motion.div>
			</form>
		</div>
	)
}

export default ChangePassword
