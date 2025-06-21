import { Clock, FileText, Heart, MessageCircle, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useChatNotification } from '@/context/chat-noti-context'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'
import { IPostInterest } from '@/models/interfaces'

export const InterestedPost = ({
	post,
	onDeleteInterest
}: {
	post: IPostInterest
	onDeleteInterest: (postID: number) => void
}) => {
	const { label, Icon, color } = getTypeInfo(post.type.toString() as EPostType)
	const { followingNotification } = useChatNotification()
	const [newMessages, setNewMessages] = useState<number>(
		post.unreadMessageCount
	)

	useEffect(() => {
		if (
			followingNotification &&
			followingNotification.interestID === post.interests[0].id
		) {
			setNewMessages(prev => ++prev)
		}
	}, [followingNotification])

	return (
		<div className='border-border bg-card/80 overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm transition-shadow duration-200 hover:shadow-xl'>
			{/* Post Header */}
			<div className='bg-card p-6'>
				<div className='mb-4 flex items-center justify-between'>
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
								<div className='text-muted-foreground flex items-center gap-4 text-sm'>
									<span className='flex items-center gap-1'>
										<User className='h-4 w-4' />
										{post.authorName}
									</span>
									<span className='flex items-center gap-1'>
										<Clock className='h-4 w-4' />
										{formatNearlyDateTimeVN(post.createdAt)}
									</span>
								</div>
							</div>
						</div>
					</div>

					<div className='flex space-x-2'>
						<Link
							to={`/bai-dang/${post.slug}`}
							className='border-border hover:bg-muted rounded-xl border p-3 transition-all duration-200'
							aria-label='Xem bài đăng'
							title='Xem bài đăng'
						>
							<FileText className='text-muted-foreground h-5 w-5' />
						</Link>

						<button
							className={`text-primary-foreground bg-destructive rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl`}
							onClick={() => onDeleteInterest(post.id)}
							aria-label='Hủy quan tâm'
							title='Hủy quan tâm'
						>
							<Heart className='h-5 w-5' />
						</button>

						<Link
							to={`/chat/${post.interests[0].id}`}
							className={`text-primary-foreground bg-primary relative rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl`}
							aria-label='Chat với người đăng'
							title='Chat với người đăng'
						>
							<MessageCircle className='h-5 w-5' />
							{newMessages > 0 && (
								<span className='absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-xs font-medium text-red-700'>
									{newMessages > 99 ? '99+' : newMessages}
								</span>
							)}
						</Link>
					</div>
				</div>

				<p className='text-muted-foreground bg-muted/50 line-clamp-2 rounded-lg p-4 text-sm leading-relaxed'>
					{post.description}
				</p>
			</div>
		</div>
	)
}
