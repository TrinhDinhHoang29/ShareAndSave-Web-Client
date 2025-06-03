import { isWithinInterval, parse } from 'date-fns'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Eye } from 'lucide-react'
import { useState } from 'react'

import { PostInterest } from '@/models/interfaces'

import { PostItem } from './components/PostItem'
import SearchFilter from './components/SearchFilter'

// Sample data
const samplePosts: PostInterest[] = [
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

interface SortOrder {
	type: 'newest' | 'oldest'
}

const Interest = ({ posts = samplePosts }: { posts?: PostInterest[] }) => {
	const [activeTab, setActiveTab] = useState<'active' | 'completed'>(
		'completed'
	)
	const [filteredPosts, setFilteredPosts] = useState(posts)

	const handleSearch = (
		searchBy: 'post' | 'person',
		searchValue: string,
		sortOrder: SortOrder,
		tab: 'active' | 'completed'
	) => {
		let result = posts

		// Filter by tab status
		result = result.map(post => ({
			...post,
			interests: post.interests.filter(interest => interest.status === tab)
		}))

		// Search by post title or person name
		if (searchValue) {
			const value = searchValue.toLowerCase()
			if (searchBy === 'post') {
				result = result.filter(post => post.title.toLowerCase().includes(value))
			} else {
				result = result
					.map(post => ({
						...post,
						interests: post.interests.filter(interest =>
							interest.name.toLowerCase().includes(value)
						)
					}))
					.filter(post => post.interests.length > 0)
			}
		}

		// Sort by date
		result = result.map(post => ({
			...post,
			interests: [...post.interests].sort((a, b) => {
				const dateA = new Date(a.date)
				const dateB = new Date(b.date)
				return sortOrder.type === 'newest'
					? dateB.getTime() - dateA.getTime()
					: dateA.getTime() - dateB.getTime()
			})
		}))

		setFilteredPosts(result)
	}

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
	console.log(filteredPosts)

	return (
		<div className='bg-background mx-auto min-h-screen max-w-4xl'>
			<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
				<div className='mb-8'>
					<h1 className='text-foreground font-manrope mb-2 text-3xl font-bold'>
						Danh sách bài đăng
					</h1>
					<p className='text-muted-foreground'>
						Quản lý và theo dõi các quan tâm từ người dùng
					</p>
				</div>
				{/* Search and Filter */}
				<SearchFilter
					onSearch={handleSearch}
					activeTab={activeTab}
				/>
				{/* Tabs */}
				<div className='mb-6'>
					<div className='border-border bg-card/60 flex space-x-1 rounded-xl border px-2 py-1 backdrop-blur-sm'>
						<button
							onClick={() => setActiveTab('completed')}
							className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
								activeTab === 'completed'
									? 'bg-primary text-primary-foreground shadow-md'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'
							}`}
						>
							<CheckCircle className='h-4 w-4' />
							<span>Đã Quan Tâm</span>
							<span
								className={`rounded-full px-2 py-1 text-xs font-semibold ${
									activeTab === 'completed'
										? 'bg-primary-foreground/20 text-primary-foreground'
										: 'bg-accent text-accent-foreground'
								}`}
							>
								{getTotalCount('completed')}
							</span>
						</button>
						<button
							onClick={() => setActiveTab('active')}
							className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
								activeTab === 'active'
									? 'bg-chart-1 text-primary-foreground shadow-md'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'
							}`}
						>
							<Eye className='h-4 w-4' />
							<span>Đang Quan Tâm</span>
							<span
								className={`rounded-full px-2 py-1 text-xs font-semibold ${
									activeTab === 'active'
										? 'bg-primary-foreground/20 text-primary-foreground'
										: 'bg-chart-1 text-accent-foreground'
								}`}
							>
								{getTotalCount('active')}
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
							className='space-y-4'
						>
							{filteredPosts.length > 0 ? (
								filteredPosts.map(
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
								<div className='border-border bg-card/50 rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm'>
									<div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
										{activeTab === 'active' ? (
											<Eye className='text-muted-foreground h-8 w-8' />
										) : (
											<CheckCircle className='text-muted-foreground h-8 w-8' />
										)}
									</div>
									<p className='text-muted-foreground text-lg'>
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

export default Interest
