// context/auth-dialog-context.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import AuthLayoutDialog from '@/pages/(auth)/authLayoutDialog'
import LoginDialog from '@/pages/(auth)/loginDialog'
import RegisterDialog from '@/pages/(auth)/registerDialog'

interface DialogOptions {
	type: 'login' | 'register'
	title: string
	headColor: string
	subTitle: string
}

interface AuthDialogContextType {
	isOpen: boolean
	dialogOptions: DialogOptions
	openDialog: (options: Partial<DialogOptions>) => void
	closeDialog: () => void
	switchToLogin: () => void
	switchToRegister: () => void
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
	const [dialogOptions, setDialogOptions] =
		useState<DialogOptions>(defaultDialogOptions)

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

	const switchToRegister = () => {
		setDialogOptions({
			type: 'register',
			title: 'Tạo tài khoản mới',
			headColor: 'bg-background',
			subTitle: 'Điền thông tin để sử dụng dịch vụ của bạn'
		})
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
				onRegisterSuccess={closeDialog}
				onLogin={switchToLogin}
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
				switchToRegister
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
