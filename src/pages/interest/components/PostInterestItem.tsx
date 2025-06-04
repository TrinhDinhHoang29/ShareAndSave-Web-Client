import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Hash, User } from 'lucide-react'
import { useState } from 'react'

import { PostInterest } from '@/models/interfaces'

import { InterestItem } from './InterestItem'

export const PostItem = ({
	post,
	activeTab
}: {
	post: PostInterest
	activeTab: 'active' | 'completed'
}) => {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div className='border-border bg-card/80 overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm transition-shadow duration-200 hover:shadow-xl'>
			<div
				className='bg-card hover:bg-muted/50 flex cursor-pointer items-center justify-between p-6 transition-colors duration-200'
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className='flex items-center space-x-4'>
					<div
						className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-lg ${
							activeTab === 'active' ? 'bg-chart-1' : 'bg-primary'
						}`}
					>
						<Hash className='text-primary-foreground h-6 w-6' />
					</div>
					<div>
						<h3 className='text-foreground font-manrope text-xl font-semibold'>
							{post.title}
						</h3>
						<p className='text-muted-foreground mt-1 text-sm'>
							Bài đăng #{post.id}
						</p>
					</div>
				</div>

				<div className='flex items-center space-x-3'>
					<div
						className={`flex items-center space-x-2 rounded-full px-4 py-2 font-medium ${
							activeTab === 'active'
								? 'bg-chart-accent-1 text-chart-accent-foreground-1'
								: 'bg-accent text-accent-foreground'
						}`}
					>
						<User className='h-4 w-4' />
						<span>{post.interests.length}</span>
					</div>

					<div
						className={`bg-muted hover:bg-muted/50 transform rounded-full p-2 transition-colors duration-200 ${
							isExpanded ? 'rotate-180' : ''
						} transition-transform duration-200`}
					>
						<ChevronDown className='text-muted-foreground h-5 w-5' />
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
						className='border-border bg-muted/50 border-t'
					>
						<div className='p-6'>
							{post.interests.length > 0 ? (
								<div className='space-y-4'>
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
									<div className='bg-muted mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full'>
										<User className='text-muted-foreground h-6 w-6' />
									</div>
									<p className='text-muted-foreground'>Chưa có ai quan tâm</p>
								</div>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}
