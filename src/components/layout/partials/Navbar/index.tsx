import { Bell, Download, Menu, Moon, Sun, UserCircle } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import Dropdown from '@/components/common/Dropdown'
import { useTheme } from '@/context/theme-context'

import DropdownProfileMenu from './DropdownProfileMenu'
import ProfileMenu from './ProfileMenu'

const Navbar: React.FC = () => {
	const { theme, setTheme } = useTheme()

	return (
		<nav className='bg-background text-foreground sticky top-0 z-40 flex h-20 items-center justify-between px-16 shadow-md transition-colors'>
			{/* Left: Logo + App name */}
			<div className='flex min-w-[220px] items-center gap-4'>
				<Link
					to='/'
					className='text-primary flex items-center gap-2 text-xl font-bold'
				>
					<Menu
						size={28}
						className='md:hidden'
					/>{' '}
					{/* Hamburger for mobile, optional */}
					<span>Share&Save</span>
				</Link>
			</div>

			{/* Center: Search Bar + Quick Actions */}
			<div className='flex flex-1 items-center justify-center gap-4'>
				<input
					type='text'
					placeholder='Tìm kiếm bài đăng, người dùng...'
					className='border-input bg-card text-foreground focus:ring-primary w-160 rounded-full border px-4 py-2 text-base shadow-md transition-colors focus:ring-2 focus:outline-none'
				/>
				{/* Quick action: Gửi đồ cũ */}
			</div>

			{/* Right: Icons */}
			<div className='flex min-w-[180px] items-center justify-end gap-4'>
				{/* Toggle Dark/Light */}
				<button
					className='border-muted-foreground text-secondary rounded-md border-2 border-solid p-2 shadow-md transition-colors hover:opacity-90'
					title={theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'}
					onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
				>
					{theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
				</button>
				<button
					className='border-muted-foreground text-secondary rounded-md border-2 border-solid p-2 shadow-md transition-colors hover:opacity-90'
					title='Tải xuống'
				>
					<Download size={22} />
				</button>
				<button
					className='border-muted-foreground text-secondary rounded-md border-2 border-solid p-2 shadow-md transition-colors hover:opacity-90'
					title='Thông báo'
				>
					<Bell size={22} />
				</button>
				<DropdownProfileMenu />
			</div>
		</nav>
	)
}

export default Navbar
