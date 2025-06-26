import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { Link } from 'react-router-dom'

import Carousel from '@/components/common/Carousel'
import { BANNER_CAROUSEL_SOURCE } from '@/models/constants'

const BannerCarousel: React.FC = () => {
	return (
		<div className='relative'>
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
						key={index}
						className='relative'
					>
						<img
							src={banner.url}
							alt={banner.name}
							className='h-full w-full object-cover'
						/>
						<button className='bg-primary/80 text-primary-foreground absolute right-15 bottom-15 rounded-full px-10 py-5 text-xl'>
							Tìm hiểu ngay
						</button>
					</Link>
				))}
			</Carousel>
		</div>
	)
}

export default BannerCarousel
