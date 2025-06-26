import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, FileTextIcon, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useChatNotification } from '@/context/chat-noti-context'
import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'
import { IPostInterest } from '@/models/interfaces'

import { InterestItem } from './InterestItem'

export const PostItem = ({ post }: { post: IPostInterest }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const { Icon, label, color } = getTypeInfo(post.type.toString() as EPostType)
	const navigate = useNavigate()
	const { followedByNotification } = useChatNotification()
	const [isPing, setIsPing] = useState(false)

	useEffect(() => {
		if (
			followedByNotification &&
			post.interests.some(
				interest => interest.id === followedByNotification.interestID
			)
		) {
			setIsPing(true)
		}
	}, [followedByNotification])

	return (
		<div
			className={clsx(
				'bg-card/80 rounded-2xl border shadow-lg backdrop-blur-sm transition-shadow duration-200 hover:shadow-xl',
				isPing ? 'border-error' : 'border-border'
			)}
		>
			<div
				className='bg-card hover:bg-muted/50 flex cursor-pointer items-center justify-between p-6 transition-colors duration-200'
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className='flex items-center space-x-4'>
					<div className='flex items-center space-x-4'>
						<div
							className={`bg-primary flex h-12 w-12 items-center justify-center rounded-xl shadow-lg`}
						>
							<span className='text-primary-foreground text-lg'>
								<Icon />
							</span>
						</div>
						<div>
							<div className='space-y-2'>
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
								>
									{label}
								</span>
								<h3 className='text-foreground font-manrope truncate text-xl font-semibold'>
									{post.title}
								</h3>
							</div>
						</div>
					</div>
				</div>

				<div className='flex items-center space-x-3'>
					<button
						onClick={e => {
							e.stopPropagation()
							navigate(`/bai-dang/${post.slug}`)
						}}
						title='Xem bài đăng'
						className={`bg-secondary/80 text-secondary-foreground hover:bg-secondary flex items-center space-x-2 rounded-full px-6 py-3 font-medium`}
					>
						<FileTextIcon className='h-4 w-4' />
					</button>
					<div
						className={`bg-accent text-accent-foreground flex items-center space-x-2 rounded-full px-4 py-2 font-medium`}
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
						className='border-border bg-muted/50 relative max-h-96 overflow-y-auto border-t' // Thêm relative, max-height và cuộn
					>
						<div className='p-6'>
							{post.interests.length > 0 ? (
								<div className='space-y-4'>
									{post.interests.map(interest => (
										<InterestItem
											authorID={post.authorID}
											userInterest={interest}
											key={interest.id}
											postID={post.id}
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
