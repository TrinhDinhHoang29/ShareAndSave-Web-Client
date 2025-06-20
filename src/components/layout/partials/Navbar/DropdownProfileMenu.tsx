// components/DropdownProfileMenu.tsx
import { User } from 'lucide-react'
import React from 'react'

import Dropdown from '@/components/common/Dropdown'
import { useAuthDialog } from '@/context/auth-dialog-context'
import useAuthStore from '@/stores/authStore'

import ProfileMenu from './ProfileMenu'

interface DropdownProfileMenuProps {
	className?: string
}

const DropdownProfileMenu: React.FC<DropdownProfileMenuProps> = ({
	className
}) => {
	const { isAuthenticated, user, logout } = useAuthStore()
	const { openDialog } = useAuthDialog() // Sửa từ openAuthDialog thành openDialog
	const [isOpen, setIsOpen] = React.useState(false)

	const handleOpenDialog = () => {
		openDialog({}) // Mở dialog với tùy chọn mặc định (login)
	}

	return (
		<>
			<Dropdown
				isOpen={isOpen}
				onOpenChange={setIsOpen}
				trigger={
					<button
						className={
							className || 'hover:bg-muted rounded-full p-2 transition-colors'
						}
						title='Hồ sơ'
						onClick={isAuthenticated ? undefined : handleOpenDialog}
					>
						<User size={24} />
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
		</>
	)
}

export default DropdownProfileMenu
