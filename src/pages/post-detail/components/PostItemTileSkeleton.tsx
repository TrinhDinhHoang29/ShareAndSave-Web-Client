import React from 'react'

interface PostItemTileSkeletonProps {
	quantity: number
}

const PostItemTileSkeleton: React.FC<PostItemTileSkeletonProps> = ({
	quantity
}) => {
	const skeletonItems = Array.from({ length: quantity }, (_, index) => index)

	return (
		<>
			{skeletonItems.map(index => (
				<div
					key={index}
					className={`bg-card border-border/50 animate-pulse rounded-xl border shadow-sm`}
				>
					<div className='flex'>
						{/* Image Section Skeleton - Left Side */}
						<div className='bg-muted h-24 w-24 flex-shrink-0 rounded-l-xl' />

						{/* Content Section Skeleton - Right Side */}
						<div className='min-w-0 flex-1 p-3'>
							{/* Title Skeleton */}
							<div className='mb-2'>
								<div className='bg-muted mb-1 h-4 w-4/5 rounded' />
								<div className='bg-muted h-4 w-3/5 rounded' />
							</div>

							{/* Stats and Type Row Skeleton */}
							<div className='mb-2 flex items-center justify-between'>
								{/* Author Skeleton */}
								<div className='bg-muted h-3 w-16 rounded' />

								{/* Stats Skeleton */}
								<div className='flex items-center space-x-3'>
									{/* Heart with count skeleton */}
									<div className='flex items-center space-x-1'>
										<div className='bg-muted h-3.5 w-3.5 rounded' />
										<div className='bg-muted h-3 w-4 rounded' />
									</div>

									{/* Package with count skeleton */}
									<div className='flex items-center space-x-1'>
										<div className='bg-muted h-3.5 w-3.5 rounded' />
										<div className='bg-muted h-3 w-4 rounded' />
									</div>
								</div>
							</div>

							{/* Type Badge Skeleton */}
							<div className='bg-muted h-6 w-20 rounded-full' />
						</div>
					</div>
				</div>
			))}
		</>
	)
}

export default PostItemTileSkeleton
