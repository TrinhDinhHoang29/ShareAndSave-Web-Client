import {
	Calendar,
	ChevronRight,
	ClipboardList,
	Key,
	LogOut,
	User,
	User2
} from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'

import { IUser } from '@/models/interfaces'

interface ProfileMenuProps {
	onClickOutSide?: () => void
	user: IUser | null
	logout: () => void
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({
	onClickOutSide,
	user,
	logout
}) => {
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
			onClick: () => navigate('ho-so/doi-mat-khau')
		},
		{
			label: 'Bài đăng của tôi',
			icon: <ClipboardList className='h-4 w-4' />,
			onClick: () => navigate('ho-so/bai-dang-cua-toi')
		},
		{
			label: 'Lịch hẹn',
			icon: <Calendar className='h-4 w-4' />,
			onClick: () => navigate('ho-so/lich-hen')
		},
		{
			label: 'Đăng xuất',
			icon: <LogOut className='h-4 w-4' />,
			onClick: () => {
				logout()
				navigate('/')
			},
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
		<div className='w-64 overflow-hidden'>
			{/* Profile Header */}
			<div className='bg-background border-accent-foreground/50 rounded-t-md border-b px-4 py-4'>
				<div className='flex items-center gap-3'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
						{user?.avatar ? (
							<img
								src={user.avatar}
								alt={`${user?.fullName} avatar`}
								className='h-full w-full rounded-full object-cover'
							/>
						) : (
							<User className='text-secondary h-5 w-5' /> // Placeholder nếu không có avatar
						)}
					</div>
					<div className='flex-1'>
						<h3 className='text-foreground/80 max-w-[170px] truncate overflow-hidden font-medium whitespace-nowrap'>
							{user?.fullName}
						</h3>
						<p className='text-foreground/50 max-w-[170px] truncate overflow-hidden text-xs whitespace-nowrap'>
							{user?.email}
						</p>
					</div>
				</div>
			</div>

			{/* Menu Items */}
			<div className='bg-background rounded-b-md pb-2'>
				{profileMenuItems.map((item: MenuItem, index: number) => (
					<div key={index}>
						{item.divider && (
							<div className='border-accent-foreground/50 mb-2 border-t'></div>
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
