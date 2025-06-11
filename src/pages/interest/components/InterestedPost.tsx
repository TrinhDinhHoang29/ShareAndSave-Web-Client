import { AnimatePresence } from 'framer-motion'
import { FileText, Heart, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { ChatDialog } from '@/components/common/ChatDialog'
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
	const [showChat, setShowChat] = useState(false)
	const typeInfo = getTypeInfo(post.type.toString() as EPostType)
	const navigate = useNavigate()

	return (
		<div className='border-border bg-card/80 overflow-hidden rounded-2xl border shadow-lg backdrop-blur-sm transition-shadow duration-200 hover:shadow-xl'>
			{/* Post Header */}
			<div className='bg-card p-6'>
				<div className='mb-4 flex items-center justify-between'>
					<div className='flex items-center space-x-4'>
						<div
							className={`bg-chart-1 flex h-12 w-12 items-center justify-center rounded-xl shadow-lg`}
						>
							<span className='text-primary-foreground text-lg'>
								{typeInfo.icon}
							</span>
						</div>
						<div>
							<div className='space-y-2'>
								<span
									className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeInfo.color}`}
								>
									{typeInfo.label}
								</span>
								<h3 className='text-foreground font-manrope truncate text-xl font-semibold'>
									{post.title}
								</h3>
								<p className='text-muted-foreground text-sm'>
									Đăng bởi {post.authorName}
								</p>
							</div>
						</div>
					</div>

					<div className='flex space-x-2'>
						<button
							className='border-border hover:bg-muted rounded-xl border p-3 transition-all duration-200'
							aria-label='Xem bài đăng'
							title='Xem bài đăng'
							onClick={() => navigate(`/bai-dang/${post.slug}`)}
						>
							<FileText className='text-muted-foreground h-5 w-5' />
						</button>

						<button
							className={`text-primary-foreground bg-destructive rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl`}
							onClick={() => onDeleteInterest(post.id)}
							aria-label='Hủy quan tâm'
							title='Hủy quan tâm'
						>
							<Heart className='h-5 w-5' />
						</button>

						<button
							className={`text-primary-foreground bg-chart-1 rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl`}
							onClick={() => setShowChat(true)}
							aria-label='Chat với tác giả'
							title='Chat với tác giả'
						>
							<MessageCircle className='h-5 w-5' />
						</button>
					</div>
				</div>

				<p className='text-muted-foreground bg-muted/50 line-clamp-2 rounded-lg p-4 text-sm leading-relaxed'>
					{post.description}
				</p>
			</div>

			{/* Chat Dialog */}
			<AnimatePresence>
				{showChat && (
					<ChatDialog
						interestID={post.interests[0].id}
						postID={post.id}
						authorID={post.authorID}
						receiver={{
							id: post.authorID,
							name: post.authorName
						}}
						postTitle={post.title}
						onClose={() => {
							setShowChat(false)
						}}
						items={post.items}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
