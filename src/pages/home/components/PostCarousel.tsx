import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Carousel from '@/components/common/Carousel'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { ESortOrder } from '@/models/enums'
import PostItem from '@/pages/post/components/PostItem'
import PostItemSkeleton from '@/pages/post/components/PostItemSkeleton'

const PostCarousel: React.FC = () => {
	const { data, isLoading } = useListPostQuery({
		limit: 10,
		sort: 'createdAt',
		order: ESortOrder.DESC
	})
	const navigate = useNavigate()
	const posts = data?.posts

	return (
		<div className='px-4'>
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
							onPostClick={slug => navigate('/bai-dang' + '/' + slug)}
						/>
					))}
				</Carousel>
			) : (
				<div className='flex flex-col items-center justify-center py-20 text-center'>
					<FileText className='mb-4 h-16 w-16 text-gray-300' />
					<p className='text-lg text-gray-500'>Không có bài viết nào</p>
				</div>
			)}
		</div>
	)
}

export default PostCarousel
