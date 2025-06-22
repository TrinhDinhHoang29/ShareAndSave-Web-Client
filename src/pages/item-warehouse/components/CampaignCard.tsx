import { motion } from 'framer-motion'
import React, { useState } from 'react'

import { formatDateTimeVN } from '@/lib/utils'
import { ICampaign } from '@/models/interfaces'

interface CampaignCardProps {
	campaign: ICampaign
	onClick?: (campaign: any) => void
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onClick }) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [imageError, setImageError] = useState(false)

	const handleToggleDescription = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsExpanded(!isExpanded)
	}

	const handleCardClick = () => {
		onClick?.(campaign)
	}

	const getProgressPercentage = () => {
		return Math.min((campaign.collectedItems / campaign.targetItems) * 100, 100)
	}

	const getStatusBadge = () => {
		const statusConfig = {
			active: {
				label: 'Đang diễn ra',
				color: 'bg-success text-success-foreground'
			},
			upcoming: { label: 'Sắp diễn ra', color: 'bg-warning text-white' },
			completed: {
				label: 'Đã kết thúc',
				color: 'bg-secondary text-secondary-foreground'
			}
		}

		return statusConfig[campaign.status]
	}

	const truncateText = (text: string, maxLength: number = 120) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	const statusBadge = getStatusBadge()

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -6, transition: { duration: 0.3 } }}
			className='bg-card border-border group cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-lg'
			onClick={handleCardClick}
		>
			{/* Image Section */}
			<div className='bg-muted relative h-56 overflow-hidden'>
				{!imageError ? (
					<img
						src={campaign.image}
						alt={campaign.title}
						className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
						onError={() => setImageError(true)}
					/>
				) : (
					<div className='from-primary/10 to-accent/10 flex h-full w-full items-center justify-center bg-gradient-to-br'>
						<div className='text-muted-foreground text-center'>
							<div className='bg-primary/20 mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full'>
								<svg
									className='text-primary h-10 w-10'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1.5}
										d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
									/>
								</svg>
							</div>
							<p className='text-sm font-medium'>Chiến dịch tình nguyện</p>
						</div>
					</div>
				)}

				{/* Status Badge */}
				<div className='absolute top-4 left-4'>
					<span
						className={`rounded-full px-3 py-1.5 text-xs font-semibold ${statusBadge.color} backdrop-blur-sm`}
					>
						{statusBadge.label}
					</span>
				</div>

				{/* Participants Badge */}
				<div className='absolute top-4 right-4'>
					<div className='bg-card/90 text-card-foreground border-border flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium backdrop-blur-sm'>
						<svg
							className='h-3 w-3'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
							/>
						</svg>
						{campaign.participants}
					</div>
				</div>

				{/* Progress Overlay */}
				<div className='absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4'>
					<div className='text-white'>
						<div className='mb-1 flex justify-between text-xs'>
							<span>Tiến độ thu thập</span>
							<span>
								{campaign.collectedItems}/{campaign.targetItems}
							</span>
						</div>
						<div className='h-2 w-full rounded-full bg-white/30'>
							<motion.div
								className='bg-success h-2 rounded-full'
								initial={{ width: 0 }}
								animate={{ width: `${getProgressPercentage()}%` }}
								transition={{ duration: 1, delay: 0.5 }}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Content Section */}
			<div className='space-y-4 p-5'>
				{/* Title */}
				<h3 className='text-card-foreground group-hover:text-primary text-lg leading-tight font-bold transition-colors'>
					{campaign.title}
				</h3>

				{/* Categories */}
				<div className='flex flex-wrap gap-2'>
					{campaign.categories.slice(0, 3).map((category, index) => (
						<span
							key={index}
							className='bg-accent/20 text-accent-foreground rounded-md px-2 py-1 text-xs font-medium'
						>
							{category}
						</span>
					))}
					{campaign.categories.length > 3 && (
						<span className='text-muted-foreground px-2 py-1 text-xs'>
							+{campaign.categories.length - 3} khác
						</span>
					)}
				</div>

				{/* Info Grid */}
				<div className='grid grid-cols-2 gap-4 text-sm'>
					<div className='space-y-2'>
						<div className='text-muted-foreground flex items-center gap-2'>
							<svg
								className='h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1.5}
									d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
							<span className='text-xs'>Thời gian</span>
						</div>
						<p className='text-card-foreground text-xs font-medium'>
							{formatDateTimeVN(campaign.startDate, false)} -{' '}
							{formatDateTimeVN(campaign.endDate, false)}
						</p>
					</div>

					<div className='space-y-2'>
						<div className='text-muted-foreground flex items-center gap-2'>
							<svg
								className='h-4 w-4'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1.5}
									d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
								/>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={1.5}
									d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
								/>
							</svg>
							<span className='text-xs'>Địa điểm</span>
						</div>
						<p className='text-card-foreground line-clamp-2 text-xs font-medium'>
							{campaign.location}
						</p>
					</div>
				</div>

				{/* Organizer */}
				<div className='flex items-center gap-2 text-sm'>
					<div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
						<svg
							className='text-primary h-4 w-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
							/>
						</svg>
					</div>
					<div>
						<p className='text-muted-foreground text-xs'>Tổ chức bởi</p>
						<p className='text-card-foreground text-xs font-medium'>
							{campaign.organizer}
						</p>
					</div>
				</div>

				{/* Description */}
				<div className='space-y-2'>
					<motion.p
						className={`text-muted-foreground text-sm leading-relaxed ${
							!isExpanded ? 'line-clamp-3' : ''
						}`}
						initial={false}
						animate={{ height: 'auto' }}
					>
						{isExpanded
							? campaign.description
							: truncateText(campaign.description)}
					</motion.p>

					{campaign.description.length > 120 && (
						<button
							onClick={handleToggleDescription}
							className='text-primary hover:text-primary/80 flex items-center gap-1 text-xs font-medium transition-colors'
						>
							{isExpanded ? (
								<>
									Thu gọn
									<svg
										className='h-3 w-3'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M5 15l7-7 7 7'
										/>
									</svg>
								</>
							) : (
								<>
									Xem thêm
									<svg
										className='h-3 w-3'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M19 9l-7 7-7-7'
										/>
									</svg>
								</>
							)}
						</button>
					)}
				</div>
			</div>
		</motion.div>
	)
}

export default CampaignCard
