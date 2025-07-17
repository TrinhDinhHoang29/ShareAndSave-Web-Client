import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import {
	ArrowLeftRight,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	Gift,
	Heart,
	Locate,
	Lock,
	MapPin,
	MessageCircle,
	Package,
	Pin,
	Plus,
	Tag,
	Trash,
	Unlock,
	User,
	Users,
	X
} from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import TriangleCornerBadge from '@/components/common/TriangleCornerBadge'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { useAuthDialog } from '@/context/auth-dialog-context'
import {
	useCreateInterestMutation,
	useDeleteInterestMutation
} from '@/hooks/mutations/use-interest.mutation'
import {
	useDeletePostMutation,
	useUpdatePostMutation
} from '@/hooks/mutations/use-post.mutation'
import { useCreateTransactionMutation } from '@/hooks/mutations/use-transaction.mutation'
import { useDetailPostQuery } from '@/hooks/queries/use-post-query'
import { useInterestListDialog } from '@/hooks/useInterestListDialog'
import { formatDateTimeVN } from '@/lib/utils'
import {
	checkDateRange,
	getStatusConfig,
	getStatusPostTypeConfig,
	getTypeInfo
} from '@/models/constants'
import { EDateRangeStatus, EPostSTatus, EPostType } from '@/models/enums'
import { IDateRangeResult, IUserInterest } from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

import PostDetailSkeleton from './components/PostDetailSkeleton'
import RelatedPosts from './components/RelatedPosts'
import TransactionInterestDialog from './components/TransactionInterestDialog'

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

interface CampaignInfo {
	startDate: string
	endDate: string
	location: string
	organizer: string
}

