import { useQueryClient } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Eye, Frown, Smile } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import CustomSelect from '@/components/common/CustomSelect'
import Loading from '@/components/common/Loading'
import Pagination from '@/components/common/Pagination'
import { useChatNotification } from '@/context/chat-noti-context'
import { useDeleteInterestMutation } from '@/hooks/mutations/use-interest.mutation'
import { useListPostInterestQuery } from '@/hooks/queries/use-interest.query'
import useDebounce from '@/hooks/use-debounce'
import { EInterestType, ESortOrder } from '@/models/enums'
import { IListTypeParams } from '@/models/interfaces'
import { sortOptions } from '@/models/options'

import AlertPing from './components/AlertPing'
import { PostItem } from './components/FollowedByPost'
import { InterestedPost } from './components/InterestedPost'

const Interest = () => {
	const [activeTab, setActiveTab] = useState<EInterestType>(1)
	const [search, setSearch] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [order, setOrder] = useState<ESortOrder>(ESortOrder.DESC)
	// State để quản lý trạng thái ping cho từng tab
	const [followingPing, setFollowingPing] = useState(false)
	const [followedByPing, setFollowedByPing] = useState(false)

	const { followedByNotification, followingNotification } =
		useChatNotification()

	const debouncedSearch = useDebounce(search, 500)

	const params: IListTypeParams<EInterestType> = useMemo(
		() => ({
			type: activeTab,
			page: currentPage,
			limit: 5,
			sort: 'createdAt',
			order,
			search: debouncedSearch || undefined
		}),
		[activeTab, currentPage, order, debouncedSearch]
	)

	const { data, isPending } = useListPostInterestQuery(params)
	const listPostInterest = data?.interests
	const totalPage = data?.totalPage || 1
	const newMessages = data?.unreadMessageCount || 0
	const queryClient = useQueryClient()

	// Effect để theo dõi followingNotification (Đang quan tâm - Tab 1)
	useEffect(() => {
		if (followingNotification) {
			setFollowingPing(true)
			const timer = setTimeout(() => {
				setFollowingPing(false)
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [followingNotification])

	// Effect để theo dõi followedByNotification (Được quan tâm - Tab 2)
	useEffect(() => {
		if (followedByNotification) {
			setFollowedByPing(true)
			const timer = setTimeout(() => {
				setFollowedByPing(false)
			}, 3000)
			return () => clearTimeout(timer)
		}
	}, [followedByNotification])

	// Mutation để hủy quan tâm
	const { mutate: deleteInterestMutation, isPending: isDeleteInterestPending } =
		useDeleteInterestMutation({
			onSuccess: (interestID: number) => {
				queryClient.invalidateQueries({ queryKey: ['postInterests', params] })
				if (listPostInterest && listPostInterest.length > 0) {
					const slug = listPostInterest.filter(
						post => post.interests[0].id === interestID
					)[0].slug
					queryClient.invalidateQueries({ queryKey: ['posts', slug] })
				}
			}
		})

	const handleDeleteInterest = (postID: number) => {
		deleteInterestMutation(postID)
	}

	const getTotalCount = useMemo(() => {
		return listPostInterest?.length || 0
	}, [listPostInterest])

	// Hàm để reset ping khi chuyển tab
	const handleTabChange = (tabType: EInterestType) => {
		setActiveTab(tabType)
		// Reset ping state khi user nhấn vào tab đó
		if (tabType === 1) {
			setFollowingPing(false)
		} else if (tabType === 2) {
			setFollowedByPing(false)
		}
	}
	// console.log(followedByNotification)

	return (
		<div className='container mx-auto py-12'>
			<div className='mb-8'>
				<h1 className='text-foreground font-manrope mb-2 text-3xl font-bold'>
					Danh sách bài đăng
				</h1>
				<p className='text-muted-foreground'>
					Quản lý và theo dõi các quan tâm từ người dùng
				</p>
			</div>

			{/* Search và Sort */}
			<div className='mb-6 flex items-center justify-between gap-4'>
				<input
					type='text'
					value={search}
					onChange={e => setSearch(e.target.value)}
					placeholder='Tìm kiếm bài đăng, người dùng...'
					className='bg-card text-foreground focus:ring-primary h-full w-4/5 rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
				/>
				<CustomSelect
					value={order}
					onChange={value => setOrder(value as ESortOrder)}
					options={sortOptions}
					className='w-full flex-1'
				/>
			</div>

			{/* Tabs */}
			<div className='mb-6'>
				<div className='border-border bg-card/60 flex space-x-1 rounded-xl border p-2 backdrop-blur-sm'>
					<button
						onClick={() => handleTabChange(1)}
						className={`relative flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
							activeTab === 1
								? 'bg-primary text-primary-foreground shadow-md'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground border'
						}`}
					>
						{/* AlertPing cho tab "Đang Quan Tâm" */}
						{followingPing || (newMessages && activeTab === 1) ? (
							<AlertPing isPulse={followingPing} />
						) : null}
						<Eye className='h-4 w-4' />
						<span>Đang Quan Tâm</span>
						{activeTab === 1 && (
							<span
								className={`rounded-full px-2 py-1 text-xs font-semibold ${
									activeTab === 1
										? 'bg-primary-foreground/20 text-primary-foreground'
										: 'bg-accent text-accent-foreground'
								}`}
							>
								{getTotalCount}
							</span>
						)}
					</button>
					<button
						onClick={() => handleTabChange(2)}
						className={`relative flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
							activeTab === 2
								? 'bg-primary text-primary-foreground shadow-md'
								: 'text-muted-foreground hover:bg-muted hover:text-foreground border'
						}`}
					>
						{followedByPing || (newMessages && activeTab === 2) ? (
							<AlertPing isPulse={followedByPing} />
						) : null}
						<CheckCircle className='h-4 w-4' />
						<span>Được Quan Tâm</span>
						{activeTab === 2 && (
							<span
								className={`rounded-full px-2 py-1 text-xs font-semibold ${
									activeTab === 2
										? 'bg-primary-foreground/20 text-primary-foreground'
										: 'bg-accent text-accent-foreground'
								}`}
							>
								{getTotalCount}
							</span>
						)}
					</button>
				</div>
			</div>
			<div className='relative space-y-6'>
				<AnimatePresence mode='wait'>
					<motion.div
						key={activeTab}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className='space-y-4'
					>
						{(isPending || isDeleteInterestPending) && (
							<Loading
								overlay={true}
								position='in'
								size='md'
								color='primary'
								text='Đang tải...'
							/>
						)}
						{listPostInterest && listPostInterest.length > 0 ? (
							listPostInterest.map(post =>
								post.interests.length > 0 && activeTab === 1 ? (
									<InterestedPost
										key={`${post.id}-${activeTab}`}
										post={post}
										onDeleteInterest={handleDeleteInterest}
									/>
								) : (
									<PostItem
										key={`${post.id}-${activeTab}`}
										post={post}
									/>
								)
							)
						) : (
							<div className='border-border bg-card/50 rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm'>
								<div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
									{activeTab === 1 ? (
										<Smile className='text-muted-foreground h-8 w-8' />
									) : (
										<Frown className='text-muted-foreground h-8 w-8' />
									)}
								</div>
								<p className='text-muted-foreground text-lg'>
									{activeTab === 1
										? 'Hãy lan tỏa sự quan tâm đến mọi người nhé!'
										: 'Hãy tạo thêm nội dung để thu hút sự quan tâm nhé!'}
								</p>
							</div>
						)}
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

export default Interest
