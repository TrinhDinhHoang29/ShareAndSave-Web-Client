import { motion } from 'framer-motion'
import { Heart, History, Star, TrendingUp, Trophy, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import Loading from '@/components/common/Loading'
import { useUserRanksQuery } from '@/hooks/queries/use-good-deed.query'
import { getTotalGoodDeeds } from '@/lib/utils'

import MyHistory from './components/MyHistory'
import PodiumTop from './components/PodiumTop'
import ScoringSystem from './components/ScoringSystem'
import UserRanksOutTop from './components/UserRanksOutTop'

const Leaderboard: React.FC = () => {
	const [activeTab, setActiveTab] = useState<'rankings' | 'history'>('rankings')

	const {
		data: userRankData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError
	} = useUserRanksQuery({
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

									{myInfo && myRank && (
										<>
											{/* User Info */}
											<div className='mb-6 flex items-center gap-4'>
												<div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
													{myInfo.userAvatar ? (
														<img
															src={myInfo.userAvatar}
															alt={myInfo.userName}
															className='h-full w-full rounded-full object-cover'
														/>
													) : (
														<User className='text-primary h-6 w-6' />
													)}
												</div>
												<div>
													<h3 className='text-foreground text-lg font-semibold'>
														{myInfo.userName}
													</h3>
													<p className='text-muted-foreground text-sm'>
														{myInfo.major}
													</p>
												</div>
											</div>

											<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
												<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
													<div className='bg-primary/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
														<Star className='text-primary h-5 w-5' />
													</div>
													<p className='text-muted-foreground mb-1 text-sm'>
														Xếp hạng hiện tại
													</p>
													<p className='text-foreground text-2xl font-bold'>
														#{myRank}
													</p>
												</div>
												<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
													<div className='bg-warning/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
														<Trophy className='text-warning h-5 w-5' />
													</div>
													<p className='text-muted-foreground mb-1 text-sm'>
														Điểm tích lũy
													</p>
													<p className='text-foreground text-2xl font-bold'>
														{myInfo.goodPoint}
													</p>
												</div>
												<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
													<div className='bg-success/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
														<Heart className='text-success h-5 w-5' />
													</div>
													<p className='text-muted-foreground mb-1 text-sm'>
														Việc tốt
													</p>
													<p className='text-foreground text-2xl font-bold'>
														{getTotalGoodDeeds(myInfo.goodDeeds)}
													</p>
												</div>
											</div>
										</>
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
									{userRanks.length >= 3 && <PodiumTop users={userRanks} />}

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
