import { AnimatePresence, motion } from 'framer-motion'
import {
	Calendar,
	CheckCircle,
	ChevronDown,
	Eye,
	FileText,
	Hash,
	MessageCircle,
	Send,
	User,
	X
} from 'lucide-react'
import React, { useState } from 'react'

// Types
interface Interest {
	id: number
	name: string
	date: string
	status: 'active' | 'completed'
}

interface Post {
	id: number
	title: string
	interests: Interest[]
}

// Sample data
const samplePosts: Post[] = [
	{
		id: 1,
		title: 'Tìm kiếm đồng nghiệp Frontend Developer',
		interests: [
			{ id: 1, name: 'Nguyễn Văn An', date: '2024-06-01', status: 'active' },
			{ id: 2, name: 'Trần Thị Bình', date: '2024-06-02', status: 'completed' },
			{ id: 3, name: 'Lê Minh Cường', date: '2024-06-03', status: 'active' }
		]
	},
	{
		id: 2,
		title: 'Khóa học React.js miễn phí',
		interests: [
			{ id: 4, name: 'Phạm Thị Dung', date: '2024-06-01', status: 'active' },
			{ id: 5, name: 'Hoàng Văn Em', date: '2024-06-02', status: 'completed' },
			{ id: 6, name: 'Nguyễn Thị Hoa', date: '2024-06-03', status: 'completed' }
		]
	},
	{
		id: 3,
		title: 'Startup cần co-founder technical',
		interests: []
	}
]

// PostList Component
export const PostList = ({ posts = samplePosts }: { posts?: Post[] }) => {
	const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

	const getFilteredPosts = () => {
		return posts.map(post => ({
			...post,
			interests: post.interests.filter(
				interest => interest.status === activeTab
			)
		}))
	}

	const getTotalCount = (status: 'active' | 'completed') => {
		return posts.reduce((total, post) => {
			return (
				total +
				post.interests.filter(interest => interest.status === status).length
			)
		}, 0)
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6'>
			<div className='mx-auto max-w-4xl'>
				<div className='mb-8'>
					<h1 className='mb-2 text-3xl font-bold text-slate-800'>
						Danh sách bài đăng
					</h1>
					<p className='text-slate-600'>
						Quản lý và theo dõi các quan tâm từ người dùng
					</p>
				</div>

				{/* Tabs */}
				<div className='mb-6'>
					<div className='flex space-x-1 rounded-xl border border-slate-200 bg-white/60 p-1 backdrop-blur-sm'>
						<button
							onClick={() => setActiveTab('active')}
							className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
								activeTab === 'active'
									? 'bg-blue-500 text-white shadow-md'
									: 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
							}`}
						>
							<Eye className='h-4 w-4' />
							<span>Đang Quan Tâm</span>
							<span
								className={`rounded-full px-2 py-1 text-xs font-semibold ${
									activeTab === 'active'
										? 'bg-white/20 text-white'
										: 'bg-blue-100 text-blue-600'
								}`}
							>
								{getTotalCount('active')}
							</span>
						</button>

						<button
							onClick={() => setActiveTab('completed')}
							className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
								activeTab === 'completed'
									? 'bg-green-500 text-white shadow-md'
									: 'text-slate-600 hover:bg-white/50 hover:text-slate-800'
							}`}
						>
							<CheckCircle className='h-4 w-4' />
							<span>Đã Quan Tâm</span>
							<span
								className={`rounded-full px-2 py-1 text-xs font-semibold ${
									activeTab === 'completed'
										? 'bg-white/20 text-white'
										: 'bg-green-100 text-green-600'
								}`}
							>
								{getTotalCount('completed')}
							</span>
						</button>
					</div>
				</div>

				<div className='space-y-6'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={activeTab}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
						>
							{getFilteredPosts().some(post => post.interests.length > 0) ? (
								getFilteredPosts().map(
									post =>
										post.interests.length > 0 && (
											<PostItem
												key={`${post.id}-${activeTab}`}
												post={post}
												activeTab={activeTab}
											/>
										)
								)
							) : (
								<div className='rounded-2xl border-2 border-dashed border-slate-300 bg-white/50 p-12 text-center backdrop-blur-sm'>
									<div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100'>
										{activeTab === 'active' ? (
											<Eye className='h-8 w-8 text-slate-400' />
										) : (
											<CheckCircle className='h-8 w-8 text-slate-400' />
										)}
									</div>
									<p className='text-lg text-slate-500'>
										{activeTab === 'active'
											? 'Không có quan tâm đang hoạt động'
											: 'Không có quan tâm đã hoàn thành'}
									</p>
								</div>
							)}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	)
}

