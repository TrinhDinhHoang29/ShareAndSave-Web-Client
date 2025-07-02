import { ExternalLink } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { EPostType, ESortOrder } from '@/models/enums'

import SubBannerViewSkeleton from './SubBannerViewSkeleton'

const SubBannerView: React.FC = () => {
	const { data, isLoading } = useListPostQuery({
		limit: 10,
		type: EPostType.CAMPAIGN,
		sort: 'createdAt',
		order: ESortOrder.DESC
	})

	// Show skeleton while loading
	if (isLoading) {
		return <SubBannerViewSkeleton quantity={4} />
	}

	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
			{data &&
				data.posts.slice(0, 4).map((banner, index) => (
					<div
						key={index}
						className='group glass relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg'
					>
						{/* Banner Image Container */}
						<div className='relative aspect-[2/1] overflow-hidden'>
							<img
								src={banner.images[0]}
								alt={banner.title}
								className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
								loading='lazy'
							/>

							{/* Light overlay for better image visibility */}
							<div className='absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/40' />

							{/* Content - Hidden by default, shown on hover */}
							<div className='absolute inset-0 flex translate-y-4 transform flex-col justify-end p-6 text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
								<div className='-m-2 rounded-lg bg-black/20 p-4 backdrop-blur-sm'>
									<h3 className='mb-2 text-xl font-bold drop-shadow-lg'>
										{banner.title}
									</h3>
									<p className='mb-3 line-clamp-2 text-sm text-white/90 drop-shadow-md'>
										{banner.description || 'Nhấn để xem chi tiết'}
									</p>

									{/* Action Button */}
									<div className='flex items-center gap-2 text-sm font-medium'>
										<span>Xem thêm</span>
										<ExternalLink className='h-4 w-4' />
									</div>
								</div>
							</div>
						</div>

						{/* Click Area */}
						<Link
							to={'/bai-dang/' + banner.slug}
							className='absolute inset-0 z-10'
							aria-label={`Xem chi tiết: ${banner.title}`}
						/>
					</div>
				))}
		</div>
	)
}

export default SubBannerView