const PostDetail: React.FC = () => {
	const {
		isOpen,
		openDialog: openInterestDialog,
		closeDialog,
		DialogComponent
	} = useInterestListDialog()
	const [currentImageIndex, setCurrentImageIndex] = useState(0)
	const [isImageModalOpen, setIsImageModalOpen] = useState(false)
	const [interestID, setInterestID] = useState(0)
	const [showAllItems, setShowAllItems] = useState(false)
	const queryClient = useQueryClient()
	const { showSuccess, showInfo, showConfirm } = useAlertModalContext()
	const { user, isAuthenticated } = useAuthStore()
	const { openDialog } = useAuthDialog()
	const navigate = useNavigate()
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const { mutate } = useCreateTransactionMutation({
		onSuccess: () => {
			showSuccess({
				successTitle: 'Giao dịch thành công',
				successMessage:
					'Bạn có thể xem danh sách giao dịch trong trò chuyện hoặc trong danh sách quan tâm.',
				successButtonText: 'Đóng'
			})
			setIsDialogOpen(false)
		}
	})

	const { mutate: updatePostMutation } = useUpdatePostMutation({
		onSuccess: () => {
			refetch()
		}
	})
	const { mutate: deletePostMutation } = useDeletePostMutation({
		onSuccess: () => {
			refetch()
		}
	})

	const handleUpdateStatus = async (postID: number, status: EPostSTatus) => {
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage:
				status === EPostSTatus.SEAL
					? 'Những người khác sẽ không còn được quan tâm bạn?'
					: 'Cho phép người khác quan tâm bài đăng của bạn',
			confirmTitle:
				status === EPostSTatus.SEAL ? 'Khóa bài đăng' : 'Mở khóa bài đăng',
			cancelButtonText: 'Hủy',
			onConfirm: () => {
				updatePostMutation({
					postID,
					data: {
						status: Number(status)
					}
				})
			}
		})
	}

	const handleRepost = (postID: number, status: EPostSTatus) => {
		if (status === EPostSTatus.SEAL) {
			showInfo({
				infoButtonText: 'Đã rõ',
				infoMessage:
					'Bài đăng hiện tại đang khóa. Vui lòng mở khóa để tiến hành ghim bài đăng.',
				infoTitle: 'Thông tin bài đăng'
			})
		} else {
			updatePostMutation({
				postID,
				data: {
					isRepost: true
				}
			})
		}
	}

	const handleDelete = (postID: number) => {
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage: 'Hành động này không thể hoàn tác',
			confirmTitle: 'Xác nhận xóa bài',
			onConfirm: () => {
				deletePostMutation(postID)
			},
			cancelButtonText: 'Hủy'
		})
	}

	const params = useParams()
	const slug = params.slug
	const {
		data: post,
		isLoading,
		isError,
		error,
		refetch
	} = useDetailPostQuery(slug || '')
	const {
		mutate: createInterestMutatation,
		isPending: isCreateInterestPending
	} = useCreateInterestMutation({
		onSuccess: (interestID: number) => {
			setInterestID(interestID)
			const newUserInterest: IUserInterest = {
				id: interestID,
				postID: post?.id || 0,
				status: 1,
				userAvatar: user?.avatar || '',
				userID: user?.id || 0,
				userName: user?.fullName || '',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			}
			post?.interests.push(newUserInterest)
			queryClient.invalidateQueries({ queryKey: ['postInterests'] })
			setIsDialogOpen(true)
		}
	})
	const {
		mutate: deleteInterestMutatation,
		isPending: isDeleteInterestPending
	} = useDeleteInterestMutation({
		onSuccess: (interestID: number) => {
			setInterestID(0)
			if (post?.interests && post.interests.length > 0) {
				post.interests = post?.interests.filter(i => i.id !== interestID)
			}
			queryClient.invalidateQueries({ queryKey: ['postInterests'] })
		}
	})

	useEffect(() => {
		if (post?.interests && post.interests.length > 0) {
			const isMeInterested =
				post.interests.find(i => i.userID === user?.id)?.id || 0
			setInterestID(isMeInterested)
		}
		setCurrentImageIndex(0)
	}, [post])

	const sumCurrentQuantityItems = useMemo(() => {
		return (
			post?.items?.reduce((acc, cur) => acc + (cur.currentQuantity || 0), 0) ||
			0
		)
	}, [post])

	const sumQuantityItems = useMemo(() => {
		return post?.items?.reduce((acc, cur) => acc + (cur.quantity || 0), 0) || 0
	}, [post])

	const getCampaignInfo = () => {
		try {
			if (
				!post?.info ||
				(post.type.toString() as EPostType) !== EPostType.CAMPAIGN
			)
				return null

			const parsed = JSON.parse(post.info)

			// Kiểm tra các trường hợp rỗng
			if (
				parsed == null ||
				(typeof parsed === 'object' &&
					!Array.isArray(parsed) &&
					Object.keys(parsed).length === 0) ||
				(Array.isArray(parsed) && parsed.length === 0)
			) {
				return null
			}
			return parsed
		} catch (error) {
			console.warn('Failed to parse campaign info:', error)
			return null
		}
	}

	const campaignInfo: CampaignInfo | null = getCampaignInfo()

	const statusTimeCampaign: IDateRangeResult | null = useMemo(() => {
		if (campaignInfo) {
			return checkDateRange(campaignInfo.startDate, campaignInfo.endDate)
		}
		return null
	}, [campaignInfo])

	const { color: statusColor, label: statusLabel } = getStatusPostTypeConfig(
		post?.type.toString() as EPostType,
		sumCurrentQuantityItems,
		campaignInfo?.startDate || '',
		campaignInfo?.endDate || '',
		post?.tags
	)

	const handleChat = (option: 'chat' | 'transaction') => {
		if (interestID) {
			if (option === 'chat') navigate(`/chat/${interestID}`)
			else setIsDialogOpen(true)
		} else {
			showInfo({
				infoTitle: 'Thông tin hỗ trợ',
				infoMessage:
					'Bạn phải "Quan Tâm" mới được thực hiện "Tạo giao dịch - Trò chuyện"',
				infoButtonText: 'Đã rõ'
			})
		}
	}
	if (isLoading) return <PostDetailSkeleton />
	if (isError) return <div>Lỗi: {error?.message}</div>
	if (!post) return <div>Bài đăng không tồn tại hoặc ID không hợp lệ</div>

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

	const handleInterest = async () => {
		if (isAuthenticated) {
			if (
				statusTimeCampaign &&
				statusTimeCampaign.status !== EDateRangeStatus.IN_RANGE
			) {
				showInfo({
					infoButtonText: 'Đã rõ',
					infoMessage: statusTimeCampaign.message,
					infoTitle: 'Thông tin chiến dịch'
				})
				return
			}
			if (!interestID) {
				createInterestMutatation({ postID: post.id })
			} else {
				deleteInterestMutatation(post.id)
			}
		} else {
			openDialog({})
		}
	}

	const { label, color, Icon } = getTypeInfo(post.type.toString() as EPostType)
	const statusConfig = getStatusConfig(post.status)
	const StatusIcon = statusConfig.icon
	const parsedInfo = parsePostInfo()
	const showItemsNumber = 5

	return (
		<>
			<div className='container mx-auto grid w-full grid-cols-1 gap-6 py-12 md:grid-cols-3'>
				<div className='col-span-1 md:col-span-2'>
					<div className='bg-card border-border relative rounded-xl border p-8 shadow-lg'>
						{user?.id === post.authorID && <TriangleCornerBadge />}
						{/* Type Badge */}
						<div className='mb-4 flex items-center gap-4'>
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<span
									className={`inline-flex h-8 items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${color}`}
								>
									<span>
										<Icon />
									</span>
									{label}
								</span>
							</motion.div>
							{post.status === Number(EPostSTatus.SEAL) && (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
								>
									<span
										className={clsx(
											'inline-flex h-8 items-center gap-2 rounded-full px-3 py-1 text-sm font-medium',
											statusConfig.bgColor,
											statusConfig.textColor
										)}
									>
										<span className={statusConfig.iconColor}>
											<StatusIcon />
										</span>
										{statusConfig.label}
									</span>
								</motion.div>
							)}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
							>
								<span
									className={clsx(
										'inline-flex h-8 items-center rounded-full px-3 text-sm font-medium',
										statusColor
									)}
								>
									{statusLabel}
								</span>
							</motion.div>
						</div>

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
								<Clock className='h-4 w-4' />
								<span>{formatDateTimeVN(post.createdAt)}</span>
							</div>
						</motion.div>

						<div className='gap-8 space-y-6'>
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
												className='bg-muted h-full w-full cursor-pointer object-contain'
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
															className='bg-muted h-full w-full object-contain'
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
								{parsedInfo &&
									((post.type.toString() as EPostType) ===
										EPostType.FOUND_ITEM ||
										(post.type.toString() as EPostType) ===
											EPostType.SEEK_LOSE_ITEM ||
										(post.type.toString() as EPostType) ===
											EPostType.CAMPAIGN) && (
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
												{(post.type.toString() as EPostType) ===
													EPostType.FOUND_ITEM && (
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
																	{formatDateTimeVN(
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
												{(post.type.toString() as EPostType) ===
													EPostType.SEEK_LOSE_ITEM && (
													<>
														<div className='flex items-center gap-2'>
															<Calendar className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Ngày mất:
															</span>
															<span className='text-muted-foreground text-sm'>
																{formatDateTimeVN(
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
												{(post.type.toString() as EPostType) ===
													EPostType.CAMPAIGN && (
													<>
														<div className='flex items-center gap-2'>
															<Calendar className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Ngày diễn ra:
															</span>
															<div className='text-muted-foreground space-x-1 text-sm'>
																<span>
																	{formatDateTimeVN(
																		(parsedInfo as CampaignInfo).startDate,
																		false
																	)}
																</span>
																<span>-</span>
																<span>
																	{formatDateTimeVN(
																		(parsedInfo as CampaignInfo).endDate,
																		false
																	)}
																</span>
															</div>
														</div>
														<div className='flex items-center gap-2'>
															<Locate className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Địa điểm:
															</span>
															<span className='text-muted-foreground text-sm'>
																{(parsedInfo as CampaignInfo).location}
															</span>
														</div>
														<div className='flex items-center gap-2'>
															<Users className='text-primary h-4 w-4' />
															<span className='text-sm font-medium'>
																Tổ chức bởi:
															</span>
															<span className='text-muted-foreground text-sm'>
																{(parsedInfo as CampaignInfo).organizer}
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
												: post.items.slice(0, showItemsNumber)
											).map(item => (
												<div
													key={item.itemID}
													className='border-border hover:bg-accent/50 flex items-center gap-4 rounded-lg border p-4 transition-colors'
												>
													<div className='bg-muted h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
														{item.image ? (
															<img
																src={item.image}
																alt={item.name}
																className='bg-muted h-full w-full object-contain'
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
															{item.currentQuantity || 0 > 0 ? (
																<span className='bg-primary/10 text-primary rounded-full px-2 py-1 text-xs font-medium'>
																	Hiện còn: {item.currentQuantity}
																</span>
															) : (
																<span className='rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700'>
																	hết đồ
																</span>
															)}
														</div>
													</div>
												</div>
											))}
										</div>
										{!showAllItems && post.items.length > showItemsNumber && (
											<div className='text-center'>
												<button
													onClick={() => setShowAllItems(true)}
													className='text-primary hover:text-primary/80 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium'
												>
													<Plus className='h-4 w-4' />
													Xem thêm {post.items.length - showItemsNumber} vật
													phẩm
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
										{user?.id === post.authorID && (
											<button
												className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-3 py-1 transition-colors'
												onClick={openInterestDialog}
											>
												Quản lý
											</button>
										)}
									</div>
									{post.interests && post.interests.length > 0 && (
										<div className='glass grid grid-cols-8 rounded-xl p-6'>
											{post.interests.map(interest => (
												<div
													key={interest.id}
													className='flex cursor-pointer flex-col items-center gap-2 p-2 transition-colors'
												>
													<div className='bg-muted h-12 w-12 overflow-hidden rounded-full'>
														{interest.userAvatar ? (
															<img
																src={interest.userAvatar}
																alt={interest.userName}
																className='bg-muted h-full w-full object-contain'
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
									)}
								</motion.div>
							</div>

							{/* Sidebar */}
							<div className='space-y-6'>
								{/* Action Buttons */}
								{user?.id !== post.authorID ? (
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.4 }}
										className='glass space-y-4 rounded-xl p-6'
									>
										<button
											onClick={handleInterest}
											className={clsx(
												`relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all`,
												interestID
													? 'bg-primary text-primary-foreground hover:bg-primary/90'
													: (
																statusTimeCampaign
																	? statusTimeCampaign.isInRange
																	: true
														  )
														? 'bg-accent text-accent-foreground hover:bg-accent/80'
														: 'bg-accent/20 text-accent-foreground hover:bg-accent/30 cursor-not-allowed'
											)}
										>
											{isCreateInterestPending || isDeleteInterestPending ? (
												<Loading
													color='secondary'
													size='sm'
												/>
											) : (
												<>
													<Heart
														className={`h-5 w-5 ${interestID ? 'fill-current' : ''}`}
													/>
												</>
											)}
											{interestID ? 'Đã quan tâm' : 'Quan tâm'}
										</button>
										<div className='flex items-center gap-4'>
											<button
												type='button'
												onClick={() => handleChat('chat')}
												className={clsx(
													'text-secondary-foreground flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors',
													interestID
														? 'bg-secondary/90 hover:bg-secondary cursor-pointer'
														: 'bg-secondary/20 hover:bg-secondary/30 cursor-not-allowed'
												)}
											>
												<MessageCircle className='h-5 w-5' />
												Trò chuyện
											</button>

											<button
												type='button'
												onClick={() => handleChat('transaction')}
												className={clsx(
													'text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors',
													interestID
														? 'bg-success/90 hover:bg-success cursor-pointer'
														: 'bg-success/20 hover:bg-success/30 cursor-not-allowed'
												)}
											>
												<ArrowLeftRight className='h-5 w-5' />
												Tạo giao dịch
											</button>
										</div>
									</motion.div>
								) : (
									<motion.div
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ delay: 0.4 }}
										className='glass space-y-4 rounded-xl p-6'
									>
										<button
											onClick={() =>
												handleRepost(
													post.id,
													post.status.toString() as EPostSTatus
												)
											}
											className={`bg-primary text-primary-foreground hover:bg-primary/90 relative flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-all`}
										>
											<Pin
												className={`h-5 w-5 ${interestID ? 'fill-current' : ''}`}
											/>
											Ghim bài đăng
										</button>
										<div className='flex items-center gap-4'>
											<button
												type='button'
												onClick={() =>
													handleUpdateStatus(
														post.id,
														(post.status.toString() as EPostSTatus) ===
															EPostSTatus.APPROVED
															? EPostSTatus.SEAL
															: EPostSTatus.APPROVED
													)
												}
												className={clsx(
													'text-secondary-foreground bg-secondary/90 hover:bg-secondary flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors'
												)}
											>
												{(post.status.toString() as EPostSTatus) ===
												EPostSTatus.APPROVED ? (
													<Lock className='h-5 w-5' />
												) : (
													<Unlock className='h-5 w-5' />
												)}
												{(post.status.toString() as EPostSTatus) ===
												EPostSTatus.APPROVED
													? 'Khóa bài đăng'
													: 'Mở khóa bài đăng'}
											</button>

											<button
												type='button'
												onClick={() => handleDelete(post.id)}
												className={clsx(
													'text-primary-foreground bg-error/90 hover:bg-error flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg px-4 py-3 font-medium transition-colors'
												)}
											>
												<Trash className='h-5 w-5' />
												Xóa bài đăng
											</button>
										</div>
									</motion.div>
								)}

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
											<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
												{user?.avatar ? (
													<img
														src={user.avatar}
														alt={`${user?.fullName} avatar`}
														className='h-full w-full rounded-full object-cover'
													/>
												) : (
													<User className='text-secondary h-5 w-5' /> // Placeholder nếu không có avatar
												)}
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
													Số món đồ:
												</span>
												<span className='text-foreground text-sm font-medium'>
													{post.items.length}
												</span>
											</div>
										)}
										{sumQuantityItems > 0 && (
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground text-sm'>
													Số lượng món đồ:
												</span>
												<span className='text-foreground text-sm font-medium'>
													{sumQuantityItems}
												</span>
											</div>
										)}
										{sumCurrentQuantityItems > 0 && (
											<div className='flex items-center justify-between'>
												<span className='text-muted-foreground text-sm'>
													Số lượng món đồ hiện còn:
												</span>
												<span className='text-foreground text-sm font-medium'>
													{sumCurrentQuantityItems}
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
											className='fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4'
											onClick={() => setIsImageModalOpen(false)}
										>
											<button className='bg-destructive absolute top-5 right-5 z-50 rounded-md p-2 text-white transition-colors hover:bg-red-500 hover:text-gray-300'>
												<X className='h-8 w-8' />
											</button>
											<motion.div
												initial={{ scale: 0.9 }}
												animate={{ scale: 1 }}
												exit={{ scale: 0.9 }}
												className='h-[400px] w-[600px]'
												onClick={e => e.stopPropagation()}
											>
												<img
													src={post.images[currentImageIndex]}
													alt={`${post.title} - Ảnh ${currentImageIndex + 1}`}
													className='bg-muted h-full w-full rounded-lg object-contain'
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
				<div className='top-0 col-span-1 space-y-6 md:top-16'>
					<RelatedPosts
						type={post.type.toString() as EPostType}
						postID={post.id}
					/>
				</div>
			</div>
			<TransactionInterestDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				items={post.items}
				onCreateTransaction={(items, method) => {
					mutate({
						data: {
							interestID,
							items: items.map(item => ({
								postItemID: item.postItemID,
								quantity: item.quantity
							})),
							method // Add method here
						}
					})
				}}
				title='Tạo giao dịch mới'
				description='Chọn vật phẩm bạn muốn trao đổi'
			/>
			<DialogComponent
				isOpen={isOpen}
				onClose={closeDialog}
				defaultInterests={post.interests}
				authorID={post.authorID}
				title='Quản lý quan tâm' // Optional
			/>
		</>
	)
}

export default PostDetail