// PostItem Component
export const PostItem = ({
	post,
	activeTab
}: {
	post: Post
	activeTab: 'active' | 'completed'
}) => {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div className='overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-200 hover:shadow-xl'>
			<div
				className='flex cursor-pointer items-center justify-between bg-gradient-to-r from-white to-slate-50 p-6 transition-colors duration-200 hover:from-slate-50 hover:to-slate-100'
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className='flex items-center space-x-4'>
					<div
						className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${
							activeTab === 'active'
								? 'bg-gradient-to-br from-blue-500 to-indigo-600'
								: 'bg-gradient-to-br from-green-500 to-emerald-600'
						}`}
					>
						<Hash className='h-6 w-6 text-white' />
					</div>
					<div>
						<h3 className='text-xl font-semibold text-slate-800'>
							{post.title}
						</h3>
						<p className='mt-1 text-sm text-slate-500'>Bài đăng #{post.id}</p>
					</div>
				</div>

				<div className='flex items-center space-x-3'>
					<div
						className={`flex items-center space-x-2 rounded-full px-4 py-2 font-medium ${
							activeTab === 'active'
								? 'bg-blue-100 text-blue-700'
								: 'bg-green-100 text-green-700'
						}`}
					>
						<User className='h-4 w-4' />
						<span>{post.interests.length}</span>
					</div>

					<div
						className={`transform rounded-full bg-slate-100 p-2 transition-colors duration-200 hover:bg-slate-200 ${
							isExpanded ? 'rotate-180' : ''
						} transition-transform duration-200`}
					>
						<ChevronDown className='h-5 w-5 text-slate-600' />
					</div>
				</div>
			</div>

			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className='border-t border-slate-200 bg-slate-50/50'
					>
						<div className='p-6'>
							{post.interests.length > 0 ? (
								<div className='space-y-4'>
									<h4 className='mb-4 text-lg font-semibold text-slate-700'>
										{activeTab === 'active' ? 'Đang quan tâm' : 'Đã quan tâm'}
									</h4>
									{post.interests.map(interest => (
										<InterestItem
											key={interest.id}
											interest={interest}
											postTitle={post.title}
											activeTab={activeTab}
										/>
									))}
								</div>
							) : (
								<div className='py-8 text-center'>
									<div className='mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200'>
										<User className='h-6 w-6 text-slate-400' />
									</div>
									<p className='text-slate-500'>Chưa có ai quan tâm</p>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

// InterestItem Component
export const InterestItem = ({
	interest,
	postTitle,
	activeTab
}: {
	interest: Interest
	postTitle: string
	activeTab: 'active' | 'completed'
}) => {
	const [showChat, setShowChat] = useState(false)

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const getAvatarColor = (name: string) => {
		const colors = [
			'from-rose-400 to-pink-500',
			'from-blue-400 to-blue-500',
			'from-green-400 to-green-500',
			'from-purple-400 to-purple-500',
			'from-yellow-400 to-orange-500',
			'from-indigo-400 to-indigo-500'
		]
		const index = name.length % colors.length
		return colors[index]
	}

	return (
		<div className='relative'>
			<div className='flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
				<div className='flex items-center space-x-4'>
					<div
						className={`h-12 w-12 rounded-full bg-gradient-to-br ${getAvatarColor(interest.name)} flex items-center justify-center shadow-lg`}
					>
						<span className='text-sm font-semibold text-white'>
							{getInitials(interest.name)}
						</span>
					</div>
					<div>
						<p className='font-semibold text-slate-800'>{interest.name}</p>
						<div className='mt-1 flex items-center space-x-2 text-sm text-slate-500'>
							<Calendar className='h-4 w-4' />
							<span>{new Date(interest.date).toLocaleDateString('vi-VN')}</span>
							{activeTab === 'completed' && (
								<div className='ml-2 flex items-center space-x-1'>
									<CheckCircle className='h-4 w-4 text-green-500' />
									<span className='font-medium text-green-600'>Hoàn thành</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='flex space-x-2'>
					<button
						className='rounded-xl border border-slate-300 p-3 transition-all duration-200 hover:border-slate-400 hover:bg-slate-50'
						aria-label='Xem bài đăng'
					>
						<FileText className='h-5 w-5 text-slate-600' />
					</button>

					<button
						className={`rounded-xl p-3 text-white shadow-lg transition-all duration-200 hover:shadow-xl ${
							activeTab === 'active'
								? 'bg-blue-500 hover:bg-blue-600'
								: 'bg-green-500 hover:bg-green-600'
						}`}
						onClick={() => setShowChat(!showChat)}
						aria-label='Chat'
					>
						<MessageCircle className='h-5 w-5' />
					</button>
				</div>
			</div>

			<AnimatePresence>
				{showChat && (
					<ChatArea
						userName={interest.name}
						postTitle={postTitle}
						onClose={() => setShowChat(false)}
						activeTab={activeTab}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}

// ChatArea Component
export const ChatArea = ({
	userName,
	postTitle,
	onClose,
	activeTab
}: {
	userName: string
	postTitle: string
	onClose: () => void
	activeTab: 'active' | 'completed'
}) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([
		{
			id: 1,
			sender: 'other',
			text: 'Xin chào, tôi quan tâm đến bài đăng của bạn.',
			time: '10:30'
		},
		{
			id: 2,
			sender: 'user',
			text: 'Chào bạn! Cảm ơn bạn đã quan tâm. Bạn cần thêm thông tin gì không?',
			time: '10:32'
		}
	])

	const handleSend = () => {
		if (message.trim()) {
			setMessages([
				...messages,
				{
					id: messages.length + 1,
					sender: 'user',
					text: message,
					time: new Date().toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			])
			setMessage('')
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const headerColor =
		activeTab === 'active'
			? 'from-blue-500 to-indigo-600'
			: 'from-green-500 to-emerald-600'

	const buttonColor =
		activeTab === 'active'
			? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500'
			: 'bg-green-500 hover:bg-green-600 focus:ring-green-500'

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.9, y: 20 }}
				animate={{ scale: 1, y: 0 }}
				exit={{ scale: 0.9, y: 20 }}
				transition={{ duration: 0.2 }}
				className='w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className={`bg-gradient-to-r p-6 ${headerColor} text-white`}>
					<div className='flex items-start justify-between'>
						<div className='flex items-center space-x-3'>
							<div className='flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm'>
								<User className='h-6 w-6' />
							</div>
							<div>
								<h3 className='text-lg font-semibold'>{userName}</h3>
								<p className='text-sm text-blue-100 opacity-90'>{postTitle}</p>
							</div>
						</div>
						<button
							onClick={onClose}
							className='rounded-full p-2 transition-colors duration-200 hover:bg-white/20'
							aria-label='Đóng'
						>
							<X className='h-6 w-6' />
						</button>
					</div>
				</div>

				{/* Messages */}
				<div className='max-h-[400px] min-h-[350px] flex-1 overflow-y-auto bg-slate-50 p-6'>
					{messages.map(msg => (
						<div
							key={msg.id}
							className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
									msg.sender === 'user'
										? `${activeTab === 'active' ? 'bg-blue-500' : 'bg-green-500'} rounded-br-md text-white`
										: 'rounded-bl-md border border-slate-200 bg-white text-slate-800'
								}`}
							>
								<p className='text-sm leading-relaxed'>{msg.text}</p>
								<p
									className={`mt-2 text-xs ${
										msg.sender === 'user'
											? activeTab === 'active'
												? 'text-blue-100'
												: 'text-green-100'
											: 'text-slate-500'
									}`}
								>
									{msg.time}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Input */}
				<div className='border-t border-slate-200 bg-white p-4'>
					<div className='flex space-x-3'>
						<input
							type='text'
							value={message}
							onChange={e => setMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							className='flex-1 rounded-xl border border-slate-300 px-4 py-3 transition-all duration-200 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none'
							placeholder='Nhập tin nhắn...'
						/>
						<button
							onClick={handleSend}
							disabled={!message.trim()}
							className={`${buttonColor} rounded-xl px-6 py-3 text-white shadow-lg transition-all duration-200 hover:shadow-xl disabled:bg-slate-300 disabled:shadow-none`}
						>
							<Send className='h-5 w-5' />
						</button>
					</div>
				</div>
			</motion.div>
		</motion.div>
	)
}

export default PostList
