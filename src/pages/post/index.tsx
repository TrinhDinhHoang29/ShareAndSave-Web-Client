import { AnimatePresence, motion } from 'framer-motion'
import { Frown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CustomSelect from '@/components/common/CustomSelect'
import Pagination from '@/components/common/Pagination'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import useDebounce from '@/hooks/use-debounce'
import { EPostType, ESortOrder } from '@/models/enums'
import { IListTypeParams } from '@/models/interfaces'
import { sortOptions, typeOptions } from '@/models/options'

import PostItem from './components/PostItem'
import PostItemSkeleton from './components/PostItemSkeleton'

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
	const navigate = useNavigate()

	return (
		<div className='container mx-auto py-12'>
			<div className='mb-6 flex items-center justify-between gap-2'>
				<div className='w-2/3'>
					<label
						htmlFor='searchInput'
						className='text-secondary mb-1 block text-sm font-medium'
					>
						Tìm kiếm
					</label>
					<input
						id='searchInput'
						type='text'
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Tìm kiếm bài đăng, tiêu đề...'
						className='bg-card text-foreground focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
					/>
				</div>
				<div className='flex-1'>
					<label className='text-secondary mb-1 block text-sm font-medium'>
						Sắp xếp
					</label>
					<CustomSelect
						value={order}
						onChange={value => setOrder(value as ESortOrder)}
						options={sortOptions}
						className='flex-1'
					/>
				</div>
				<div className='flex-1'>
					<label className='text-secondary mb-1 block text-sm font-medium'>
						Loại bài đăng
					</label>
					<CustomSelect
						value={selectedType}
						onChange={value => setSelectedType(value as PostTypeSelection)}
						options={typeOptions}
						className='flex-1'
					/>
				</div>
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
								<PostItemSkeleton quantity={6} />
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
	)
}

export default Post
