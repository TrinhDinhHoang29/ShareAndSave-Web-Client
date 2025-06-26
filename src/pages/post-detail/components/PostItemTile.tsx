import { motion } from 'framer-motion'
import { Heart, Package } from 'lucide-react'
import React from 'react'

import TriangleCornerBadge from '@/components/common/TriangleCornerBadge'
import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'
import { IPost } from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

interface PostItemTileProps {
	post: IPost
	onPostClick?: (slug: string) => void
}

const PostItemTile: React.FC<PostItemTileProps> = ({ post, onPostClick }) => {
	const { label, Icon, color } = getTypeInfo(post.type.toString() as EPostType)

	// Variants cho animation
	const itemVariants = {
		initial: { opacity: 0, y: 20 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: 'easeOut' }
		},
		hover: { scale: 1.01, transition: { duration: 0.2 } },
		tap: { scale: 0.98, transition: { duration: 0.1 } }
	}

	const imageVariants = {
		hover: { scale: 1.05, transition: { duration: 0.3 } }
	}

	const { user } = useAuthStore()

	const isMyPost = user?.id === post.authorID

	return (
		<motion.div
			variants={itemVariants}
			initial='initial'
			animate='animate'
			whileHover='hover'
			whileTap='tap'
			className='bg-card border-border relative cursor-pointer overflow-hidden rounded-xl border shadow-sm transition-all duration-200 hover:shadow-md'
			onClick={() => onPostClick?.(post.slug)}
		>
			{isMyPost && <TriangleCornerBadge position='left' />}
			<div className='flex'>
				{/* Image Section - Left Side */}
				<motion.div
					className='relative h-24 w-24 flex-shrink-0'
					variants={imageVariants}
					whileHover='hover'
				>
					{post.images && post.images.length > 0 ? (
						<>
							<motion.img
								src={post.images[0]}
								alt={post.title}
								className='h-full w-full object-cover'
								onError={e => {
									e.currentTarget.style.display = 'none'
								}}
								initial={{ opacity: 0 }}
								animate={{ opacity: 1, transition: { duration: 0.5 } }}
							/>
							{/* Image count badge */}
							{post.images.length > 1 && (
								<div className='absolute right-1 bottom-1 rounded-md bg-black/70 px-1.5 py-0.5 text-xs text-white'>
									{post.images.length}
								</div>
							)}
						</>
					) : (
						<div className='bg-muted flex h-full w-full items-center justify-center'>
							<Package className='text-muted-foreground h-8 w-8' />
						</div>
					)}
				</motion.div>

				{/* Content Section - Right Side */}
				<div className='min-w-0 flex-1 p-3'>
					{/* Title */}
					<motion.h3
						className='text-foreground mb-1 line-clamp-2 truncate text-sm leading-tight font-semibold'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1, transition: { duration: 0.3 } }}
						whileHover={{ color: '#3366FF' }} // Hover effect trên title
					>
						{post.title}
					</motion.h3>

					{/* Stats and Type Row */}
					<div className='flex items-center justify-between'>
						{/* Author */}
						<motion.p
							className='text-muted-foreground mb-2 text-xs'
							initial={{ opacity: 0 }}
							animate={{
								opacity: 1,
								transition: { delay: 0.3, duration: 0.5 }
							}}
						>
							{post.authorName}
						</motion.p>
						<div className='flex items-center space-x-3'>
							{/* Heart with count */}
							<motion.div
								className='flex items-center space-x-1'
								initial={{ opacity: 0, x: -10 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { delay: 0.4, duration: 0.5 }
								}}
								whileHover={{ scale: 1.1 }}
							>
								<Heart className='text-destructive h-3.5 w-3.5' />
								<span className='text-muted-foreground text-xs'>
									{post.interestCount}
								</span>
							</motion.div>

							<motion.div
								className='flex items-center space-x-1'
								initial={{ opacity: 0, x: 10 }}
								animate={{
									opacity: 1,
									x: 0,
									transition: { delay: 0.5, duration: 0.5 }
								}}
								whileHover={{ scale: 1.1 }}
							>
								<Package className='text-primary h-3.5 w-3.5' />
								<span className='text-muted-foreground text-xs'>
									{post.itemCount}
								</span>
							</motion.div>
						</div>
					</div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{
							opacity: 1,
							y: 0,
							transition: { delay: 0.6, duration: 0.5 }
						}}
					>
						<span
							className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${color}`}
						>
							<Icon className='h-4 w-4' />
							{label}
						</span>
					</motion.div>
				</div>
			</div>

			{/* Hover overlay */}
			<motion.div
				className='bg-accent/10 pointer-events-none absolute inset-0 opacity-0'
				initial={{ opacity: 0 }}
				whileHover={{ opacity: 1, transition: { duration: 0.2 } }}
			/>
		</motion.div>
	)
}

export default PostItemTile
