// context/auth-dialog-context.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react'

import { useLoginMutation } from '@/hooks/mutations/use-auth.mutation'
import { RegisterFormData } from '@/models/types'
import AuthLayoutDialog from '@/pages/(auth)/authLayoutDialog'
import LoginDialog from '@/pages/(auth)/loginDialog'
import RegisterDialog from '@/pages/(auth)/registerDialog'

import { useAlertModalContext } from './alert-modal-context'

interface DialogOptions {
	type: 'login' | 'register'
	title: string
	headColor: string
	subTitle: string
	defaultData?: RegisterFormData
}

interface AuthDialogContextType {
	isOpen: boolean
	dialogOptions: DialogOptions
	openDialog: (options: Partial<DialogOptions>) => void
	closeDialog: () => void
	switchToLogin: () => void
	switchToRegister: (defaultData?: RegisterFormData) => void
	openRegisterWithData: (data: RegisterFormData) => void
	isRegisterByPost: boolean
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(
	undefined
)

const defaultDialogOptions: DialogOptions = {
	type: 'login',
	title: 'Chào mừng trở lại!',
	headColor: 'bg-background',
	subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
}

export const AuthDialogProvider: React.FC<{ children: ReactNode }> = ({
	children
}) => {
	const [isOpen, setIsOpen] = useState(false)
	const [isRegisterByPost, setIsRegisterByPost] = useState(false)
	const [dialogOptions, setDialogOptions] =
		useState<DialogOptions>(defaultDialogOptions)
	const { showLoading, showSuccess } = useAlertModalContext()
	const { mutate } = useLoginMutation({
		onMutate: () => {
			closeDialog()
			showLoading({
				loadingMessage: 'Đang tiến hành đăng nhập...',
				showCancel: true,
				onCancel: () => {
					close()
				}
			})
		},
		onSuccess: () => {
			setIsRegisterByPost(true)
			showSuccess({
				successTitle: 'Tạo tài khoản thành công',
				successMessage:
					'Hệ thống đã thực hiện đăng nhập tự động. Bây giờ bạn có thể tiến hành đăng bài',
				successButtonText: 'Đóng'
			})
		}
	})

	const openDialog = (options: Partial<DialogOptions> = {}) => {
		setDialogOptions(prev => ({ ...prev, ...options }))
		setIsOpen(true)
	}

	const closeDialog = () => {
		setIsOpen(false)
		setDialogOptions(defaultDialogOptions)
	}

	const switchToLogin = () => {
		setDialogOptions({
			type: 'login',
			title: 'Chào mừng trở lại!',
			headColor: 'bg-background',
			subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
		})
	}

	const switchToRegister = (defaultData?: RegisterFormData) => {
		setDialogOptions(prev => ({
			...prev,
			type: 'register',
			title: 'Tạo tài khoản mới',
			headColor: 'bg-background',
			subTitle: 'Điền thông tin để sử dụng dịch vụ của bạn',
			defaultData
		}))
	}

	const openRegisterWithData = (data: RegisterFormData) => {
		setDialogOptions({
			type: 'register',
			title: 'Hoàn tất tạo tài khoản',
			headColor: 'bg-background',
			subTitle: 'Thêm mật khẩu để hoàn tất việc tạo tài khoản',
			defaultData: data
		})
		setIsOpen(true)
	}

	const renderDialogComponent = {
		login: (
			<LoginDialog
				onLoginSucess={() => {
					closeDialog()
					window.location.href = '/'
				}}
				onRegister={switchToRegister}
			/>
		),
		register: (
			<RegisterDialog
				defaultData={dialogOptions.defaultData}
				onRegisterSuccess={(
					isRegisterByPost: boolean,
					data: RegisterFormData
				) => {
					if (isRegisterByPost) {
						mutate({
							email: data.email,
							password: data.password,
							device: 'web'
						})
					}
				}}
				onLogin={switchToLogin}
			/>
		)
	}

	return (
		<AuthDialogContext.Provider
			value={{
				isRegisterByPost,
				isOpen,
				dialogOptions,
				openDialog,
				closeDialog,
				switchToLogin,
				switchToRegister,
				openRegisterWithData
			}}
		>
			{children}
			<AuthLayoutDialog
				isOpen={isOpen}
				onClose={closeDialog}
				title={dialogOptions.title}
				subTitle={dialogOptions.subTitle}
				headerColor={dialogOptions.headColor}
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
