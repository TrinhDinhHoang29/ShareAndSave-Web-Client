import { motion } from 'framer-motion'
import { Calendar, Eye, Heart, Package, Tag, User } from 'lucide-react'
import React from 'react'

import { IPost } from '@/models/interfaces'

interface PostItemProps {
	post: IPost
	onPostClick?: (slug: string) => void
}

const PostItem: React.FC<PostItemProps> = ({ post, onPostClick }) => {
	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('vi-VN', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
		} catch {
			return dateString
		}
	}

	const truncateText = (text: string, maxLength: number) => {
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
	}

	const getTypeInfo = (type: number) => {
		switch (type) {
			case 1:
				return {
					label: 'Cho tặng đồ cũ',
					color:
						'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
				}
			case 2:
				return {
					label: 'Tìm thấy đồ',
					color:
						'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
				}
			case 3:
				return {
					label: 'Tìm đồ bị mất',
					color:
						'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
				}
			case 4:
				return {
					label: 'Khác',
					color:
						'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
				}
			default:
				return {
					label: 'Khác',
					color:
						'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
				}
		}
	}

	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className='group bg-card border-border/50 relative cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-lg'
			onClick={() => onPostClick?.(post.slug)}
		>
			{/* Header với hình ảnh nếu có */}
			{post.images && post.images.length > 0 && (
				<div className='relative aspect-video overflow-hidden'>
					<img
						src={post.images[0]}
						alt={post.title}
						className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
						onError={e => {
							e.currentTarget.style.display = 'none'
						}}
					/>
					{/* Hiển thị số lượng ảnh nếu có nhiều hơn 1 */}
					{post.images.length > 1 && (
						<div className='absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white'>
							<svg
								className='h-3 w-3'
								fill='currentColor'
								viewBox='0 0 20 20'
							>
								<path
									fillRule='evenodd'
									d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
									clipRule='evenodd'
								/>
							</svg>
							{post.images.length}
						</div>
					)}
				</div>
			)}

			{/* Content */}
			<div className='p-6'>
				{/* Title */}
				<h3 className='text-foreground group-hover:text-primary mb-3 line-clamp-2 text-xl font-semibold transition-colors'>
					{post.title}
				</h3>

				{/* Description */}
				<p className='text-muted-foreground mb-4 line-clamp-3 text-sm leading-relaxed'>
					{truncateText(post.description || post.content, 150)}
				</p>

				{/* Author & Date */}
				<div className='text-muted-foreground mb-4 flex items-center justify-between text-sm'>
					<div className='flex items-center gap-2'>
						<User className='h-4 w-4' />
						<span>{post.authorName}</span>
					</div>
					<div className='flex items-center gap-2'>
						<Calendar className='h-4 w-4' />
						<span>{formatDate(post.createdAt)}</span>
					</div>
				</div>

				{/* Stats & Type */}
				<div className='flex items-center justify-between'>
					<div className='text-muted-foreground flex items-center gap-4 text-sm'>
						<div className='flex items-center gap-1'>
							<Heart className='h-4 w-4' />
							<span>{post.interestCount}</span>
						</div>
						<div className='flex items-center gap-1'>
							<Package className='h-4 w-4' />
							<span>{post.itemCount}</span>
						</div>
					</div>

					<div className='flex items-center gap-2'>
						<span
							className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeInfo(post.type).color}`}
						>
							{getTypeInfo(post.type).label}
						</span>
					</div>
				</div>
			</div>

			{/* Hover overlay */}
			<div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />
		</motion.article>
	)
}

export default PostItem
