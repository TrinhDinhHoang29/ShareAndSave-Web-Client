import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Slider from 'react-slick'

import Loading from '@/components/common/Loading'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { ESortOrder } from '@/models/enums'
import PostItem from '@/pages/post/components/PostItem'

// Custom arrow components
const PrevArrow = ({ onClick }: { onClick?: () => void }) => (
	<button
		onClick={onClick}
		className='absolute top-1/2 -left-10 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl'
	>
		<ChevronLeft className='h-6 w-6 text-gray-700' />
	</button>
)

const NextArrow = ({ onClick }: { onClick?: () => void }) => (
	<button
		onClick={onClick}
		className='absolute top-1/2 -right-10 z-10 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-all hover:bg-white hover:shadow-xl'
	>
		<ChevronRight className='h-6 w-6 text-gray-700' />
	</button>
)

const PostListItemDemo: React.FC = () => {
	const { data, isLoading } = useListPostQuery({
		limit: 10,
		sort: 'createdAt',
		order: ESortOrder.DESC
	})
	const navigate = useNavigate()
	const posts = data?.posts

	// Cấu hình cho react-slick
	const sliderSettings = {
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		prevArrow: <PrevArrow />,
		nextArrow: <NextArrow />,
		responsive: [
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
	}

	return (
		<div className='container mx-auto px-4'>
			<div className='mb-8 flex items-center justify-center gap-3'>
				<FileText className='text-primary h-8 w-8' />
				<h1 className='text-foreground text-center text-3xl font-bold'>
					Danh sách bài viết
				</h1>
			</div>

			{isLoading ? (
				<div className='flex items-center justify-center py-20'>
					<Loading />
				</div>
			) : posts && posts.length > 0 ? (
				<div className='relative'>
					<Slider {...sliderSettings}>
						{posts.map(post => (
							<div
								key={post.id}
								className='px-3'
							>
								<PostItem
									post={post}
									onPostClick={slug => navigate('/bai-dang' + '/' + slug)}
								/>
							</div>
						))}
					</Slider>
				</div>
			) : (
				<div className='flex flex-col items-center justify-center py-20 text-center'>
					<FileText className='mb-4 h-16 w-16 text-gray-300' />
					<p className='text-lg text-gray-500'>Không có bài viết nào</p>
				</div>
			)}
		</div>
	)
}

export default PostListItemDemo
