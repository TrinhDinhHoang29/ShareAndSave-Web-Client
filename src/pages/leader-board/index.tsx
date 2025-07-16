import { motion } from 'framer-motion'
import { History, TrendingUp, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import Loading from '@/components/common/Loading'
import { useUserRanksQuery } from '@/hooks/queries/use-good-deed.query'
import useAuthStore from '@/stores/authStore'

import MyHistory from './components/MyHistory'
import PodiumTop from './components/PodiumTop'
import PodiumTopSkeleton from './components/PodiumTopSkeleton'
import ScoringSystem from './components/ScoringSystem'
import UserInfoCard from './components/UserInfoCard'
import UserInfoCardSkeleton from './components/UserInfoCardSkeleton'
import UserRanksOutTop from './components/UserRanksOutTop'

const Leaderboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'rankings' | 'history'>('rankings')
	const userId = useAuthStore.getState().user?.id

	const {
		data: userRankData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useUserRanksQuery(userId || 0, {
		limit: 10,
		page: 1
	})

	// Flatten transactions from all pages
	const userRanks = useMemo(() => {
		return userRankData?.pages.flatMap(page => page.userRanks) || []
	}, [userRankData])

	const myRank = useMemo(() => {
		console.log('Chay vao myRank')
		return userRankData?.pages[0].yourRank
	}, [userRankData?.pages[0]])

	const myInfo = useMemo(() => {
		console.log('Chay vao myInfo')
		return userRankData?.pages[0].yourInfo
	}, [userRankData?.pages[0]])
	// Intersection Observer for infinite scroll
	const { ref: sentinelRef, inView } = useInView({
		threshold: 0.5,
		rootMargin: '100px'
	})

	// Trigger fetch next page when sentinel is in view
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

	return (
		<div className='container mx-auto py-12'>
			{/* User Stats */}
			{/* Tabs */}
			<div className='mb-6'>
				<div className='glass rounded-lg px-4 py-3 shadow-sm'>
					<div className='flex'>
						<button
							onClick={() => setActiveTab('rankings')}
							className={`flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 ${
								activeTab === 'rankings'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
							}`}
						>
							<Trophy className='h-4 w-4' />
							Bảng xếp hạng
						</button>
						<button
							onClick={() => setActiveTab('history')}
							className={`flex flex-1 items-center justify-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all duration-200 ${
								activeTab === 'history'
									? 'bg-primary text-primary-foreground shadow-sm'
									: 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
							}`}
						>
							<History className='h-4 w-4' />
							Lịch sử hoạt động
						</button>
					</div>
				</div>
			</div>
			<div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
				{/* Main Content */}
				<div className='space-y-6 lg:col-span-2'>
					{activeTab === 'rankings' ? (
						/* Rankings Tab */
						<>
							<div className='glass mb-6 rounded-lg shadow-sm'>
								<div className='p-6'>
									<div className='mb-6 flex items-center gap-3'>
										<div className='bg-primary/10 rounded-lg p-2'>
											<TrendingUp className='text-primary h-5 w-5' />
										</div>
										<h2 className='text-foreground text-lg font-semibold'>
											Thông tin của bạn
										</h2>
									</div>

									{myInfo && myRank ? (
										<UserInfoCard
											myInfo={myInfo}
											myRank={myRank}
										/>
									) : (
										<UserInfoCardSkeleton />
									)}
								</div>
							</div>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.2 }}
								className='glass border-border/20 rounded-xl border shadow-xl'
							>
								<div className='p-8'>
									<div className='mb-8 flex items-center gap-3'>
										<div className='from-primary/20 to-primary/10 rounded-xl bg-gradient-to-r p-3'>
											<Trophy className='text-primary h-6 w-6' />
										</div>
										<h2 className='text-foreground text-xl font-bold'>
											Bảng xếp hạng
										</h2>
									</div>

									{/* Top 3 Podium */}
									{userRanks ? (
										userRanks.length >= 3 ? (
											<PodiumTop users={userRanks} />
										) : null
									) : (
										<PodiumTopSkeleton />
									)}

									{/* Rest of the rankings */}
									<div className='max-h-[400px] space-y-3 overflow-y-auto'>
										<motion.div
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ duration: 0.3, delay: 0.4 }}
											className='space-y-3 px-2'
										>
											<UserRanksOutTop
												userRanks={userRanks}
												myID={myInfo?.userID || 0}
											/>

											{/* Loading spinner for infinite scroll */}
											{isFetchingNextPage && (
												<div className='flex justify-center py-8'>
													<Loading
														text='Đang tải thêm...'
														size='sm'
														color='secondary'
													/>
												</div>
											)}

											{/* Sentinel for infinite scroll */}
											{hasNextPage && (
												<div
													ref={sentinelRef}
													style={{ height: '1px' }}
												/>
											)}

											{/* End of list indicator */}
											{!hasNextPage && userRanks.length > 0 && (
												<div className='py-6 text-center'>
													<span className='text-muted-foreground text-sm'>
														Đã hiển thị tất cả kết quả
													</span>
												</div>
											)}
										</motion.div>
									</div>
								</div>
							</motion.div>
						</>
					) : (
						/* History Tab */
						<div className='glass rounded-lg shadow-sm'>
							<div className='p-6'>
								<div className='mb-6 flex items-center gap-3'>
									<div className='bg-primary/10 rounded-lg p-2'>
										<History className='text-primary h-5 w-5' />
									</div>
									<h2 className='text-foreground text-lg font-semibold'>
										Lịch sử hoạt động của bạn
									</h2>
								</div>
								<MyHistory />
							</div>
						</div>
					)}
				</div>

				<ScoringSystem />
			</div>
		</div>
	)
}

export default Leaderboard
