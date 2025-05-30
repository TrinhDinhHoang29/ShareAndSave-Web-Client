import { BarChart, FileText, Home, Send } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const sidebarLinks = [
	{
		to: '/',
		label: 'Trang chủ',
		icon: <Home size={20} />
	},
	{
		to: '/bai-dang',
		label: 'Bài đăng',
		icon: <FileText size={20} />
	},
	{
		to: '/dang-bai',
		label: 'Đăng bài',
		icon: <Send size={20} />
	},
	{
		to: '/bang-xep-hang',
		label: 'Bảng xếp hạng',
		icon: <BarChart size={20} />
	}
]

const Sidebar: React.FC = () => {
	return (
		<aside className='bg-sidebar text-sidebar-foreground border-sidebar-border fixed top-0 left-0 z-30 flex h-screen w-64 flex-col border-r px-4 py-8'>
			<nav className='mt-20 flex flex-col gap-2'>
				{sidebarLinks.map(({ to, label, icon }) => (
					<NavLink
						key={to}
						to={to}
						className={({ isActive }) =>
							`flex items-center gap-3 rounded-lg px-4 py-3 transition-colors ${
								isActive
									? 'bg-sidebar-primary text-sidebar-primary-foreground font-semibold'
									: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground'
							}`
						}
					>
						{icon} {label}
					</NavLink>
				))}
			</nav>
		</aside>
	)
}

export default Sidebar
