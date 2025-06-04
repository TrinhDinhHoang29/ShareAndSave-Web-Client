import { useNavigate } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import PostItem from '@/pages/post/components/PostItem'

// Demo component để test
const PostListItemDemo: React.FC = () => {
	const { data: posts, isLoading } = useListPostQuery({})
	const navigate = useNavigate()

	return (
		<div className='bg-background min-h-screen p-8'>
			<div className='mx-auto max-w-6xl'>
				<h1 className='text-foreground mb-8 text-center text-3xl font-bold'>
					Danh sách bài viết
				</h1>

				<div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
					{isLoading ? (
						<div className='flex items-center justify-center'>
							<Loading />
						</div>
					) : (
						posts?.map(post => (
							<PostItem
								key={post.id}
								post={post}
								onPostClick={id => navigate('/bai-dang' + '/' + id)}
							/>
						))
					)}
				</div>
			</div>
		</div>
	)
}

export default PostListItemDemo
