import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Carousel from '@/components/common/Carousel'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { EPostType, ESortOrder } from '@/models/enums'
import PostItem from '@/pages/post/components/PostItem'
import PostItemSkeleton from '@/pages/post/components/PostItemSkeleton'

interface PostLostItemCarouselProps {
	type: EPostType
}

const PostLostItemCarousel: React.FC<PostLostItemCarouselProps> = ({
	type
}) => {
	const { data, isLoading } = useListPostQuery({
		limit: 10,
		type,
		sort: 'createdAt',
		order: ESortOrder.DESC
	})
	const navigate = useNavigate()
	const posts = data?.posts

	return (
		<div>
			{isLoading ? (
				<div className='grid grid-cols-3 gap-6'>
					<PostItemSkeleton quantity={3} />
				</div>
			) : posts && posts.length > 0 ? (
				<Carousel
					autoplay={false}
					itemHeight='h-[450px]'
				>
					{posts.map(post => (
						<PostItem
							key={post.id}
							className='h-full'
							post={post}
							onPostClick={id => navigate('/bai-dang' + '/' + id)}
						/>
					))}
				</Carousel>
			) : (
				<div className='col-span-3'>
					<div className='flex flex-col items-center justify-center py-10 text-center'>
						<FileText className='mb-4 h-16 w-16 text-gray-300' />
						<p className='text-secondary text-lg'>Không có bài viết nào</p>
					</div>
				</div>
			)}
		</div>
	)
}

export default PostLostItemCarousel
