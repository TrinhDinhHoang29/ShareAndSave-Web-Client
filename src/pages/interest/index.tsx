import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Eye, Frown, Smile } from 'lucide-react'
import { useMemo, useState } from 'react'

import Loading from '@/components/common/Loading'
import useListPostInterestQuery from '@/hooks/queries/use-interest.query'
import { EInterestType } from '@/models/enums'

import { PostItem } from './components/FollowedByPost'
import { InterestedPost } from './components/InterestedPost'

const Interest = () => {
	const [activeTab, setActiveTab] = useState<EInterestType>(1)

	const { data, isPending } = useListPostInterestQuery({ type: activeTab })
	const listPostInterest = data?.interests
	const totalPage = data?.totalPage

	const getTotalCount = useMemo(() => {
		return listPostInterest?.length || 0
	}, [listPostInterest])

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
				{/* Tabs */}
				<div className='mb-6'>
					<div className='border-border bg-card/60 flex space-x-1 rounded-xl border p-2 backdrop-blur-sm'>
						<button
							onClick={() => setActiveTab(1)}
							className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
								activeTab === 1
									? 'bg-chart-1 text-primary-foreground shadow-md'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'
							}`}
						>
							<Eye className='h-4 w-4' />
							<span>Đang Quan Tâm</span>
							{activeTab === 1 && (
								<span
									className={`rounded-full px-2 py-1 text-xs font-semibold ${
										activeTab === 1
											? 'bg-primary-foreground/20 text-primary-foreground'
											: 'bg-chart-1 text-accent-foreground'
									}`}
								>
									{getTotalCount}
								</span>
							)}
						</button>
						<button
							onClick={() => setActiveTab(2)}
							className={`flex flex-1 items-center justify-center space-x-2 rounded-lg px-4 py-3 font-medium transition-all duration-200 ${
								activeTab === 2
									? 'bg-primary text-primary-foreground shadow-md'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground'
							}`}
						>
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
							{isPending ? (
								<div className='flex items-center justify-center'>
									<Loading />
								</div>
							) : listPostInterest && listPostInterest.length > 0 ? (
								listPostInterest.map(post =>
									post.interests.length > 0 && activeTab === 1 ? (
										<InterestedPost post={post} />
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
				</div>
			</div>
		</div>
	)
}

export default Interest
