import { Calendar, MessageCircle, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { IUserInterest } from '@/models/interfaces'

export const InterestItem = ({
	userInterest,
	postID
}: {
	userInterest: IUserInterest
	postID: number
}) => {
	const navigate = useNavigate()

	const handleOpenChat = () => {
		const receiver = {
			id: userInterest.userID,
			name: userInterest.userName
		}

		navigate(`/chat/${postID}/${userInterest.id}`, {
			state: { receiver }
		})
	}

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
					onClick={handleOpenChat}
					aria-label='Chat'
				>
					<MessageCircle className='h-5 w-5' />
				</button>
			</div>
		</div>
	)
}
