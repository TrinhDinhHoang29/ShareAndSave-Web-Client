import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ReactNode } from 'react'
import Slider from 'react-slick'

// Custom arrow components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
	<button
		onClick={onClick}
		className='bg-primary/90 hover:bg-primary absolute top-1/2 -left-10 z-10 -translate-y-1/2 rounded-full p-2 shadow-lg transition-all hover:shadow-xl'
	>
		<ChevronLeft className='text-primary-foreground h-6 w-6' />
	</button>
)

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
	<button
		onClick={onClick}
		className='bg-primary/90 hover:bg-primary absolute top-1/2 -right-10 z-10 -translate-y-1/2 rounded-full p-2 shadow-lg transition-all hover:shadow-xl'
	>
		<ChevronRight className='text-primary-foreground h-6 w-6' />
	</button>
)

interface CarouselProps {
	children: ReactNode[]
	slidesToShow?: number
	slidesToScroll?: number
	autoplay?: boolean
	autoplaySpeed?: number
	infinite?: boolean
	speed?: number
	arrows?: boolean
	dots?: boolean
	className?: string
	itemHeight?: string
	responsive?: Array<{
		breakpoint: number
		settings: {
			slidesToShow?: number
			slidesToScroll?: number
			arrows?: boolean
			dots?: boolean
		}
	}>
}

const Carousel = ({
	children,
	slidesToShow = 3,
	slidesToScroll = 1,
	autoplay = true,
	autoplaySpeed = 3000,
	infinite = true,
	speed = 500,
	arrows = true,
	dots = false,
	className = '',
	itemHeight = '450px',
	responsive = [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 768,
			settings: {
				slidesToShow: 1,
				slidesToScroll: 1,
				arrows: false
			}
		}
	]
}: CarouselProps) => {
	const sliderSettings = {
		infinite,
		speed,
		slidesToShow,
		slidesToScroll,
		autoplay,
		autoplaySpeed,
		dots,
		prevArrow: arrows ? <PrevArrow /> : undefined,
		nextArrow: arrows ? <NextArrow /> : undefined,
		arrows,
		adaptiveHeight: false,
		responsive
	}

	return (
		<div
			className={`relative [&_.slick-slide]:!flex [&_.slick-slide]:!h-auto [&_.slick-slide>div]:h-full [&_.slick-slide>div]:w-full [&_.slick-track]:flex [&_.slick-track]:items-stretch ${className}`}
		>
			<Slider {...sliderSettings}>
				{children.map((child, index) => (
					<div
						key={index}
						className={clsx('px-3', itemHeight)}
					>
						{child}
					</div>
				))}
			</Slider>
		</div>
	)
}

export default Carousel
