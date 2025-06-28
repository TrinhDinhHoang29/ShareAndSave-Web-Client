import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, CheckCircle, LogOut } from 'lucide-react'
import React, { useState } from 'react'

import { EPurposeOTP } from '@/models/enums'
import ChangePassword from '@/pages/(auth)/ChangePassword'
import OTPInputDialog from '@/pages/(auth)/OtpInputDialog'
import useAuthStore from '@/stores/authStore'

enum ChangePasswordStep {
	OTP_VERIFICATION = 'otp_verification',
	CHANGE_PASSWORD = 'change_password',
	SUCCESS = 'success'
}

interface ChangePasswordPageProps {
	onBack?: () => void
	onComplete?: () => void
}

const ChangePasswordPage: React.FC<ChangePasswordPageProps> = ({
	onBack,
	onComplete
}) => {
	const [currentStep, setCurrentStep] = useState<ChangePasswordStep>(
		ChangePasswordStep.OTP_VERIFICATION
	)
	const [verifyToken, setVerifyToken] = useState<string>('')
	const { user, logout } = useAuthStore()

	const handleOTPComplete = (token: string) => {
		setVerifyToken(token)
		setCurrentStep(ChangePasswordStep.CHANGE_PASSWORD)
	}

	const handlePasswordChangeSuccess = () => {
		setCurrentStep(ChangePasswordStep.SUCCESS)

		// Tự động đăng xuất sau 3 giây
		setTimeout(() => {
			logout()
			onComplete?.()
		}, 3000)
	}

	const handleBackToOTP = () => {
		setCurrentStep(ChangePasswordStep.OTP_VERIFICATION)
		setVerifyToken('')
	}

	const renderStepIndicator = () => {
		const steps = [
			{ key: ChangePasswordStep.OTP_VERIFICATION, label: 'Xác thực OTP' },
			{ key: ChangePasswordStep.CHANGE_PASSWORD, label: 'Đổi mật khẩu' },
			{ key: ChangePasswordStep.SUCCESS, label: 'Hoàn thành' }
		]

		return (
			<div className='mb-8 flex items-center justify-center'>
				{steps.map((step, index) => (
					<React.Fragment key={step.key}>
						<div className='flex flex-col items-center'>
							<div
								className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
									currentStep === step.key
										? 'bg-primary text-primary-foreground shadow-lg'
										: steps.findIndex(s => s.key === currentStep) > index
											? 'bg-green-500 text-white'
											: 'bg-muted text-muted-foreground'
								}`}
							>
								{steps.findIndex(s => s.key === currentStep) > index ? (
									<CheckCircle className='h-5 w-5' />
								) : (
									index + 1
								)}
							</div>
							<span
								className={`mt-2 text-xs font-medium ${
									currentStep === step.key
										? 'text-primary'
										: 'text-muted-foreground'
								}`}
							>
								{step.label}
							</span>
						</div>
						{index < steps.length - 1 && (
							<div
								className={`mx-4 h-0.5 w-16 transition-all duration-300 ${
									steps.findIndex(s => s.key === currentStep) > index
										? 'bg-green-500'
										: 'bg-muted'
								}`}
							/>
						)}
					</React.Fragment>
				))}
			</div>
		)
	}

	return (
		<div className='bg-background flex min-h-screen items-center justify-center p-4'>
			<div className='w-full max-w-2xl'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='bg-card border-border overflow-hidden rounded-lg border shadow-lg'
				>
					{/* Header */}
					<div className='bg-primary/5 border-border border-b p-6'>
						<div className='mb-4 flex items-center justify-between'>
							<h1 className='text-foreground text-2xl font-bold'>
								Đổi mật khẩu
							</h1>
							{onBack &&
								currentStep === ChangePasswordStep.OTP_VERIFICATION && (
									<button
										onClick={onBack}
										className='hover:bg-muted rounded-lg p-2 transition-colors'
									>
										<ArrowLeft className='h-5 w-5' />
									</button>
								)}
							{currentStep === ChangePasswordStep.CHANGE_PASSWORD && (
								<button
									onClick={handleBackToOTP}
									className='hover:bg-muted rounded-lg p-2 transition-colors'
								>
									<ArrowLeft className='h-5 w-5' />
								</button>
							)}
						</div>
						{renderStepIndicator()}
					</div>

					{/* Content */}
					<AnimatePresence mode='wait'>
						{currentStep === ChangePasswordStep.OTP_VERIFICATION && (
							<motion.div
								key='otp'
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
							>
								<OTPInputDialog
									email={user?.email || ''}
									onComplete={handleOTPComplete}
									purpose={EPurposeOTP.RESET_PASSWORD}
									length={6}
									sendOTPDirectly={true}
								/>
							</motion.div>
						)}

						{currentStep === ChangePasswordStep.CHANGE_PASSWORD && (
							<motion.div
								key='change-password'
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
							>
								<div className='p-6'>
									<div className='mb-6 text-center'>
										<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100'>
											<CheckCircle className='h-8 w-8 text-green-600' />
										</div>
										<h3 className='text-foreground mb-2 text-lg font-semibold'>
											OTP xác thực thành công!
										</h3>
										<p className='text-muted-foreground text-sm'>
											Bây giờ bạn có thể đổi mật khẩu mới
										</p>
									</div>

									<ChangePassword
										onResetPasswordSuccess={handlePasswordChangeSuccess}
										verifyToken={verifyToken}
										email={user?.email || ''}
									/>
								</div>
							</motion.div>
						)}

						{currentStep === ChangePasswordStep.SUCCESS && (
							<motion.div
								key='success'
								initial={{ opacity: 0, scale: 0.9 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.3 }}
								className='p-8 text-center'
							>
								<div className='mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100'>
									<CheckCircle className='h-10 w-10 text-green-600' />
								</div>

								<h3 className='text-foreground mb-3 text-2xl font-bold'>
									Đổi mật khẩu thành công!
								</h3>

								<p className='text-muted-foreground mb-6'>
									Mật khẩu của bạn đã được cập nhật thành công. Bạn sẽ được đăng
									xuất để đăng nhập lại với mật khẩu mới.
								</p>

								<div className='text-primary flex items-center justify-center gap-2'>
									<LogOut className='h-5 w-5' />
									<span className='font-medium'>Đang đăng xuất...</span>
								</div>

								<div className='mt-4'>
									<div className='border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent'></div>
								</div>

								<p className='text-muted-foreground mt-4 text-xs'>
									Bạn sẽ được chuyển hướng trong 3 giây
								</p>
							</motion.div>
						)}
					</AnimatePresence>
				</motion.div>

				{/* Footer Info */}
				{currentStep === ChangePasswordStep.OTP_VERIFICATION && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className='mt-6 text-center'
					>
						<p className='text-muted-foreground text-sm'>
							Để bảo mật tài khoản, chúng tôi cần xác thực danh tính của bạn
						</p>
					</motion.div>
				)}
			</div>
		</div>
	)
}

export default ChangePasswordPage
