import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Clock, Heart, Package, User } from 'lucide-react'
import React from 'react'

import { formatNearlyDateTimeVN } from '@/lib/utils'
import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'
import { IPost } from '@/models/interfaces'

interface PostItemProps {
	post: IPost
	onPostClick?: (slug: string) => void
	className?: string
}

const PostItem: React.FC<PostItemProps> = ({
	post,
	onPostClick,
	className
}) => {
	const truncateText = (text: string, maxLength: number) => {
		return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
	}
	return (
		<motion.article
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className={clsx(
				'group bg-card border-border/50 relative cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-300 hover:shadow-lg',
				className
			)}
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
				<div className='mb-4 flex items-center justify-between'>
					<div className='text-muted-foreground flex items-center gap-2 text-sm'>
						<Clock className='h-4 w-4' />
						<span>{formatNearlyDateTimeVN(post.createdAt)}</span>
					</div>
					<div className='text-muted-foreground flex items-center gap-2 text-sm'>
						<div className='flex items-center gap-1'>
							<Heart className='text-destructive h-4 w-4' />
							<span>{post.interestCount}</span>
						</div>
						{post.currentItemCount > 0 && (
							<div className='flex items-center gap-1'>
								<Package className='text-primary h-4 w-4' />
								<span>{post.currentItemCount}</span>
							</div>
						)}
					</div>
				</div>

				{/* Stats & Type */}
				<div className='flex items-center justify-between'>
					<div className='text-muted-foreground flex items-center gap-2 text-sm'>
						<User className='h-4 w-4' />
						<span>{post.authorName}</span>
					</div>

					<div className='flex items-center gap-2'>
						<span
							className={`rounded-full px-2 py-1 text-xs font-medium ${getTypeInfo(post.type.toString() as EPostType).color}`}
						>
							{getTypeInfo(post.type.toString() as EPostType).label}
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
