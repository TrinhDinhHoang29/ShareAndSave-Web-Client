import React from 'react'

interface ItemWarehouseCardSkeletonProps {
	quantity: number
}

const ItemWarehouseCardSkeleton: React.FC<ItemWarehouseCardSkeletonProps> = ({
	quantity = 3
}) => {
	const skeletonItems = Array.from({ length: quantity }, (_, index) => index)

	return skeletonItems.map(index => (
		<div
			className='bg-card border-border animate-pulse overflow-hidden rounded-lg border shadow-sm'
			key={index}
		>
			{/* Image Section Skeleton */}
			<div className='bg-muted relative h-48'>
				<div className='shimmer h-full w-full'></div>

				{/* Category Badge Skeleton */}
				<div className='absolute top-3 left-3'>
					<div className='bg-muted/80 h-6 w-20 rounded-full'></div>
				</div>

				{/* Quantity Badge Skeleton */}
				<div className='absolute top-3 right-3'>
					<div className='bg-muted/80 h-6 w-16 rounded-full'></div>
				</div>
			</div>

			{/* Content Section Skeleton */}
			<div className='space-y-3 p-4'>
				{/* Item Name Skeleton */}
				<div className='space-y-2'>
					<div className='bg-muted h-5 w-3/4 rounded'></div>
					<div className='bg-muted h-5 w-1/2 rounded'></div>
				</div>

				{/* Stats Skeleton */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2'>
						<div className='bg-muted h-4 w-4 rounded'></div>
						<div className='bg-muted h-4 w-20 rounded'></div>
					</div>
					<div className='bg-muted h-3 w-12 rounded'></div>
				</div>

				{/* Description Skeleton */}
				<div className='space-y-2'>
					<div className='bg-muted h-4 w-full rounded'></div>
					<div className='bg-muted h-4 w-4/5 rounded'></div>
					<div className='bg-muted mt-2 h-3 w-16 rounded'></div>
				</div>
			</div>
		</div>
	))
}

export default ItemWarehouseCardSkeleton
