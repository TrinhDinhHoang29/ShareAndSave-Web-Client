import clsx from 'clsx'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { formatDateTimeVN } from '@/lib/utils'
import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'
import { IPost } from '@/models/interfaces'

interface CampaignCardProps {
	campaign: IPost
	onClick?: (campaign: IPost) => void
	className?: string
}

const CampaignCard: React.FC<CampaignCardProps> = ({
	campaign,
	onClick,
	className
}) => {
	const [imageError, setImageError] = useState(false)

	// Parse info JSON to get campaign details
	const getCampaignInfo = () => {
		try {
			return JSON.parse(campaign.info)
		} catch (error) {
			console.error('Error parsing campaign info:', error)
			return {}
		}
	}

	const campaignInfo = getCampaignInfo()

	const handleCardClick = () => {
		onClick?.(campaign)
	}

	const getProgressPercentage = () => {
		if (campaign.itemCount === 0) return 0 // Avoid division by zero
		return (
			((campaign.itemCount - campaign.currentItemCount) / campaign.itemCount) *
			100
		)
	}

	const getStatusBadge = () => {
		// Map status number to display text
		const statusConfig: Record<number, { label: string; color: string }> = {
			1: {
				label: 'Sắp diễn ra',
				color: 'bg-warning text-white'
			},
			2: {
				label: 'Đang diễn ra',
				color: 'bg-success text-success-foreground'
			},
			3: {
				label: 'Đã kết thúc',
				color: 'bg-secondary text-secondary-foreground'
			}
		}

		return statusConfig[campaign.status || 2] || statusConfig[2]
	}

	const truncateText = (text: string, maxLength: number = 120) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	const statusBadge = getStatusBadge()

	// Get main image from images array
	const mainImage =
		campaign.images && campaign.images.length > 0 ? campaign.images[0] : null

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -6, transition: { duration: 0.3 } }}
			className={clsx(
				'bg-card border-border group cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-lg',
				className
			)}
			onClick={handleCardClick}
		>
			{/* Image Section */}
			<div className='bg-muted relative h-56 overflow-hidden'>
				{mainImage && !imageError ? (
					<img
						src={mainImage}
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

				{/* Interest Count Badge */}
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
								d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
							/>
						</svg>
						{campaign.interestCount}
					</div>
				</div>

				{/* Progress Overlay */}
				<div className='absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/60 to-transparent p-4'>
					<div className='text-white'>
						<div className='mb-1 flex justify-between text-xs'>
							<span>Tiến độ thu thập</span>
							<span>
								{campaign.itemCount - campaign.currentItemCount}/
								{campaign.itemCount}
							</span>
						</div>
						<div className='h-2 w-full rounded-full bg-white/30'>
							<motion.div
								className='bg-primary h-2 rounded-full'
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

				{/* Tags */}
				<div className='flex flex-wrap gap-2'>
					{campaign.tags.slice(0, 3).map((tag, index) => (
						<span
							key={index}
							className='bg-accent/20 text-accent-foreground rounded-md px-2 py-1 text-xs font-medium'
						>
							{tag}
						</span>
					))}
					{campaign.tags.length > 3 && (
						<span className='text-muted-foreground px-2 py-1 text-xs'>
							+{campaign.tags.length - 3} khác
						</span>
					)}
				</div>

				{/* Info Grid */}
				<div className='grid grid-cols-2 gap-4 text-sm'>
					{campaignInfo.startDate && campaignInfo.endDate && (
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
								{formatDateTimeVN(campaignInfo.startDate, false)} -{' '}
								{formatDateTimeVN(campaignInfo.endDate, false)}
							</p>
						</div>
					)}

					{campaignInfo.location && (
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
								{campaignInfo.location}
							</p>
						</div>
					)}
				</div>

				{/* Organizer */}
				<div className='flex items-center gap-2 text-sm'>
					<div className='bg-primary/10 flex h-8 w-8 items-center justify-center overflow-hidden rounded-full'>
						{campaign.authorAvatar ? (
							<img
								src={campaign.authorAvatar}
								alt={campaign.authorName}
								className='h-full w-full object-cover'
							/>
						) : (
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
						)}
					</div>
					<div>
						<p className='text-muted-foreground text-xs'>
							{campaignInfo.organizer ? 'Tổ chức bởi' : 'Đăng bởi'}
						</p>
						<p className='text-card-foreground text-xs font-medium'>
							{campaignInfo.organizer || campaign.authorName}
						</p>
					</div>
				</div>

				{/* Description */}
				<div className='space-y-2'>
					<motion.p
						className={`text-muted-foreground line-clamp-3 text-sm leading-relaxed`}
						initial={false}
						animate={{ height: 'auto' }}
					>
						{truncateText(campaign.description)}
						{campaign.description.length > 120 && (
							<Link
								to={'#'}
								className='text-primary hover:text-primary/80 ml-2 inline text-xs font-medium transition-colors'
							>
								Xem thêm
							</Link>
						)}
					</motion.p>
				</div>

				{/* Created Date */}
				<div className='flex items-center justify-between'>
					<div className='text-muted-foreground text-xs'>
						Đăng ngày: {formatDateTimeVN(campaign.createdAt, false)}
					</div>
					<span
						className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeInfo(EPostType.CAMPAIGN).color}`}
					>
						{getTypeInfo(EPostType.CAMPAIGN).label}
					</span>
				</div>
			</div>
		</motion.div>
	)
}

export default CampaignCard
