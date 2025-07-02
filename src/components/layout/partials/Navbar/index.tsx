import { motion } from 'framer-motion'
import {
	ChevronDown,
	ChevronUp,
	Download,
	ExternalLink,
	Moon,
	Plus,
	Search,
	Sun
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useChatNotification } from '@/context/chat-noti-context'
import { useTheme } from '@/context/theme-context'
import AlertPing from '@/pages/interest/components/AlertPing'

import DropdownNoti from './DropdownNoti'
import DropdownProfileMenu from './DropdownProfileMenu'
import SearchDropdown from './SearchDropdown'

const navLinks = [
	{ to: '/', label: 'Trang chủ' },
	{ to: '/bai-dang', label: 'Bài đăng' },
	{ to: '/kho-do-cu', label: 'Kho đồ cũ' },
	{ to: '/quan-tam', label: 'Quan tâm' },
	{ to: '/bang-xep-hang', label: 'Bảng xếp hạng' }
]

const Navbar = () => {
	const { theme, setTheme } = useTheme()
	const navigate = useNavigate()
	const location = useLocation()
	const [searchQuery, setSearchQuery] = useState('')
	const [isVisible, setIsVisible] = useState(true)
	const { followedByNotification, followingNotification } =
		useChatNotification()
	const [hasInterestNotifications, setHasInterestNotifications] =
		useState<boolean>(false)

	useEffect(() => {
		const handlePing = async () => {
			setHasInterestNotifications(true)
		}
		if (followedByNotification || followingNotification) handlePing()
	}, [followedByNotification, followingNotification])

	const handleSearch = (e: any) => {
		e.preventDefault()
		if (searchQuery.trim()) {
			navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery.trim())}`)
		}
	}

	const toggleNavbar = () => {
		setIsVisible(!isVisible)
	}

	return (
		<>
			{/* Collapsed state - Show toggle button */}
			{!isVisible && (
				<motion.button
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					onClick={toggleNavbar}
					className='bg-primary text-primary-foreground fixed top-0 right-5 z-50 flex h-8 w-16 items-center justify-center rounded-b-lg shadow-lg transition-all hover:h-10 hover:shadow-xl'
					title='Hiện navbar'
				>
					<ChevronDown className='h-5 w-5' />
				</motion.button>
			)}

			{/* School Title Bar */}
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -20 }}
					transition={{ duration: 0.3 }}
					className='from-primary to-primary/80 bg-gradient-to-r text-white'
				>
					<div className='container mx-auto px-4 py-2'>
						<div className='flex items-center justify-center'>
							<a
								href='https://caothang.edu.vn/'
								target='_blank'
								rel='noopener noreferrer'
								className='flex items-center gap-2 text-center transition-all hover:opacity-80'
							>
								<span className='text-sm font-medium md:text-base'>
									Trường Cao Đẳng Kĩ Thuật Cao Thắng
								</span>
								<ExternalLink className='h-3 w-3 md:h-4 md:w-4' />
							</a>
						</div>
					</div>
				</motion.div>
			)}

			{/* Main Navbar */}
			{isVisible && (
				<motion.nav
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{
						duration: 0.3,
						ease: [0.4, 0, 0.2, 1]
					}}
					className='bg-card/95 sticky top-0 z-40 shadow-md backdrop-blur-lg'
				>
					<div className='container mx-auto space-y-2 py-2'>
						<div className='flex h-16 items-center justify-between'>
							{/* Logo */}
							<Link
								to='/'
								className='from-primary to-accent flex items-center gap-3 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent transition-transform hover:scale-105'
							>
								<img
									src='https://caothang.edu.vn/tuyensinh/templates/images/logo.png'
									alt='logo_caothang'
									className='h-8 w-8 object-contain'
								/>
								Share&Save
							</Link>

							{/* Search Bar */}
							<div className='mx-8 hidden max-w-xl flex-1 md:flex'>
								<SearchDropdown />
							</div>

							{/* Right Actions */}
							<div className='flex items-center gap-2'>
								{/* Icon Buttons */}
								<div className='flex items-center gap-1'>
									<button
										onClick={() =>
											setTheme(theme === 'dark' ? 'light' : 'dark')
										}
										className='hover:bg-muted rounded-full p-2 transition-colors'
										title={
											theme === 'dark' ? 'Chuyển sang sáng' : 'Chuyển sang tối'
										}
									>
										{theme === 'dark' ? (
											<Sun className='h-5 w-5' />
										) : (
											<Moon className='h-5 w-5' />
										)}
									</button>

									<button
										onClick={() => navigate('/tai-xuong')}
										className='hover:bg-muted rounded-full p-2 transition-colors'
										title='Tải xuống'
									>
										<Download className='h-5 w-5' />
									</button>

									<DropdownNoti />

									<DropdownProfileMenu />
								</div>
							</div>
						</div>
						<div className='flex items-center justify-between'>
							<div className='no-scrollbar flex items-center gap-1 overflow-x-auto py-2'>
								{navLinks.map(({ to, label }) => {
									const isActive = location.pathname === to
									const isInterestPage = to === '/quan-tam'

									return (
										<div
											key={to}
											className='relative'
										>
											<Link
												onClick={() => setHasInterestNotifications(false)}
												to={to}
												className={`rounded-full px-4 py-2 whitespace-nowrap transition-all ${
													isActive
														? 'bg-blue-100 font-medium text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
														: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100'
												}`}
											>
												<span className='hidden sm:inline'>{label}</span>
											</Link>
											{/* Show AlertPing for "Quan tâm" when there are notifications */}
											{isInterestPage && hasInterestNotifications && (
												<AlertPing
													size='size-3'
													position='-top-1 right-0'
													isPulse={true}
												/>
											)}
										</div>
									)
								})}
							</div>
							<Link
								to={'/dang-bai'}
								className='from-primary to-accent text-primary-foreground hidden items-center gap-2 rounded-full bg-gradient-to-r px-4 py-2 font-medium transition-all hover:scale-105 hover:opacity-90 hover:shadow-lg sm:flex'
							>
								<Plus className='h-4 w-4' />
								Đăng bài
							</Link>
						</div>
						<button
							onClick={toggleNavbar}
							className='hover:bg-muted/80 absolute right-5 bottom-0 ml-2 flex h-6 w-8 items-center justify-center rounded-t-md border border-b-0 border-gray-300 bg-gray-100 transition-all hover:h-7 dark:border-gray-600 dark:bg-gray-700'
							title='Ẩn navbar'
						>
							<ChevronUp className='h-4 w-4' />
						</button>
					</div>
				</motion.nav>
			)}

			{/* Mobile Search */}
			{isVisible && (
				<motion.div
					initial={{ opacity: 0, height: 0 }}
					animate={{ opacity: 1, height: 'auto' }}
					exit={{ opacity: 0, height: 0 }}
					transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
					className='sticky top-32 z-30 border-b border-gray-200 bg-white px-4 py-2 md:hidden dark:border-gray-700 dark:bg-gray-900'
				>
					<form
						onSubmit={handleSearch}
						className='relative'
					>
						<Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
						<input
							type='text'
							value={searchQuery}
							onChange={e => setSearchQuery(e.target.value)}
							placeholder='Tìm kiếm...'
							className='w-full rounded-full border border-gray-200 bg-gray-50 py-2 pr-4 pl-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800'
						/>
					</form>
				</motion.div>
			)}
			{/* Navbar Toggle Button - Curtain style */}
		</>
	)
}

export default Navbar
