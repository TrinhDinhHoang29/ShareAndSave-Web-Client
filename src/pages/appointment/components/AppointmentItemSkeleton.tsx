import React from 'react'

interface AppointmentItemSkeletonProps {
	quantity: number
}

const AppointmentItemSkeleton: React.FC<AppointmentItemSkeletonProps> = ({
	quantity
}) => {
	const skeletonItems = Array.from({ length: quantity }, (_, index) => index)

	return (
		<>
			{skeletonItems.map(index => (
				<div
					key={index}
					className='bg-card border-border glass animate-pulse space-y-4 rounded-xl border p-6 shadow-sm'
				>
					{/* Header Section Skeleton */}
					<div className='flex items-start justify-between'>
						<div className='flex items-center space-x-3'>
							{/* Avatar Skeleton */}
							<div className='bg-muted flex h-12 w-12 items-center justify-center rounded-full'>
								<div className='bg-muted-foreground/20 h-6 w-6 rounded'></div>
							</div>
							<div>
								{/* User Name Skeleton */}
								<div className='bg-muted mb-1 h-5 w-32 rounded'></div>
								{/* ID Skeleton */}
								<div className='bg-muted h-4 w-16 rounded'></div>
							</div>
						</div>

						{/* Status Badge Skeleton */}
						<div className='bg-muted h-6 w-20 rounded-full'></div>
					</div>

					{/* Date and Time Section Skeleton */}
					<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
						{/* Date Skeleton */}
						<div className='flex items-center space-x-2'>
							<div className='bg-muted h-4 w-4 rounded'></div>
							<div className='bg-muted h-4 w-24 rounded'></div>
						</div>
						{/* Time Skeleton */}
						<div className='flex items-center space-x-2'>
							<div className='bg-muted h-4 w-4 rounded'></div>
							<div className='bg-muted h-4 w-32 rounded'></div>
						</div>
					</div>

					{/* Items Info Section Skeleton */}
					<div className='flex items-center justify-between gap-2'>
						{/* Total Items Skeleton */}
						<div className='flex items-center space-x-2'>
							<div className='bg-muted h-4 w-4 rounded'></div>
							<div className='bg-muted h-4 w-20 rounded'></div>
						</div>

						{/* Missing Items Skeleton (conditional) */}
						<div className='flex items-center space-x-2'>
							<div className='bg-muted h-4 w-4 rounded'></div>
							<div className='bg-muted h-4 w-24 rounded'></div>
						</div>
					</div>

					{/* Action Buttons Section Skeleton */}
					<div className='flex items-center justify-end gap-2'>
						{/* View Details Button Skeleton */}
						<div className='bg-muted h-9 w-24 rounded-lg'></div>
						{/* Update Status Button Skeleton */}
						<div className='bg-muted h-9 w-20 rounded-lg'></div>
					</div>
				</div>
			))}
		</>
	)
}

export default AppointmentItemSkeleton
