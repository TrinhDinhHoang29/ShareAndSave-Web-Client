import React from 'react'

interface PostItemSkeletonProps {
	quantity: number
}

const PostItemSkeleton: React.FC<PostItemSkeletonProps> = ({ quantity }) => {
	const skeletonItems = Array.from({ length: quantity }, (_, index) => index)
	return skeletonItems.map(index => (
		<div
			key={index}
			className='bg-card border-border/50 animate-pulse rounded-xl border shadow-sm'
		>
			<div className='bg-muted aspect-video rounded-t-xl' />
			<div className='p-6'>
				<div className='bg-muted mb-4 h-6 rounded' />
				<div className='bg-muted mb-4 h-4 rounded' />
				<div className='bg-muted mb-4 h-4 w-3/4 rounded' />
				<div className='flex justify-between'>
					<div className='bg-muted h-4 w-1/3 rounded' />
					<div className='bg-muted h-4 w-1/3 rounded' />
				</div>
			</div>
		</div>
	))
}

export default PostItemSkeleton
