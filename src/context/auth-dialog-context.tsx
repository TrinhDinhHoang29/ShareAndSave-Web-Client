// context/auth-dialog-context.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react'

import {
	useLoginMutation,
	useRegisterMutation
} from '@/hooks/mutations/use-auth.mutation'
import { EPurposeOTP } from '@/models/enums'
import { RegisterFormData } from '@/models/types'
import AuthLayoutDialog from '@/pages/(auth)/AuthLayoutDialog'
import LoginDialog from '@/pages/(auth)/loginDialog'
import OTPInputDialog from '@/pages/(auth)/OtpInputDialog'
import RegisterDialog from '@/pages/(auth)/registerDialog'
import ResetPasswordDialog from '@/pages/(auth)/ResetPassword'
import VerifyEmailDialog from '@/pages/(auth)/VerifyEmailDialog'

import { useAlertModalContext } from './alert-modal-context'

interface DialogOptions {
	type: 'login' | 'register' | 'otp' | 'verifyEmail' | 'resetPassword'
	title: string
	headColor: string
	subTitle: string
	defaultData?: RegisterFormData
	email?: string // For OTP dialog
	purpose?: EPurposeOTP
	verifyToken?: string
}

interface AuthDialogContextType {
	isOpen: boolean
	dialogOptions: DialogOptions
	openDialog: (options: Partial<DialogOptions>) => void
	closeDialog: () => void
	switchToLogin: () => void
	switchToRegister: (defaultData?: RegisterFormData) => void
	switchToOTP: (
		email: string,
		purpose: EPurposeOTP,
		title?: string,
		subTitle?: string
	) => void
	switchToResetPassword: (
		email: string,
		verifyToken: string,
		title?: string,
		subTitle?: string
	) => void
	openRegisterWithData: (data: RegisterFormData) => void
	isRegisterByPost: boolean
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(
	undefined
)

const defaultDialogOptions: DialogOptions = {
	type: 'login',
	title: 'Chào mừng trở lại!',
	headColor: 'bg-primary',
	subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
}

export const AuthDialogProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [dialogOptions, setDialogOptions] =
		useState<DialogOptions>(defaultDialogOptions)
	const { showLoading, showSuccess } = useAlertModalContext()
	const [userData, setUserData] = useState<RegisterFormData | null>(null)
	const [isRegisterByPost, setIsRegisterByPost] = useState<boolean>(false)

	const { mutate: login } = useLoginMutation({
		onMutate: () => {
			showLoading({
				loadingMessage: 'Đang tiến hành đăng nhập tự động...'
			})
		},
		onSuccess: () => {
			showSuccess({
				successTitle: 'Đăng nhập thành công',
				successMessage: 'Tài khoản của bạn đã được đăng nhập tự động',
				successButtonText: 'Đóng'
			})
			setIsRegisterByPost(true)
		}
	})

	const { mutate: register } = useRegisterMutation({
		onMutate: () => {
			closeDialog()
			showLoading({
				loadingMessage: 'Đang tiến hành đăng ký tài khoản...'
			})
		},
		onSuccess: () => {
			if (userData) {
				login({
					email: userData.email,
					password: userData.password,
					device: 'web'
				})
			}
		}
	})

	const openDialog = (options: Partial<DialogOptions> = {}) => {
		setDialogOptions(prev => ({ ...prev, ...options }))
		setIsOpen(true)
	}

	const closeDialog = () => {
		setIsOpen(false)
		setDialogOptions(defaultDialogOptions)
		setIsRegisterByPost(false)
	}

	const switchToLogin = () => {
		setDialogOptions({
			type: 'login',
			title: 'Chào mừng trở lại!',
			headColor: 'bg-primary',
			subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
		})
	}

	const switchToRegister = (defaultData?: RegisterFormData) => {
		setDialogOptions(prev => ({
			...prev,
			type: 'register',
			title: 'Tạo tài khoản mới',
			headColor: 'bg-primary',
			subTitle: 'Điền thông tin để sử dụng dịch vụ của bạn',
			defaultData
		}))
	}

	const switchToVerifyEmail = (title?: string, subTitle?: string) => {
		setDialogOptions({
			type: 'verifyEmail',
			title: title || 'Quên mật khẩu',
			headColor: 'bg-primary',
			subTitle: subTitle || 'Nhập email để thực hiện xác thực'
		})
	}

