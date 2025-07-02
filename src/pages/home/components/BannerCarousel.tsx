import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Calendar, Heart, MapPin, User } from 'lucide-react'
import { Link } from 'react-router-dom'

import Carousel from '@/components/common/Carousel'
import { formatDateTimeVN } from '@/lib/utils'
import { BANNER_CAROUSEL_SOURCE } from '@/models/constants'

const BannerCarousel: React.FC = () => {
	return (
		<div className='relative h-[600px]'>
			<Carousel
				distance='px-0'
				autoplay={true}
				itemHeight='h-[600px]'
				slidesToShow={1}
				leftDistance='left-5'
				rightDistance='right-5'
			>
				{BANNER_CAROUSEL_SOURCE.map((banner, index) => (
					<Link
						to={banner.link}
						key={banner.id || index}
						className='group relative'
					>
						{/* Background Image */}
						<img
							src={banner.url}
							alt={banner.name}
							className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
						/>

						{/* Gradient Overlay */}
						<div className='absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent'></div>

						{/* Content Container */}
						<div className='absolute inset-0 flex flex-col justify-center px-12 lg:px-20'>
							<div className='max-w-2xl text-white'>
								{/* Badges Row */}
								<div className='mb-4 flex flex-wrap items-center gap-3'>
									{banner.icon && <banner.icon className='h-5 w-5' />}
									<span className='bg-primary/90 text-primary-foreground rounded-full px-4 py-2 text-sm font-medium'>
										{banner.badge}
									</span>
								</div>

								{/* Main Title */}
								<h1 className='mb-4 line-clamp-2 text-3xl leading-tight font-bold lg:text-5xl'>
									{banner.title}
								</h1>

								{/* Event Info */}
								<div className='mb-4 flex flex-wrap items-center gap-4 text-gray-200'>
									{banner.organizer && (
										<div className='flex items-center gap-2'>
											<User className='h-4 w-4' />
											<span className='text-sm'>{banner.organizer}</span>
										</div>
									)}
									{banner.startDate && (
										<div className='flex items-center gap-2'>
											<Calendar className='h-4 w-4' />
											<span className='text-sm'>
												{formatDateTimeVN(banner.startDate, false)}
												{banner.endDate &&
													banner.endDate !== banner.startDate &&
													` - ${formatDateTimeVN(banner.endDate, false)}`}
											</span>
										</div>
									)}
									{banner.location && (
										<div className='flex items-center gap-2'>
											<MapPin className='h-4 w-4' />
											<span className='line-clamp-1 text-sm'>
												{banner.location}
											</span>
										</div>
									)}
								</div>

								{/* Subtitle/Description */}
								<p className='mb-6 line-clamp-3 text-base leading-relaxed text-gray-200 lg:text-lg'>
									{banner.subtitle}
								</p>

								{/* CTA Button */}
								<button className='bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg'>
									{banner.ctaText}
									<Heart className='h-5 w-5' />
								</button>
							</div>
						</div>

						{/* Decorative Elements */}
						<div className='absolute top-10 right-10 opacity-20'>
							<div className='h-32 w-32 animate-pulse rounded-full border-2 border-white'></div>
						</div>
						<div className='absolute right-20 bottom-20 opacity-10'>
							<div className='h-20 w-20 animate-bounce rounded-full bg-white'></div>
						</div>
					</Link>
				))}
			</Carousel>
		</div>
	)
}

export default BannerCarousel
