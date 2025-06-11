import { AnimatePresence } from 'framer-motion'
import { Calendar, MessageCircle, User } from 'lucide-react'
import { useState } from 'react'

import { ChatDialog } from '@/components/common/ChatDialog'
import { IItem, IUserInterest } from '@/models/interfaces'

export const InterestItem = ({
	postTitle,
	items,
	userInterest,
	postID,
	authorID
}: {
	postTitle: string
	items?: IItem[]
	userInterest: IUserInterest
	postID: number
	authorID: number
}) => {
	const [showChat, setShowChat] = useState(false)

	return (
		<div className='relative'>
			<div className='border-border bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
				<div className='flex items-center space-x-4'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
						{userInterest?.userAvatar ? (
							<img
								src={userInterest?.userAvatar}
								alt={`${userInterest?.userName} avatar`}
								className='h-full w-full rounded-full object-cover'
							/>
						) : (
							<User className='text-secondary h-5 w-5' /> // Placeholder nếu không có avatar
						)}
					</div>
					<div>
						<p className='text-foreground font-semibold'>
							{userInterest.userName}
						</p>
						<div className='text-muted-foreground mt-1 flex items-center space-x-2 text-sm'>
							<Calendar className='h-4 w-4' />
							<span>
								{new Date(userInterest.createdAt).toLocaleDateString('vi-VN')}
							</span>
							{/* <div className='ml-2 flex items-center space-x-1'>
								<CheckCircle className='text-chart-1 h-4 w-4' />
								<span className='text-chart-1 font-medium'>Hoàn thành</span>
							</div> */}
						</div>
					</div>
				</div>

				<button
					className={`text-primary-foreground bg-primary rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl`}
					onClick={() => setShowChat(!showChat)}
					aria-label='Chat'
				>
					<MessageCircle className='h-5 w-5' />
				</button>
			</div>

			<AnimatePresence>
				{showChat && (
					<ChatDialog
						authorID={authorID}
						postID={postID}
						interestID={userInterest.id}
						receiver={{
							id: userInterest.id,
							name: userInterest.userName
						}}
						postTitle={postTitle}
						onClose={() => setShowChat(false)}
						items={items}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
