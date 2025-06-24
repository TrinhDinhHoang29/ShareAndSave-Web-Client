import { Box, Clock, Heart, Search, Tag, User } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import { useListPostQuery } from '@/hooks/queries/use-post-query'
import useDebounce from '@/hooks/use-debounce'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import { getTypeInfo } from '@/models/constants'
import { EPostType } from '@/models/enums'
import { IListTypeParams, IPost } from '@/models/interfaces'

interface TypeInfo {
	label: string
	color: string
	Icon: React.ComponentType<{ className?: string }>
}

// Component hiển thị post type badge
interface PostTypeBadgeProps {
	type: EPostType
}

const PostTypeBadge: React.FC<PostTypeBadgeProps> = ({ type }) => {
	const typeInfo: TypeInfo = getTypeInfo(type)

	return (
		<span
			className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${typeInfo.color}`}
		>
			<typeInfo.Icon className='mr-1 h-3 w-3' />
			{typeInfo.label}
		</span>
	)
}

// Component hiển thị một search result item
interface SearchResultItemProps {
	post: IPost
	onClick: (slug: string) => void
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({
	post,
	onClick
}) => {
	return (
		<div
			className='hover:bg-secondary/10 cursor-pointer border border-b p-4 transition-colors'
			onClick={() => onClick(post.slug)}
		>
			<div className='flex gap-3'>
				{/* Thumbnail nếu có ảnh */}
				{post.images && post.images.length > 0 && (
					<div className='flex-shrink-0'>
						<img
							src={post.images[0]}
							alt={post.title}
							className='bg-background h-12 w-16 rounded-md object-cover'
						/>
					</div>
				)}

				<div className='min-w-0 flex-1 space-y-2'>
					{/* Title và Type Badge */}
					<div className='mb-1 flex items-start justify-between gap-2'>
						<h3 className='text-foreground line-clamp-1 text-sm leading-tight font-medium'>
							{post.title}
						</h3>
						<PostTypeBadge type={post.type.toString() as EPostType} />
					</div>

					{/* Description */}
					{post.description && (
						<p className='text-secondary/80 mb-2 line-clamp-2 text-xs leading-relaxed'>
							{post.description}
						</p>
					)}

					{/* Meta info */}
					<div className='text-secondary/80 flex items-center gap-4 text-xs'>
						{post.authorName && (
							<div className='flex items-center gap-1'>
								<User className='h-3 w-3' />
								<span>{post.authorName}</span>
							</div>
						)}

						<div className='flex items-center gap-1'>
							<Clock className='h-3 w-3' />
							<span>{formatNearlyDateTimeVN(post.createdAt)}</span>
						</div>

						{post.interestCount !== undefined && (
							<div className='flex items-center gap-1'>
								<Heart className='h-3 w-3' />
								<span>{post.interestCount}</span>
							</div>
						)}
						{post.currentItemCount !== undefined && (
							<div className='flex items-center gap-1'>
								<Box className='h-3 w-3' />
								<span>{post.currentItemCount}</span>
							</div>
						)}
					</div>
					<div className='flex items-center gap-4'>
						{post.tags.map((tag, index) => (
							<span
								key={index}
								className='bg-accent text-accent-foreground hover:bg-accent/80 inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-xs transition-colors'
							>
								<Tag className='h-3 w-3' />
								{tag}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}

// Main SearchDropdown component
const SearchDropdown: React.FC = () => {
	const [searchQuery, setSearchQuery] = useState<string>('')
	const [isOpen, setIsOpen] = useState<boolean>(false)
	const [searchParams, setSearchParams] = useState<IListTypeParams<EPostType>>(
		{}
	)

	const debouncedSearch = useDebounce<string>(searchQuery, 500)
	const searchRef = useRef<HTMLDivElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()

	// Sử dụng useListPostQuery với search params
	const {
		data: searchResults,
		isLoading,
		error
	} = useListPostQuery(searchParams)
	// Effect để thực hiện search khi debouncedSearch thay đổi
	useEffect(() => {
		if (debouncedSearch && debouncedSearch.trim()) {
			// Cập nhật search params để trigger query
			setSearchParams({
				search: debouncedSearch.trim(),
				limit: 5,
				page: 1
			})
			setIsOpen(true)
		} else {
			setSearchParams({})
			setIsOpen(false)
		}
	}, [debouncedSearch])

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node) &&
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault()
		if (searchQuery.trim() && searchResults && searchResults.posts.length > 0) {
			handlePostClick(searchResults.posts[0].slug) // Fixed typo in original code
		}
	}

	const handlePostClick = (slug: string) => {
		navigate(`/bai-dang/${slug}`)
		setIsOpen(false)
		setSearchQuery('')
	}

	const handleInputFocus = () => {
		if (searchResults && searchResults.posts.length > 0) {
			setIsOpen(true)
		}
	}

	// Lấy danh sách posts từ response
	const posts: IPost[] = searchResults?.posts || []

	const convertedPosts = useMemo(() => {
		return posts.slice(0, Math.min(posts.length, 5))
	}, [posts])

	return (
		<div className='relative w-full max-w-xl'>
			{/* Search Input */}
			<div
				className='relative w-full'
				ref={searchRef}
			>
				<Search className='text-secondary/80 absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform' />
				<input
					type='text'
					value={searchQuery}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setSearchQuery(e.target.value)
					}
					onFocus={handleInputFocus}
					onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
						if (e.key === 'Enter') {
							handleSearch(e)
						}
					}}
					placeholder='Tìm kiếm bài đăng...'
					className='bg-background text-secondary placeholder-secondary focus:border-primary focus:ring-primảy/50 w-full rounded-full border py-3 pr-4 pl-12 transition-all focus:ring-2 focus:outline-none'
				/>
			</div>

			{/* Dropdown Results */}
			{isOpen && (
				<div
					ref={dropdownRef}
					className='bg-muted border-border absolute top-full right-0 left-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg shadow-lg'
				>
					{isLoading ? (
						<div className='p-4 text-center'>
							<div className='text-secondary inline-flex items-center gap-2'>
								<Loading
									color='secondary'
									size='sm'
								/>
								<span>Đang tìm kiếm...</span>
							</div>
						</div>
					) : error ? (
						<div className='text-error/80 p-4 text-center'>
							<p>Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.</p>
						</div>
					) : convertedPosts.length > 0 ? (
						<>
							<div className='max-h-80 overflow-y-auto'>
								{convertedPosts.map(post => (
									<SearchResultItem
										key={post.id}
										post={post}
										onClick={handlePostClick}
									/>
								))}
							</div>
						</>
					) : searchQuery.trim() && !isLoading ? (
						<div className='text-secondary p-4 text-center'>
							<Search className='mx-auto mb-2 h-8 w-8 opacity-50' />
							<p>Không tìm thấy kết quả nào cho "{searchQuery}"</p>
						</div>
					) : null}
				</div>
			)}
		</div>
	)
}

export default SearchDropdown
