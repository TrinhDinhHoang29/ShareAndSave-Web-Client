import { ExternalLink } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

import { SUB_BANNER_SOURCE } from '@/models/constants'

const SubBannerView: React.FC = () => {
	return (
		<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
			{SUB_BANNER_SOURCE.map((banner, index) => (
				<div
					key={index}
					className='group glass relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg'
				>
					{/* Banner Image */}
					<div className='relative aspect-[2/1] overflow-hidden'>
						<img
							src={banner.url}
							alt={banner.name}
							className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
							loading='lazy'
						/>

						{/* Overlay */}
						<div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100' />

						{/* Link Icon */}
						<div className='absolute top-3 right-3 flex h-8 w-8 translate-y-2 transform items-center justify-center rounded-full bg-white/20 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
							<ExternalLink className='h-4 w-4 text-white' />
						</div>
					</div>

					{/* Banner Info */}
					<div className='p-4'>
						<h3 className='text-card-foreground group-hover:text-primary font-semibold transition-colors duration-200'>
							{banner.name}
						</h3>
						<p className='text-muted-foreground mt-1 text-sm'>
							Nhấn để xem chi tiết
						</p>
					</div>

					{/* Click Area */}
					<Link
						to={banner.link}
						className='absolute inset-0 z-10'
						aria-label={`Xem ${banner.name}`}
					/>
				</div>
			))}
		</div>
	)
}

export default SubBannerView
