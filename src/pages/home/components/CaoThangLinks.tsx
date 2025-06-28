import { ExternalLink, School } from 'lucide-react'

import Carousel from '@/components/common/Carousel'
import { caothangLinks } from '@/models/constants'

const CaoThangLinks = () => {
	const handleLinkClick = (url: string) => {
		window.open(url, '_blank', 'noopener,noreferrer')
	}

	return (
		<div>
			{/* Header Section */}
			<div className='mb-12 text-center'>
				<h2 className='from-primary to-accent mb-4 bg-gradient-to-r bg-clip-text text-4xl font-bold text-transparent'>
					Liên kết hữu ích
				</h2>
				<p className='text-muted-foreground mx-auto text-center text-lg'>
					Khám phá các trang web chính thức của trường Cao đẳng Cao Thắng và các
					khoa ban
				</p>
			</div>

			{/* Links Carousel */}
			<Carousel
				slidesToShow={2}
				slidesToScroll={1}
				autoplay={true}
				autoplaySpeed={4000}
				infinite={true}
				speed={500}
				arrows={false}
				dots={true}
				itemHeight='h-80'
				distance='px-1'
				responsive={[
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 3,
							slidesToScroll: 1,
							arrows: true,
							dots: false
						}
					},
					{
						breakpoint: 768,
						settings: {
							slidesToShow: 2,
							slidesToScroll: 1,
							arrows: false,
							dots: true
						}
					},
					{
						breakpoint: 480,
						settings: {
							slidesToShow: 1,
							slidesToScroll: 1,
							arrows: false,
							dots: true
						}
					}
				]}
			>
				{caothangLinks.map((link, index) => {
					const IconComponent = link.Icon

					return (
						<div
							key={index}
							className='group bg-card border-border relative h-80 transform cursor-pointer overflow-hidden rounded-2xl border shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl'
							onClick={() => handleLinkClick(link.url)}
						>
							{/* Image Section - Always visible */}
							<div className='relative h-full overflow-hidden'>
								<img
									src={link.imageUrl}
									alt={link.title}
									className='h-full w-full object-cover transition-transform duration-700 group-hover:scale-110'
									onError={e => {
										e.currentTarget.src =
											'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDQwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNzUgNzVIMjI1VjEyNUgxNzVWNzVaIiBmaWxsPSIjRDFENUQ5Ii8+CjxwYXRoIGQ9Ik0yMDAgMTAwTDE4NSA4NUwyMTUgODVMMjAwIDEwMFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+'
									}}
								/>

								{/* Overlay - Only visible on hover */}
								<div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />

								{/* Icon - Always visible */}
								<div className='bg-card/90 absolute top-4 right-4 rounded-full p-3 shadow-lg backdrop-blur-sm'>
									<IconComponent className='text-primary h-6 w-6' />
								</div>

								{/* Content Section - Only visible on hover */}
								<div className='absolute inset-0 flex translate-y-4 transform flex-col justify-end p-6 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100'>
									<div className='text-white'>
										<div className='mb-3 flex items-start justify-between'>
											<h3 className='line-clamp-2 text-xl font-bold'>
												{link.title}
											</h3>
											<ExternalLink className='ml-2 h-5 w-5 flex-shrink-0' />
										</div>

										<p className='mb-4 line-clamp-3 text-sm leading-relaxed text-white/90'>
											{link.description}
										</p>

										{/* Action Button */}
										<div className='flex items-center text-sm font-medium text-white'>
											<span>Truy cập ngay</span>
											<div className='ml-2 transform transition-transform duration-300 group-hover:translate-x-1'>
												→
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Hover Effect Border */}
							<div className='group-hover:border-primary/30 pointer-events-none absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-300' />
						</div>
					)
				})}
			</Carousel>

			{/* Bottom CTA */}
			<div className='mt-12 text-center'>
				<div
					className='from-primary to-accent text-primary-foreground inline-flex transform cursor-pointer items-center rounded-full bg-gradient-to-r px-6 py-3 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl'
					onClick={() => handleLinkClick('https://caothang.edu.vn/')}
				>
					<School className='mr-2 h-5 w-5' />
					<span className='font-medium'>Tìm hiểu thêm về trường Cao Thắng</span>
				</div>
			</div>
		</div>
	)
}

export default CaoThangLinks
