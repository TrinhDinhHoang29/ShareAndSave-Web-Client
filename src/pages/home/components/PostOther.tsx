import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { EPostType, ESortOrder } from '@/models/enums'
import PostItemTile from '@/pages/post-detail/components/PostItemTile'
import PostItemTileSkeleton from '@/pages/post-detail/components/PostItemTileSkeleton'

const limit = 6

const PostOther: React.FC = () => {
	const { data, isLoading } = useListPostQuery({
		limit,
		sort: 'createdAt',
		order: ESortOrder.DESC,
		type: EPostType.OTHER
	})
	const navigate = useNavigate()
	const posts = data?.posts

	return (
		<div className='grid grid-cols-3 gap-6'>
			{isLoading ? (
				<PostItemTileSkeleton quantity={limit} />
			) : posts && posts.length > 0 ? (
				posts.map(post => (
					<PostItemTile
						key={post.id}
						post={post}
						onPostClick={slug => navigate('/bai-dang' + '/' + slug)}
					/>
				))
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

export default PostOther
