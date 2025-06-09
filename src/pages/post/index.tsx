import { AnimatePresence, motion } from 'framer-motion'
import { Frown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Pagination from '@/components/common/Pagination'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import useDebounce from '@/hooks/use-debounce'
import { EPostType, ESortOrder } from '@/models/enums'
import { IListTypeParams } from '@/models/interfaces'

import PostItem from './components/PostItem'

// Kiểu hợp nhất với '' cho "Tất cả"
type PostTypeSelection = '' | EPostType

const Post = () => {
	const [selectedType, setSelectedType] = useState<PostTypeSelection>('') // Mặc định là "Tất cả"
	const [search, setSearch] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [order, setOrder] = useState<ESortOrder>(ESortOrder.DESC) // Mặc định là mới nhất

	const debouncedSearch = useDebounce(search, 500)

	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedSearch, selectedType])

	const params: IListTypeParams<EPostType> = useMemo(
		() => ({
			type: (selectedType as EPostType) || undefined, // Nếu rỗng, không gửi type
			page: currentPage,
			limit: 6, // Giới hạn 6 item mỗi trang
			sort: 'createdAt', // Sắp xếp theo createdAt
			order, // ASC hoặc DESC
			search: debouncedSearch || undefined // Chỉ gửi search nếu có giá trị
		}),
		[selectedType, currentPage, order, debouncedSearch]
	)

	const { data, isPending } = useListPostQuery(params)
	const posts = data?.posts || []
	const totalPage = data?.totalPage || 1

	// Skeleton loading array (8 items to match limit)
	const skeletonItems = Array.from({ length: 8 }, (_, index) => index)
	const navigate = useNavigate()

	return (
		<div className='bg-background min-h-screen'>
			<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
				{/* Search, Sort và Selection */}
				<div className='mb-6 flex items-center justify-between gap-4'>
					<input
						type='text'
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Tìm kiếm bài đăng, tiêu đề...'
						className='bg-card text-foreground focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
					/>
					<select
						value={order}
						onChange={e => setOrder(e.target.value as ESortOrder)}
						className='bg-card text-foreground focus:ring-primary rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
					>
						<option value={ESortOrder.DESC}>Mới nhất</option>
						<option value={ESortOrder.ASC}>Cũ nhất</option>
					</select>
					<select
						value={selectedType}
						onChange={e => setSelectedType(e.target.value as PostTypeSelection)}
						className='bg-card text-foreground focus:ring-primary rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
					>
						<option value=''>Tất cả</option>
						<option value={EPostType.GIVE_AWAY_OLD_ITEM}>Cho tặng đồ cũ</option>
						<option value={EPostType.FOUND_ITEM}>Tìm thấy đồ</option>
						<option value={EPostType.SEEK_LOSE_ITEM}>Tìm đồ bị mất</option>
						<option value={EPostType.OTHER}>Khác</option>
					</select>
				</div>

				<div className='relative space-y-6'>
					<AnimatePresence mode='wait'>
						<motion.div
							key={selectedType}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className='space-y-6'
						>
							<div className='grid grid-cols-3 gap-6'>
								{isPending ? (
									skeletonItems.map(index => (
										<div
											key={index}
											className='bg-card border-border/50 animate-pulse rounded-xl border shadow-sm'
										>
											<div className='aspect-video rounded-t-xl bg-gray-300' />
											<div className='p-6'>
												<div className='mb-4 h-6 rounded bg-gray-300' />
												<div className='mb-4 h-4 rounded bg-gray-300' />
												<div className='mb-4 h-4 w-3/4 rounded bg-gray-300' />
												<div className='flex justify-between'>
													<div className='h-4 w-1/3 rounded bg-gray-300' />
													<div className='h-4 w-1/3 rounded bg-gray-300' />
												</div>
											</div>
										</div>
									))
								) : posts.length > 0 ? (
									posts.map(post => (
										<PostItem
											key={post.id}
											post={post}
											onPostClick={slug => navigate('/bai-dang' + '/' + slug)} // Ví dụ, có thể thay bằng navigation
										/>
									))
								) : (
									<div className='border-border bg-card/50 col-span-4 rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm'>
										<div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
											<Frown className='text-muted-foreground h-8 w-8' />
										</div>
										<p className='text-muted-foreground text-lg'>
											Không tìm thấy kết quả
										</p>
									</div>
								)}
							</div>
						</motion.div>
					</AnimatePresence>
					{totalPage > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPage}
							setCurrentPage={setCurrentPage}
						/>
					)}
				</div>
			</div>
		</div>
	)
}

export default Post
