import React from 'react'

const UserInfoCardSkeleton: React.FC = () => {
	return (
		<div className='bg-card border-border/50 animate-pulse rounded-xl border shadow-sm'>
			<div className='p-6'>
				{/* User Info */}
				<div className='mb-6 flex items-center gap-4'>
					<div className='bg-muted flex h-12 w-12 items-center justify-center rounded-full' />
					<div className='space-y-2'>
						<div className='bg-muted h-6 w-32 rounded' />
						<div className='bg-muted h-4 w-24 rounded' />
					</div>
				</div>

				<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
					<div className='neumorphic rounded-lg p-4 text-center'>
						<div className='bg-muted mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full' />
						<div className='bg-muted mx-auto mb-1 h-4 w-20 rounded' />
						<div className='bg-muted mx-auto h-6 w-12 rounded' />
					</div>
					<div className='neumorphic rounded-lg p-4 text-center'>
						<div className='bg-muted mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full' />
						<div className='bg-muted mx-auto mb-1 h-4 w-20 rounded' />
						<div className='bg-muted mx-auto h-6 w-12 rounded' />
					</div>
					<div className='neumorphic rounded-lg p-4 text-center'>
						<div className='bg-muted mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full' />
						<div className='bg-muted mx-auto mb-1 h-4 w-20 rounded' />
						<div className='bg-muted mx-auto h-6 w-12 rounded' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserInfoCardSkeleton
