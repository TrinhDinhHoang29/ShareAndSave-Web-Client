import {
	ChevronRight,
	ClipboardList,
	Key,
	LogOut,
	User,
	User2
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

interface ProfileMenuProps {
	onClickOutSide?: () => void
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onClickOutSide }) => {
	const navigate = useNavigate()

	interface MenuItem {
		label: string
		icon: React.ReactNode
		onClick: () => void
		divider?: boolean // Optional divider
	}

	const profileMenuItems: MenuItem[] = [
		{
			label: 'Chỉnh sửa thông tin',
			icon: <User2 className='h-4 w-4' />,
			onClick: () => navigate('ho-so/chinh-sua-thong-tin')
		},
		{
			label: 'Đổi mật khẩu',
			icon: <Key className='h-4 w-4' />,
			onClick: () => navigate('doi-mat-khau')
		},
		{
			label: 'Yêu cầu đã gửi',
			icon: <ClipboardList className='h-4 w-4' />,
			onClick: () => navigate('ho-so/yeu-cau-da-gui')
		},
		{
			label: 'Đăng xuất',
			icon: <LogOut className='h-4 w-4' />,
			onClick: () => navigate('login'),
			divider: true
		}
	]

	const handleClick = (item: MenuItem) => {
		item.onClick()
		if (onClickOutSide) {
			onClickOutSide()
		}
	}

	return (
		<div className='bg-card w-64 overflow-hidden rounded-lg border border-gray-100 shadow-lg'>
			{/* Profile Header */}
			<div className='bg-background border-b border-gray-100 px-4 py-4'>
				<div className='flex items-center gap-3'>
					<div className='relative'>
						<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
							<User className='text-secondary h-5 w-5' />
						</div>
						<div className='absolute -right-0.5 -bottom-0.5 h-4 w-4 rounded-full border-2 border-white bg-green-500'></div>
					</div>
					<div className='flex-1'>
						<h3 className='text-foreground/80 font-medium'>John Doe</h3>
						<p className='text-foreground/80/50 text-sm'>john@example.com</p>
					</div>
				</div>
			</div>

			{/* Menu Items */}
			<div className='py-1'>
				{profileMenuItems.map((item: MenuItem, index: number) => (
					<div key={index}>
						{item.divider && (
							<div className='border-background mx-3 my-1 border-t'></div>
						)}
						<button
							onClick={() => handleClick(item)}
							className='hover:bg-primary/50 group flex w-full items-center gap-3 px-4 py-3 text-left transition-colors'
						>
							{/* Icon */}
							<div className='text-foreground/60 group-hover:text-foreground'>
								{item.icon}
							</div>

							{/* Label */}
							<span className='text-foreground/60 group-hover:text-foreground flex-1 text-sm font-medium'>
								{item.label}
							</span>

							{/* Arrow */}
							<ChevronRight className='text-foreground/60 group-hover:text-foreground h-4 w-4' />
						</button>
					</div>
				))}
			</div>
		</div>
	)
}

export default ProfileMenu
