import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Gift,
	Heart,
	MapPin,
	MessageCircle,
	Package,
	Plus,
	Tag,
	User,
	Users,
	X
} from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { ChatDialog } from '@/components/common/ChatDialog'
import Loading from '@/components/common/Loading'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { useDetailPostQuery } from '@/hooks/queries/use-post-query'
import { formatDateVN } from '@/lib/utils'

import Instruction from '../postAction/components/Instruction'

// Info types based on post type
interface FoundItemInfo {
	foundLocation: string
	foundDate: string
	condition: string
}

interface LostItemInfo {
	lostDate: string
	lostLocation: string
	category: string
	reward: string
}

const PostDetail: React.FC = () => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isImageModalOpen, setIsImageModalOpen] = useState(false)
	const [isInterested, setIsInterested] = useState(false)
	const [showAllInterests, setShowAllInterests] = useState(false)
	const [showAllItems, setShowAllItems] = useState(false)
	const [isShowChatDialog, setIsShowChatDialog] = useState(false)
	const { showInfo } = useAlertModalContext()

	const params = useParams()
	const id = Number(params.id)

	const { data: post, isLoading, isError, error } = useDetailPostQuery(id)

	const sumItems = useMemo(() => {
		return post?.items?.reduce((acc, cur) => acc + (cur.quantity || 0), 0) || 0
	}, [post])

	const handleChat = () => {
		if (isInterested) {
			setIsShowChatDialog(true)
		} else {
			console.log('Bal')
			showInfo({
				infoTitle: 'Thông tin hỗ trợ',
				infoMessage: 'Bạn phải "Quan Tâm" mới được thực hiện "Trò chuyện"',
				infoButtonText: 'Đã rõ'
			})
		}
	}
	if (isLoading)
		return (
			<div className='flex h-full w-full items-center justify-center'>
				<Loading />
			</div>
		)
	if (isError) return <div>Lỗi: {error?.message}</div>
	if (!post) return <div>Bài đăng không tồn tại hoặc ID không hợp lệ</div>

	const getTypeInfo = (type: number) => {
		switch (type) {
			case 1:
				return {
					label: 'Cho tặng đồ cũ',
					color:
						'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
					icon: '🎁'
				}
			case 2:
				return {
					label: 'Tìm thấy đồ',
					color:
						'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
					icon: '🔍'
				}
			case 3:
				return {
					label: 'Tìm đồ bị mất',
					color:
						'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
					icon: '❓'
				}
			case 4:
				return {
					label: 'Khác',
					color:
						'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
					icon: '📝'
				}
			default:
				return {
					label: 'Khác',
					color:
						'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
					icon: '📝'
				}
		}
	}

	const parsePostInfo = () => {
		if (!post.info) return null

		try {
			return JSON.parse(post.info)
		} catch {
			return null
		}
	}

	const nextImage = () => {
		setCurrentImageIndex(prev =>
			prev === post.images.length - 1 ? 0 : prev + 1
		)
	}

	const prevImage = () => {
		setCurrentImageIndex(prev =>
			prev === 0 ? post.images.length - 1 : prev - 1
		)
	}

	const handleInterest = () => {
		setIsInterested(!isInterested)
		// onInterest?.(post.id);
		// If interested, can start chatting
		if (!isInterested) {
			console.log('Can now chat with author')
		}
	}

	const handleShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: post.title,
					text: post.description,
					url: window.location.href
				})
			} catch (err) {
				console.log('Error sharing:', err)
			}
		} else {
			// Fallback: copy to clipboard
			navigator.clipboard.writeText(window.location.href)
			alert('Đã sao chép link bài viết!')
		}
	}

	const typeInfo = getTypeInfo(post.type)
	const parsedInfo = parsePostInfo()

	return (
		<>
			<div className='bg-background min-h-screen'>
				<div className='grid w-full grid-cols-1 gap-6 md:grid-cols-3'>
					<div className='col-span-1 md:col-span-2'>
						<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
							{/* Type Badge */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className='mb-4'
							>
								<span
									className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${typeInfo.color}`}
								>
									<span>{typeInfo.icon}</span>
									{typeInfo.label}
								</span>
							</motion.div>

							{/* Title */}
							<motion.h1
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
								className='text-foreground mb-6 text-3xl leading-tight font-bold md:text-4xl'
							>
								{post.title}
							</motion.h1>

							{/* Meta Info */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className='text-muted-foreground mb-8 flex flex-wrap items-center gap-6'
							>
								<div className='flex items-center gap-2'>
									<User className='h-4 w-4' />
									<span className='font-medium'>{post.authorName}</span>
								</div>

								<div className='flex items-center gap-2'>
									<Calendar className='h-4 w-4' />
									<span>{formatDateVN(post.createdAt)}</span>
								</div>
								{post.items.length > 0 && (
									<div className='flex items-center gap-2'>
										<Package className='h-4 w-4' />
										<span>Còn {sumItems}</span>
									</div>
								)}
							</motion.div>

							<div className='gap-8'>
								{/* Main Content */}
								<div className='space-y-8'>
									{/* Images */}
									{post.images && post.images.length > 0 && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.3 }}
											className='space-y-4'
										>
											<div className='bg-muted relative aspect-video overflow-hidden rounded-xl'>
												<img
													src={post.images[currentImageIndex]}
													alt={`${post.title} - Ảnh ${currentImageIndex + 1}`}
													className='h-full w-full cursor-pointer object-contain'
													onClick={() => setIsImageModalOpen(true)}
												/>

												{post.images.length > 1 && (
													<>
														<button
															onClick={prevImage}
															className='absolute top-1/2 left-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70'
														>
															<ChevronLeft className='h-5 w-5' />
														</button>
														<button
															onClick={nextImage}
															className='absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70'
														>
															<ChevronRight className='h-5 w-5' />
														</button>

														<div className='absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-sm text-white'>
															{currentImageIndex + 1} / {post.images.length}
														</div>
													</>
												)}
											</div>

											{/* Image Thumbnails */}
											{post.images.length > 1 && (
												<div className='flex gap-2 overflow-x-auto pb-2'>
													{post.images.map((image, index) => (
														<button
															key={index}
															onClick={() => setCurrentImageIndex(index)}
															className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
																index === currentImageIndex
																	? 'border-primary'
																	: 'border-border hover:border-muted-foreground'
															}`}
														>
															<img
																src={image}
																alt={`Thumbnail ${index + 1}`}
																className='h-full w-full object-contain'
															/>
														</button>
													))}
												</div>
											)}
										</motion.div>
									)}

									{/* Description */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 0.4 }}
										className='space-y-4'
									>
										<h2 className='text-foreground text-xl font-semibold'>
											Mô tả
										</h2>
										<div className='prose prose-sm text-foreground max-w-none'>
											<p className='text-muted-foreground leading-relaxed whitespace-pre-line'>
												{post.description}
											</p>
										</div>
									</motion.div>

									{/* Specific Info based on Type */}
									{parsedInfo && (post.type === 2 || post.type === 3) && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.5 }}
											className='space-y-4'
										>
											<h2 className='text-foreground text-xl font-semibold'>
												Thông tin chi tiết
											</h2>
											<div className='bg-accent/30 space-y-3 rounded-lg p-4'>
												{post.type === 2 && (
													<>
														{(parsedInfo as FoundItemInfo).foundLocation && (
															<div className='flex items-center gap-2'>
																<MapPin className='text-primary h-4 w-4' />
																<span className='text-sm font-medium'>
																	Nơi tìm thấy:
																</span>
																<span className='text-muted-foreground text-sm'>
																	{(parsedInfo as FoundItemInfo).foundLocation}
																</span>
															</div>
														)}
														{(parsedInfo as FoundItemInfo).foundDate && (
															<div className='flex items-center gap-2'>
																<Calendar className='text-primary h-4 w-4' />
																<span className='text-sm font-medium'>
																	Ngày tìm thấy:
																</span>
																<span className='text-muted-foreground text-sm'>
																	{formatDateVN(
																		(parsedInfo as FoundItemInfo).foundDate
																	)}
																</span>
															</div>
														)}
														{(parsedInfo as FoundItemInfo).condition && (
															<div className='flex items-center gap-2'>
																<Package className='text-primary h-4 w-4' />
																<span className='text-sm font-medium'>
																	Tình trạng:
																</span>
																<span className='text-muted-foreground text-sm'>
																	{(parsedInfo as FoundItemInfo).condition}
																</span>
															</div>
														)}
													</>
												)}
												{post.type === 3 && (
													<>
														<div className='flex items-center gap-2'>
															<Calendar className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Ngày mất:
															</span>
															<span className='text-muted-foreground text-sm'>
																{formatDateVN(
																	(parsedInfo as LostItemInfo).lostDate
																)}
															</span>
														</div>
														<div className='flex items-center gap-2'>
															<MapPin className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Nơi mất:
															</span>
															<span className='text-muted-foreground text-sm'>
																{(parsedInfo as LostItemInfo).lostLocation}
															</span>
														</div>
														<div className='flex items-center gap-2'>
															<Tag className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Loại đồ vật:
															</span>
															<span className='text-muted-foreground text-sm'>
																{(parsedInfo as LostItemInfo).category}
															</span>
														</div>
														<div className='flex items-center gap-2'>
															<Gift className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Phần thưởng:
															</span>
															<span className='text-muted-foreground text-sm'>
																{(parsedInfo as LostItemInfo).reward}
															</span>
														</div>
													</>
												)}
											</div>
										</motion.div>
									)}

									{/* Items List */}
									{post.items && post.items.length > 0 && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.6 }}
											className='space-y-4'
										>
											<div className='flex items-center justify-between'>
												<h2 className='text-foreground text-xl font-semibold'>
													Danh sách vật phẩm ({post.items.length} món)
												</h2>
												{post.items.length > 6 && (
													<button
														onClick={() => setShowAllItems(!showAllItems)}
														className='text-primary hover:text-primary/80 text-sm font-medium'
													>
														{showAllItems
															? 'Thu gọn'
															: `Xem tất cả (${post.items.length})`}
													</button>
												)}
											</div>
											<div className='grid gap-4'>
												{(showAllItems
													? post.items
													: post.items.slice(0, 6)
												).map((item, index) => (
													<div
														key={item.itemID}
														className='border-border hover:bg-accent/50 flex items-center gap-4 rounded-lg border p-4 transition-colors'
													>
														<div className='bg-muted h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
															{item.image ? (
																<img
																	src={item.image}
																	alt={item.name}
																	className='h-full w-full object-contain'
																/>
															) : (
																<div className='flex h-full w-full items-center justify-center'>
																	<Package className='text-muted-foreground h-6 w-6' />
																</div>
															)}
														</div>
														<div className='flex min-w-0 flex-1 items-center justify-between'>
															<div>
																<h3 className='text-foreground truncate font-medium'>
																	{item.name}
																</h3>
																<p className='text-muted-foreground text-sm'>
																	{item.categoryName}
																</p>
															</div>
															<div className='mt-1 flex items-center gap-2'>
																<span className='bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium'>
																	SL: {item.quantity}
																</span>
															</div>
														</div>
													</div>
												))}
											</div>
											{!showAllItems && post.items.length > 6 && (
												<div className='text-center'>
													<button
														onClick={() => setShowAllItems(true)}
														className='text-primary hover:text-primary/80 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium'
													>
														<Plus className='h-4 w-4' />
														Xem thêm {post.items.length - 6} vật phẩm
													</button>
												</div>
											)}
										</motion.div>
									)}

									{/* Tags */}
									{post.tags && post.tags.length > 0 && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.7 }}
											className='space-y-4'
										>
											<h2 className='text-foreground text-xl font-semibold'>
												Thẻ tag
											</h2>
											<div className='flex flex-wrap gap-2'>
												{post.tags.map((tag, index) => (
													<span
														key={index}
														className='bg-accent text-accent-foreground hover:bg-accent/80 inline-flex cursor-pointer items-center gap-1 rounded-full px-3 py-1 text-sm transition-colors'
													>
														<Tag className='h-3 w-3' />
														{tag}
													</span>
												))}
											</div>
										</motion.div>
									)}

									{/* Interested Users */}
									{post.interests && post.interests.length > 0 && (
										<motion.div
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.8 }}
											className='space-y-4'
										>
											<div className='flex items-center justify-between'>
												<h2 className='text-foreground flex items-center gap-2 text-xl font-semibold'>
													<Users className='h-5 w-5' />
													Những người quan tâm ({post.interests.length})
												</h2>
												{post.interests.length > 4 && (
													<button
														onClick={() => setShowAllInterests(true)}
														className='text-primary hover:text-primary/80 text-sm font-medium'
													>
														Xem tất cả
													</button>
												)}
											</div>
											<div className='gap-4'>
												{post.interests.slice(0, 4).map(interest => (
													<div
														key={interest.id}
														className='border-border hover:bg-accent/50 flex cursor-pointer flex-col items-center gap-2 rounded-lg border p-3 transition-colors'
													>
														<div className='bg-muted h-12 w-12 overflow-hidden rounded-full'>
															{interest.userAvatar ? (
																<img
																	src={interest.userAvatar}
																	alt={interest.userName}
																	className='h-full w-full object-contain'
																/>
															) : (
																<div className='flex h-full w-full items-center justify-center'>
																	<User className='text-muted-foreground h-6 w-6' />
																</div>
															)}
														</div>
														<p className='text-foreground w-full truncate text-center text-sm font-medium'>
															{interest.userName}
														</p>
													</div>
												))}
											</div>
											{post.interests.length > 4 && (
												<div className='text-center'>
													<button
														onClick={() => setShowAllInterests(true)}
														className='text-primary hover:text-primary/80 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium'
													>
														<Plus className='h-4 w-4' />
														Và {post.interests.length - 4} người khác
													</button>
												</div>
											)}
										</motion.div>
									)}
								</div>

								{/* Sidebar */}
								<div className='space-y-6'>
									{/* Action Buttons */}
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.4 }}
										className='glass space-y-4 rounded-xl p-6'
									>
										<button
											onClick={handleInterest}
											className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all ${
												isInterested
													? 'bg-primary text-primary-foreground hover:bg-primary/90'
													: 'bg-accent text-accent-foreground hover:bg-accent/80'
											}`}
										>
											<Heart
												className={`h-5 w-5 ${isInterested ? 'fill-current' : ''}`}
											/>
											{isInterested ? 'Đã quan tâm' : 'Tôi quan tâm'}
										</button>

										<button
											type='button'
											onClick={handleChat}
											className={clsx(
												'text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors',
												isInterested
													? 'bg-chart-1/90 hover:bg-chart-1 cursor-pointer'
													: 'bg-chart-1/20 hover:bg-chart-1/30 cursor-not-allowed'
											)}
										>
											<MessageCircle className='h-5 w-5' />
											Trò chuyện
										</button>
									</motion.div>

									{/* Author Info */}
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.5 }}
										className='glass space-y-4 rounded-xl p-6'
									>
										<h3 className='text-foreground font-semibold'>
											Thông tin người đăng
										</h3>
										<div className='space-y-3'>
											<div className='flex items-center gap-3'>
												<div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
													<User className='text-primary h-6 w-6' />
												</div>
												<div>
													<p className='text-foreground font-medium'>
														{post.authorName}
													</p>
													<p className='text-muted-foreground text-sm'>
														Thành viên
													</p>
												</div>
											</div>

											<div className='text-muted-foreground flex items-center gap-2 text-sm'>
												<Clock className='h-4 w-4' />
												<span>Tham gia từ 2023</span>
											</div>
										</div>
									</motion.div>

									{/* Stats */}
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.6 }}
										className='glass space-y-4 rounded-xl p-6'
									>
										<h3 className='text-foreground font-semibold'>
											Thống kê bài viết
										</h3>
										<div className='space-y-3'>
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground text-sm'>
													Người quan tâm:
												</span>
												<span className='text-foreground text-sm font-medium'>
													{post.interests.length}
												</span>
											</div>
											{post.items.length > 0 && (
												<div className='flex items-center justify-between'>
													<span className='text-muted-foreground text-sm'>
														Số vật phẩm:
													</span>
													<span className='text-foreground text-sm font-medium'>
														{post.items.length}
													</span>
												</div>
											)}
										</div>
									</motion.div>
									<AnimatePresence>
										{isImageModalOpen && (
											<motion.div
												initial={{ opacity: 0 }}
												animate={{ opacity: 1 }}
												exit={{ opacity: 0 }}
												className='fixed inset-0 z-40 flex items-center justify-center bg-black/90 p-4'
												onClick={() => setIsImageModalOpen(false)}
											>
												<button className='bg-destructive absolute top-5 right-5 rounded-md p-2 text-white transition-colors hover:bg-red-500 hover:text-gray-300'>
													<X className='h-8 w-8' />
												</button>
												<motion.div
													initial={{ scale: 0.9 }}
													animate={{ scale: 1 }}
													exit={{ scale: 0.9 }}
													className='max-h-full max-w-4xl'
													onClick={e => e.stopPropagation()}
												>
													<img
														src={post.images[currentImageIndex]}
														alt={`${post.title} - Ảnh ${currentImageIndex + 1}`}
														className='max-h-[500px] max-w-full rounded-lg object-contain'
													/>
												</motion.div>
												{post.images.length > 1 && (
													<>
														<button
															onClick={e => {
																e.stopPropagation()
																prevImage()
															}}
															className='absolute top-1/2 left-4 z-50 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70'
														>
															<ChevronLeft className='h-6 w-6' />
														</button>
														<button
															onClick={e => {
																e.stopPropagation()
																nextImage()
															}}
															className='absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white transition-colors hover:bg-black/70'
														>
															<ChevronRight className='h-6 w-6' />
														</button>
													</>
												)}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>
						</div>
					</div>
					<div className='top-0 col-span-1 md:top-16'>
						<Instruction />
					</div>
				</div>
			</div>
			{isShowChatDialog && (
				<ChatDialog
					userName={post.authorName}
					postTitle={post.title}
					items={post.items}
					userId={post.authorID}
					onClose={() => setIsShowChatDialog(false)}
				/>
			)}
		</>
	)
}

export default PostDetail

// <div className="min-h-screen bg-background">

//   <div className="container mx-auto px-4 py-8">
//     <div className="max-w-4xl mx-auto">

{
	/* Image Modal */
}

// </div>
