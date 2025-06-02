import { AnimatePresence } from 'framer-motion'
import { Calendar, CheckCircle, FileText, MessageCircle } from 'lucide-react'
import React, { useState } from 'react'

import { Interest } from '@/models/interfaces'

import { ChatArea } from './ChatArea'

export const InterestItem = ({
	interest,
	postTitle,
	activeTab
}: {
	interest: Interest
	postTitle: string
	activeTab: 'active' | 'completed'
}) => {
	const [showChat, setShowChat] = useState(false)

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(word => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2)
	}

	const getAvatarColor = (name: string) => {
		const colors = [
			'bg-primary',
			'bg-chart-1',
			'bg-chart-2',
			'bg-chart-3',
			'bg-chart-4',
			'bg-chart-5'
		]
		const index = name.length % colors.length
		return colors[index]
	}

	return (
		<div className='relative'>
			<div className='border-border bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
				<div className='flex items-center space-x-4'>
					<div
						className={`h-12 w-12 rounded-full ${getAvatarColor(interest.name)} flex items-center justify-center shadow-lg`}
					>
						<span className='text-primary-foreground text-sm font-semibold'>
							{getInitials(interest.name)}
						</span>
					</div>
					<div>
						<p className='text-foreground font-semibold'>{interest.name}</p>
						<div className='text-muted-foreground mt-1 flex items-center space-x-2 text-sm'>
							<Calendar className='h-4 w-4' />
							<span>{new Date(interest.date).toLocaleDateString('vi-VN')}</span>
							{activeTab === 'completed' && (
								<div className='ml-2 flex items-center space-x-1'>
									<CheckCircle className='text-chart-1 h-4 w-4' />
									<span className='text-chart-1 font-medium'>Hoàn thành</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<div className='flex space-x-2'>
					<button
						className='border-border hover:bg-muted rounded-xl border p-3 transition-all duration-200'
						aria-label='Xem bài đăng'
					>
						<FileText className='text-muted-foreground h-5 w-5' />
					</button>

					<button
						className={`text-primary-foreground rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl ${
							activeTab === 'active' ? 'bg-chart-1' : 'bg-primary'
						}`}
						onClick={() => setShowChat(!showChat)}
						aria-label='Chat'
					>
						<MessageCircle className='h-5 w-5' />
					</button>
				</div>
			</div>

			<AnimatePresence>
				{showChat && (
					<ChatArea
						userName={interest.name}
						postTitle={postTitle}
						onClose={() => setShowChat(false)}
						activeTab={activeTab}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}
