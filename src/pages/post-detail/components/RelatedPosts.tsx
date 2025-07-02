import { File } from 'lucide-react'
import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useListPostQuery } from '@/hooks/queries/use-post-query'
import { EPostType } from '@/models/enums'
import { IPost } from '@/models/interfaces'

import PostItemTile from './PostItemTile'
import PostItemTileSkeleton from './PostItemTileSkeleton'

interface RelatedPostsProps {
	type: EPostType
	postID: number // Sử dụng postID để kiểm tra trùng lặp
}

const quantity = 5

const RelatedPosts: React.FC<RelatedPostsProps> = ({ type, postID }) => {
	const { data: allPostsResponse, isPending } = useListPostQuery({ type })
	const navigate = useNavigate()

	// Lấy danh sách bài đăng và lọc ra 3 bài không trùng postID
	const getRandomRandomPosts = (
		posts: IPost[],
		excludeId: number,
		count: number
	): IPost[] => {
		const filteredPosts = posts.filter(post => post.id !== excludeId)
		const shuffled = [...filteredPosts].sort(() => 0.5 - Math.random())
		return shuffled.slice(0, Math.min(count, shuffled.length))
	}

	const relatedPosts = allPostsResponse?.posts
		? getRandomRandomPosts(allPostsResponse.posts, postID, quantity)
		: []

	return (
		<div className='bg-card border-border rounded-xl border p-2 shadow-lg'>
			<div className='p-4'>
				<div className='mb-4 flex items-center gap-2'>
					<File className='text-primary h-5 w-5' />
					<h2 className='text-lg font-medium'>Bài đăng liên quan</h2>
				</div>
				{isPending ? (
					<div className='space-y-6'>
						<PostItemTileSkeleton quantity={quantity} />
					</div>
				) : (
					<div className='space-y-6'>
						{relatedPosts.length > 0 ? (
							relatedPosts.map(post => (
								<PostItemTile
									key={post.slug}
									post={post}
									onPostClick={(slug: string) => navigate(`/bai-dang/${slug}`)}
								/>
							))
						) : (
							<p className='text-muted-foreground text-center'>
								Không có bài đăng liên quan.
							</p>
						)}
					</div>
				)}
			</div>
		</div>
	)
}

// Áp dụng React.memo
export default memo(RelatedPosts)
