import React from 'react'

interface SubBannerViewSkeletonProps {
	quantity: number
}

const SubBannerViewSkeleton: React.FC<SubBannerViewSkeletonProps> = ({
	quantity
}) => {
	const skeletonItems = Array.from({ length: quantity }, (_, index) => index)

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
			{skeletonItems.map(index => (
				<div
					key={index}
					className='group glass relative animate-pulse overflow-hidden rounded-lg'
				>
					{/* Banner Image Skeleton */}
					<div className='relative aspect-[2/1] overflow-hidden'>
						<div className='bg-muted h-full w-full' />

						{/* Overlay Skeleton */}
						<div className='absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent' />

						{/* Content Skeleton - Hidden by default, shown on hover */}
						<div className='absolute inset-0 flex flex-col justify-end p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
							<div className='space-y-2'>
								<div className='h-6 w-3/4 rounded bg-white/20 backdrop-blur-sm' />
								<div className='h-4 w-full rounded bg-white/20 backdrop-blur-sm' />
								<div className='h-4 w-2/3 rounded bg-white/20 backdrop-blur-sm' />
								<div className='mt-3 h-4 w-1/3 rounded bg-white/20 backdrop-blur-sm' />
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	)
}

export default SubBannerViewSkeleton
