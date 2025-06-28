import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { MailIcon } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'

import InputText from '@/components/common/InputText'
import { useSendOTPMutation } from '@/hooks/mutations/use-auth.mutation'
import { EPurposeOTP } from '@/models/enums'
import { verifyEmailSchema } from '@/models/schema'
import { VerifyEmailFormData } from '@/models/types'

interface VerifyEmailDialogProps {
	onVerifyEmailSuccess: (email: string) => void
}

const VerifyEmailDialog: React.FC<VerifyEmailDialogProps> = ({
	onVerifyEmailSuccess
}) => {
	const { mutate, isPending } = useSendOTPMutation({
		onSuccess: () => {
			const data = getValues()
			onVerifyEmailSuccess(data.email)
		},
		onError: (message: string) => {
			setError('email', {
				type: 'manual',
				message: message
			})
		}
	})

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		getValues,
		setError
	} = useForm<VerifyEmailFormData>({
		resolver: zodResolver(verifyEmailSchema),
		mode: 'onChange'
	})

	const onSubmit = async (data: VerifyEmailFormData) => {
		mutate({
			email: data.email,
			purpose: EPurposeOTP.RESET_PASSWORD
		})
	}

	return (
		<div className='bg-card p-6'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-5'
			>
				{/* Email Input */}
				<InputText
					name='email'
					type='email'
					placeholder='Nhập địa chỉ email'
					register={register}
					error={errors.email}
					icon={MailIcon}
					animationDelay={0.4}
					disabled={isPending}
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

export default VerifyEmailDialog