	const switchToOTP = (
		email: string,
		purpose: EPurposeOTP,
		title?: string,
		subTitle?: string
	) => {
		setDialogOptions({
			type: 'otp',
			title: title || 'Xác thực tài khoản',
			headColor: 'bg-primary',
			subTitle: subTitle || 'Nhập mã OTP để hoàn tất xác thực',
			email,
			purpose
		})
	}

	const switchToResetPassword = (
		email: string,
		verifyToken: string,
		title?: string,
		subTitle?: string
	) => {
		setDialogOptions({
			type: 'resetPassword',
			title: title || 'Đặt lại mật khẩu',
			headColor: 'bg-primary',
			subTitle: subTitle || 'Nhập mật khẩu mới để hoàn tất',
			email,
			verifyToken
		})
	}

	const openRegisterWithData = (data: RegisterFormData) => {
		setDialogOptions({
			type: 'register',
			title: 'Hoàn tất tạo tài khoản',
			headColor: 'bg-primary',
			subTitle: 'Thêm mật khẩu để hoàn tất việc tạo tài khoản',
			defaultData: data
		})
		setIsOpen(true)
	}

	// Handle OTP verification
	const handleOTPComplete = async (
		verifyToken: string,
		purpose: EPurposeOTP,
		email: string
	) => {
		console.log(purpose)
		if (userData && purpose === EPurposeOTP.ACTIVE_ACCOUNT) {
			const fullUserData = {
				...userData,
				verifyToken
			}
			register(fullUserData)
		} else if (purpose === EPurposeOTP.RESET_PASSWORD) {
			switchToResetPassword(email, verifyToken)
		}
	}

	const renderDialogComponent = {
		login: (
			<LoginDialog
				onLoginSucess={() => {
					closeDialog()
					window.location.href = '/'
				}}
				onRegister={switchToRegister}
				onVerifyEmail={switchToVerifyEmail}
			/>
		),
		register: (
			<RegisterDialog
				defaultData={dialogOptions.defaultData}
				onRegisterSuccess={(data: RegisterFormData) => {
					setUserData(data)
					switchToOTP(
						data.email,
						EPurposeOTP.ACTIVE_ACCOUNT,
						'Xác thực email',
						'Vui lòng nhập mã OTP đã được gửi đến email để hoàn tất đăng ký'
					)
				}}
				onLogin={switchToLogin}
			/>
		),
		otp: (
			<OTPInputDialog
				length={6}
				email={dialogOptions.email || ''}
				onComplete={handleOTPComplete}
				purpose={dialogOptions.purpose || EPurposeOTP.ACTIVE_ACCOUNT}
			/>
		),
		verifyEmail: (
			<VerifyEmailDialog
				onVerifyEmailSuccess={email => {
					switchToOTP(email, EPurposeOTP.RESET_PASSWORD)
				}}
			/>
		),
		resetPassword: (
			<ResetPasswordDialog
				email={dialogOptions.email || ''}
				verifyToken={dialogOptions.verifyToken || ''}
				onResetPasswordSuccess={() => {
					switchToLogin()
				}}
			/>
		)
	}

	return (
		<AuthDialogContext.Provider
			value={{
				isOpen,
				dialogOptions,
				openDialog,
				closeDialog,
				switchToLogin,
				switchToRegister,
				switchToOTP,
				switchToResetPassword,
				openRegisterWithData,
				isRegisterByPost
			}}
		>
			{children}
			<AuthLayoutDialog
				isOpen={isOpen}
				onClose={closeDialog}
				title={dialogOptions.title}
				subTitle={dialogOptions.subTitle}
				headerColor={dialogOptions.headColor}
				maxWidth={dialogOptions.type === 'otp' ? 'max-w-lg' : 'max-w-md'}
			>
				{renderDialogComponent[dialogOptions.type]}
			</AuthLayoutDialog>
		</AuthDialogContext.Provider>
	)
}

export const useAuthDialog = () => {
	const context = useContext(AuthDialogContext)
	if (!context) {
		throw new Error('useAuthDialog must be used within a AuthDialogProvider')
	}
	return context
}
