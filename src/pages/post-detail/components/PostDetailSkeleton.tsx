import React from 'react'

import PostItemTileSkeleton from './PostItemTileSkeleton'

const PostDetailSkeleton: React.FC = () => {
	return (
		<div className='container mx-auto grid w-full grid-cols-1 gap-6 py-12 md:grid-cols-3'>
			<div className='col-span-1 md:col-span-2'>
				<div className='bg-card border-border relative rounded-xl border p-8 shadow-lg'>
					{/* Type Badge */}
					<div className='mb-4 flex items-center gap-4'>
						<div className='bg-muted h-8 w-24 animate-pulse rounded-full' />
						<div className='bg-muted h-8 w-20 animate-pulse rounded-full' />
						<div className='bg-muted h-8 w-16 animate-pulse rounded-full' />
					</div>

					{/* Title */}
					<div className='mb-6 space-y-2'>
						<div className='bg-muted h-8 w-3/4 animate-pulse rounded' />
						<div className='bg-muted h-8 w-1/2 animate-pulse rounded' />
					</div>

					{/* Meta Info */}
					<div className='mb-8 flex flex-wrap items-center gap-6'>
						<div className='bg-muted h-4 w-32 animate-pulse rounded' />
						<div className='bg-muted h-4 w-40 animate-pulse rounded' />
					</div>

					<div className='gap-8 space-y-6'>
						{/* Main Content */}
						<div className='space-y-8'>
							{/* Images */}
							<div className='space-y-4'>
								<div className='bg-muted aspect-video animate-pulse rounded-xl' />

								{/* Image Thumbnails */}
								<div className='flex gap-2 overflow-x-auto pb-2'>
									{Array.from({ length: 4 }, (_, index) => (
										<div
											key={index}
											className='bg-muted h-20 w-20 flex-shrink-0 animate-pulse rounded-lg'
										/>
									))}
								</div>
							</div>

							{/* Description */}
							<div className='space-y-4'>
								<div className='bg-muted h-6 w-24 animate-pulse rounded' />
								<div className='space-y-2'>
									<div className='bg-muted h-4 w-full animate-pulse rounded' />
									<div className='bg-muted h-4 w-5/6 animate-pulse rounded' />
									<div className='bg-muted h-4 w-4/5 animate-pulse rounded' />
									<div className='bg-muted h-4 w-3/4 animate-pulse rounded' />
								</div>
							</div>

							{/* Specific Info */}
							<div className='space-y-4'>
								<div className='bg-muted h-6 w-32 animate-pulse rounded' />
								<div className='bg-accent/30 space-y-3 rounded-lg p-4'>
									{Array.from({ length: 3 }, (_, index) => (
										<div
											key={index}
											className='flex items-center gap-2'
										>
											<div className='bg-muted h-4 w-4 animate-pulse rounded' />
											<div className='bg-muted h-4 w-20 animate-pulse rounded' />
											<div className='bg-muted h-4 w-32 animate-pulse rounded' />
										</div>
									))}
								</div>
							</div>

							{/* Items List */}
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div className='bg-muted h-6 w-48 animate-pulse rounded' />
									<div className='bg-muted h-4 w-24 animate-pulse rounded' />
								</div>
								<div className='grid gap-4'>
									{Array.from({ length: 5 }, (_, index) => (
										<div
											key={index}
											className='border-border flex items-center gap-4 rounded-lg border p-4'
										>
											<div className='bg-muted h-16 w-16 flex-shrink-0 animate-pulse rounded-lg' />
											<div className='flex min-w-0 flex-1 items-center justify-between'>
												<div className='space-y-2'>
													<div className='bg-muted h-4 w-32 animate-pulse rounded' />
													<div className='bg-muted h-3 w-24 animate-pulse rounded' />
												</div>
												<div className='flex items-center gap-2'>
													<div className='bg-muted h-6 w-12 animate-pulse rounded-full' />
													<div className='bg-muted h-6 w-16 animate-pulse rounded-full' />
												</div>
											</div>
										</div>
									))}
								</div>
							</div>

							{/* Tags */}
							<div className='space-y-4'>
								<div className='bg-muted h-6 w-20 animate-pulse rounded' />
								<div className='flex flex-wrap gap-2'>
									{Array.from({ length: 6 }, (_, index) => (
										<div
											key={index}
											className='bg-muted h-6 w-16 animate-pulse rounded-full'
										/>
									))}
								</div>
							</div>

							{/* Interested Users */}
							<div className='space-y-4'>
								<div className='flex items-center justify-between'>
									<div className='bg-muted h-6 w-48 animate-pulse rounded' />
									<div className='bg-muted h-8 w-20 animate-pulse rounded-lg' />
								</div>
								<div className='glass grid grid-cols-8 rounded-xl p-6'>
									{Array.from({ length: 8 }, (_, index) => (
										<div
											key={index}
											className='flex flex-col items-center gap-2 p-2'
										>
											<div className='bg-muted h-12 w-12 animate-pulse rounded-full' />
											<div className='bg-muted h-3 w-16 animate-pulse rounded' />
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Sidebar */}
			<div className='top-0 col-span-1 space-y-6 md:top-16'>
				{/* Related Posts */}
				<PostItemTileSkeleton quantity={5} />
			</div>
		</div>
	)
}

export default PostDetailSkeleton
