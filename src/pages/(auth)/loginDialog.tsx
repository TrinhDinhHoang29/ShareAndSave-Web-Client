import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { LockIcon, MailIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

import InputText from '@/components/common/InputText'
import { useLoginMutaion } from '@/hooks/mutations/use-auth.mutation'
import { loginSchema } from '@/models/schema'
import { LoginFormData } from '@/models/types'

interface LoginDialogProps {
	onLoginSucess: () => void
	onRegister: () => void
}

const LoginDialog: React.FC<LoginDialogProps> = ({
	onLoginSucess,
	onRegister
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		reset,
		setError
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange'
	})

	// const { api, login } = useAuth()
	const { mutate, isPending } = useLoginMutaion({
		onSuccess: () => {
			onLoginSucess()
		},
		onError: (message: string) => {
			setError('password', { message })
		}
	})

	const onSubmit = async (data: LoginFormData) => {
		mutate({
			device: 'web',
			...data
		})
	}

	const handleClose = () => {
		reset()
	}

	const handleRegisterClick = () => {
		handleClose()
		onRegister()
	}

	return (
		<div className='bg-card p-6'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-5'
			>
				{/* Email/Phone Input */}
				<InputText
					name='email'
					label='Email'
					type='text'
					placeholder='Nhập email'
					register={register}
					error={errors.email}
					icon={MailIcon}
					animationDelay={0.2}
					autocompleted='off'
				/>

				{/* Password Input */}
				<InputText
					name='password'
					label='Mật khẩu'
					type='password'
					placeholder='Nhập mật khẩu'
					register={register}
					error={errors.password}
					icon={LockIcon}
					showToggle
					animationDelay={0.3}
					autocompleted='off'
				/>

				{/* Forgot Password */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.4, duration: 0.3 }}
					className='flex justify-end'
				>
					<button
						type='button'
						className='text-foreground/70 hover:text-foreground text-sm transition-all duration-200 hover:underline'
					>
						Quên mật khẩu?
					</button>
				</motion.div>

				{/* Login Button */}
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.3 }}
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
							Đang đăng nhập...
						</div>
					) : (
						'ĐĂNG NHẬP'
					)}
				</motion.button>
			</form>

			{/* Divider */}
			<motion.div
				initial={{ opacity: 0, scaleX: 0 }}
				animate={{ opacity: 1, scaleX: 1 }}
				transition={{ delay: 0.6, duration: 0.3 }}
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

			{/* Register Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.7, duration: 0.3 }}
				className='space-y-4 text-center'
			>
				<p className='text-foreground/70 text-sm'>Bạn chưa có tài khoản?</p>
				<motion.button
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={handleRegisterClick}
					className='border-border hover:border-border/80 text-foreground hover:bg-muted w-full rounded-xl border-2 py-3 font-semibold transition-all duration-200'
				>
					ĐĂNG KÝ NGAY
				</motion.button>
			</motion.div>
		</div>
	)
}

export default LoginDialog
