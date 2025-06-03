import { UserCircle } from 'lucide-react'
import React, { useState } from 'react'

import Dropdown from '@/components/common/Dropdown'
import AuthLayoutDialog from '@/pages/(auth)/authLayoutDialog'
import LoginDialog from '@/pages/(auth)/loginDialog'
import RegisterDialog from '@/pages/(auth)/registerDialog'
import useAuthStore from '@/stores/authStore'

import ProfileMenu from './ProfileMenu'

interface DropdownProfileMenuProps {
	className?: string
}

const DropdownProfileMenu: React.FC<DropdownProfileMenuProps> = () => {
	const [isOpen, setIsOpen] = useState(false)
	const { isAuthenticated, user, logout } = useAuthStore()
	const [isOpenDialog, setIsOpenDialog] = useState(false)
	const [dialogOptions, setDialogOptions] = useState<
		| {
				type: 'login'
				title: 'Chào mừng trở lại!'
				headColor: 'bg-background'
				subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
		  }
		| {
				type: 'register'
				title: 'Tạo tài khoản mới'
				headColor: 'bg-background'
				subTitle: 'Điền thông tin để sử dụng dịch vụ của bạn'
		  }
	>({
		type: 'login',
		title: 'Chào mừng trở lại!',
		headColor: 'bg-background',
		subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
	})
	const setCloseLoginDialog = () => {
		setIsOpenDialog(false)
		setDialogOptions({
			type: 'login',
			title: 'Chào mừng trở lại!',
			headColor: 'bg-background',
			subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
		})
	}

	const renderDialogOptionsComponent = {
		login: (
			<LoginDialog
				onLoginSucess={setCloseLoginDialog}
				onRegister={() =>
					setDialogOptions({
						type: 'register',
						title: 'Tạo tài khoản mới',

						headColor: 'bg-background',
						subTitle: 'Điền thông tin để sử dụng dịch vụ của bạn'
					})
				}
			/>
		),
		register: (
			<RegisterDialog
				onRegisterSuccess={() => {}}
				onLogin={() =>
					setDialogOptions({
						type: 'login',
						title: 'Chào mừng trở lại!',
						headColor: 'bg-background',
						subTitle: 'Đăng nhập để tiếp tục sử dụng dịch vụ'
					})
				}
			/>
		)
		// forgotPassword: <ForgotPassword onGetOTPSuccess={handleGetOTPSuccess} />,
		// validateOTP: <ValidateOTP email={emailOTP} onValidateOTPSuccess={handleValidateOTPSuccess} />,
		// newPassword: <NewPassword onCreateNewPasswordSuccess={() => setPopupOptions('login')} jwt={jwtNewPassword} />
	}

	return (
		<>
			<Dropdown
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				trigger={
					<button
						className='border-muted-foreground text-secondary rounded-md border-2 border-solid p-2 shadow-md transition-colors hover:opacity-90'
						title='Hồ sơ'
						onClick={isAuthenticated ? undefined : () => setIsOpenDialog(true)}
					>
						<UserCircle size={24} />
					</button>
				}
			>
				{isAuthenticated ? (
					<ProfileMenu
						logout={logout}
						user={user}
						onClickOutSide={() => setIsOpen(!isOpen)}
					/>
				) : null}
			</Dropdown>
			<AuthLayoutDialog
				isOpen={isOpenDialog}
				onClose={setCloseLoginDialog}
				title={dialogOptions.title}
				subtitle={dialogOptions.subTitle}
				headerColor={dialogOptions.headColor}
			>
				{renderDialogOptionsComponent[dialogOptions.type]}
			</AuthLayoutDialog>
		</>
	)
}

export default DropdownProfileMenu
