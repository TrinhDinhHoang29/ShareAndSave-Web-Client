import { AnimatePresence, motion } from 'framer-motion'
import { Frown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import CustomSelect from '@/components/common/CustomSelect'
import Pagination from '@/components/common/Pagination'
import { useUpdatePostMutation } from '@/hooks/mutations/use-post.mutation'
import { useListMyPostQuery } from '@/hooks/queries/use-post-query'
import useDebounce from '@/hooks/use-debounce'
import { EPostSTatus, EPostType, ESortOrder } from '@/models/enums'
import { IListTypeParams, IPost } from '@/models/interfaces'
import { sortOptions, typeOptions } from '@/models/options'
import Heading from '@/pages/home/components/Heading'

import MyPostDetailDialog from './components/MyPostDetailDialog'
import MyPostItem from './components/MyPostItem'
import MyPostItemSkeleton from './components/MyPostItemSkeleton'

// Kiểu hợp nhất với '' cho "Tất cả"
type PostStatusSelection = '' | EPostSTatus

// Options cho status
const statusOptions = [
	{ value: '', label: 'Tất cả trạng thái' },
	{ value: EPostSTatus.PENDING, label: 'Đang chờ duyệt' },
	{ value: EPostSTatus.REJECTED, label: 'Bị từ chối' },
	{ value: EPostSTatus.APPROVED, label: 'Đã duyệt' },
	{ value: EPostSTatus.SEAL, label: 'Đã khóa' }
]

type PostTypeSelection = '' | EPostType
const limit = 9

const MyPost = () => {
	const [selectedStatus, setSelectedStatus] = useState<PostStatusSelection>('') // Mặc định là "Tất cả"
	const [selectedType, setSelectedType] = useState<PostTypeSelection>('') // Mặc định là "Tất cả"
	const [search, setSearch] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [order, setOrder] = useState<ESortOrder>(ESortOrder.DESC) // Mặc định là mới nhất
	const [selectedPost, setSelectedPost] = useState<IPost | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const debouncedSearch = useDebounce(search, 500)

	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedSearch, selectedStatus])

	const params: IListTypeParams<EPostType> = useMemo(
		() => ({
			status: Number(selectedStatus as EPostSTatus) || undefined, // Nếu rỗng, không gửi status
			type: (selectedType as EPostType) || undefined, // Nếu rỗng, không gửi type
			page: currentPage,
			limit, // Giới hạn 6 item mỗi trang
			sort: 'createdAt', // Sắp xếp theo createdAt
			order, // ASC hoặc DESC
			search: debouncedSearch || undefined // Chỉ gửi search nếu có giá trị
		}),
		[selectedStatus, currentPage, order, debouncedSearch, selectedType]
	)

	const { data, isPending, refetch } = useListMyPostQuery(params)
	const { mutate: updatePostMutation } = useUpdatePostMutation({
		onSuccess: () => {
			refetch()
		}
	})
	const posts = data?.posts || []
	const totalPage = data?.totalPage || 1
	const navigate = useNavigate()

	const handlePostClick = (post: IPost) => {
		if (post.status === parseInt(EPostSTatus.APPROVED)) {
			// Nếu là APPROVED, điều hướng đến trang chi tiết
			navigate('/bai-dang/' + post.slug)
		} else {
			// Nếu không phải APPROVED, mở dialog
			setSelectedPost(post)
			setIsDialogOpen(true)
		}
	}

	const handleUpdateStatus = async (postID: number, status: EPostSTatus) => {
		updatePostMutation({
			postID,
			data: {
				status: Number(status)
			}
		})
	}

	const handleRepost = (postID: number) => {
		updatePostMutation({
			postID,
			data: {
				isRepost: true
			}
		})
	}

	const handleGoToPost = (slug: string) => {
		navigate('/bai-dang/' + slug)
	}

	return (
		<div className='container mx-auto space-y-6 py-12'>
			<Heading title='Bài đăng của tôi' />
			<div className='flex items-center justify-between gap-2'>
				<div className='w-1/2'>
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
					<label
						htmlFor='searchInput'
						className='text-secondary mb-1 block text-sm font-medium'
					>
						Sắp xếp
					</label>
					<CustomSelect
						value={order}
						onChange={value => setOrder(value as ESortOrder)}
						options={sortOptions}
						className='w-full flex-1'
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
						className='w-full flex-1'
					/>
				</div>

				<div className='flex-1'>
					<label className='text-secondary mb-1 block text-sm font-medium'>
						Trạng thái
					</label>
					<CustomSelect
						value={selectedStatus}
						onChange={value => setSelectedStatus(value as PostStatusSelection)}
						options={statusOptions}
						className='flex-1'
					/>
				</div>
			</div>

			<div className='relative space-y-6'>
				<AnimatePresence mode='wait'>
					<motion.div
						key={selectedStatus}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className='space-y-6'
					>
						<div className='grid grid-cols-3 gap-6'>
							{isPending ? (
								<MyPostItemSkeleton quantity={limit} />
							) : posts.length > 0 ? (
								posts.map(post => (
									<MyPostItem
										key={post.id}
										post={post}
										onPostClick={() => handlePostClick(post)}
										onUpdateStatus={handleUpdateStatus}
										onRepost={handleRepost}
										onGoToPost={handleGoToPost}
									/>
								))
							) : (
								<div className='border-border bg-card/50 col-span-3 rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm'>
									<div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
										<Frown className='text-muted-foreground h-8 w-8' />
									</div>
									<p className='text-muted-foreground text-lg'>
										Không tìm thấy bài đăng nào
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

			{/* Dialog hiển thị chi tiết bài đăng */}
			<MyPostDetailDialog
				post={selectedPost}
				isOpen={isDialogOpen}
				onClose={() => {
					setIsDialogOpen(false)
					setSelectedPost(null)
				}}
			/>
		</div>
	)
}

export default MyPost
