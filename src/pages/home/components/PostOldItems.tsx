import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { EPostType, ESortOrder } from '@/models/enums'
import PostItem from '@/pages/post/components/PostItem'
import PostItemSkeleton from '@/pages/post/components/PostItemSkeleton'

const limit = 6

const PostOldItems: React.FC = () => {
	const { data, isLoading } = useListPostQuery({
		limit,
		sort: 'createdAt',
		order: ESortOrder.DESC,
		type: EPostType.GIVE_AWAY_OLD_ITEM
	})
	const navigate = useNavigate()
	const posts = data?.posts

	return (
		<div className='grid grid-cols-3 gap-6'>
			{isLoading ? (
				<PostItemSkeleton quantity={limit} />
			) : posts && posts.length > 0 ? (
				posts.map(post => (
					<PostItem
						key={post.id}
						post={post}
						onPostClick={slug => navigate('/bai-dang' + '/' + slug)}
					/>
				))
			) : (
				<div className='flex flex-col items-center justify-center py-20 text-center'>
					<FileText className='mb-4 h-16 w-16 text-gray-300' />
					<p className='text-secondary text-lg'>Không có bài viết nào</p>
				</div>
			)}
		</div>
	)
}

export default PostOldItems
