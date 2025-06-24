import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Gift, MapPin, Package, Tag, User, X } from 'lucide-react'
import { FC } from 'react'

import { formatDate } from '@/lib/utils'
import { getStatusConfig } from '@/models/constants'
import { IPost } from '@/models/interfaces'

interface FoundItemInfo {
	foundLocation?: string
	foundDate?: string
	condition?: string
}

interface LostItemInfo {
	lostDate: string
	lostLocation: string
	category: string
	reward: string
}

interface MyPostDetailDialogProps {
	post: IPost | null
	isOpen: boolean
	onClose: () => void
}

const MyPostDetailDialog: FC<MyPostDetailDialogProps> = ({
	post,
	isOpen,
	onClose
}) => {
	if (!post) return null

	const statusConfig = getStatusConfig(post.status)
	const StatusIcon = statusConfig.icon
	const parsedInfo = post.info ? JSON.parse(post.info) : null

	return (
		<AnimatePresence>
			{isOpen && (
				<Dialog
					as={motion.div}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					open={isOpen}
					onClose={onClose}
					className='relative z-50'
				>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className='fixed inset-0 bg-black/25 backdrop-blur-sm'
						aria-hidden='true'
					/>

					{/* Dialog container */}
					<div className='fixed inset-0 flex items-center justify-center p-4'>
						<DialogPanel
							as={motion.div}
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							className='bg-card border-border relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl border shadow-2xl'
						>
							{/* Header */}
							<div className='border-border flex items-center justify-between border-b px-6 py-3'>
								<div className='flex items-center gap-3'>
									<div
										className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}
									>
										<StatusIcon
											className={`h-4 w-4 ${statusConfig.iconColor}`}
										/>
										{statusConfig.label}
									</div>
								</div>
								<button
									onClick={onClose}
									className='text-muted-foreground hover:text-foreground rounded-lg p-2 transition-colors'
								>
									<X className='h-5 w-5' />
								</button>
							</div>

							{/* Content */}
							<div className='max-h-[500px] overflow-y-auto'>
								<div className='space-y-6 p-6'>
									{/* Title */}
									<DialogTitle className='text-foreground mb-4 text-2xl font-bold'>
										{post.title}
									</DialogTitle>

									{/* Meta info */}
									<div className='text-muted-foreground flex flex-wrap items-center gap-4 text-sm'>
										<div className='flex items-center gap-1'>
											<User className='h-4 w-4' />
											<span>{post.authorName}</span>
										</div>
										<div className='flex items-center gap-1'>
											<Calendar className='h-4 w-4' />
											<span>{formatDate(post.createdAt)}</span>
										</div>
										<div className='flex items-center gap-1'>
											<Package className='h-4 w-4' />
											<span>{post.itemCount} món</span>
										</div>
									</div>

									{/* Images */}
									{post.images && post.images.length > 0 && (
										<div>
											<div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
												{post.images.map((image, index) => (
													<div
														key={index}
														className='aspect-square overflow-hidden rounded-lg'
													>
														<img
															src={image}
															alt={`${post.title} - ${index + 1}`}
															className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
														/>
													</div>
												))}
											</div>
										</div>
									)}

									{/* Description */}
									<div>
										<h3 className='text-foreground mb-2 text-lg font-semibold'>
											Mô tả
										</h3>
										<p className='text-muted-foreground leading-relaxed'>
											{post.description}
										</p>
									</div>

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
																	{(parsedInfo as FoundItemInfo).foundDate
																		? formatDate(
																				(parsedInfo as FoundItemInfo).foundDate!
																			)
																		: ''}
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
																{formatDate(
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
											</div>
										</motion.div>
									)}

									{/* Tags */}
									{post.tags && post.tags.length > 0 && (
										<div>
											<h3 className='text-foreground mb-2 text-lg font-semibold'>
												Tags
											</h3>
											<div className='flex flex-wrap gap-2'>
												{post.tags.map((tag, index) => (
													<span
														key={index}
														className='bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm'
													>
														#{tag}
													</span>
												))}
											</div>
										</div>
									)}
								</div>
							</div>

							{/* Footer */}
							<div className='border-border flex justify-end border-t px-6 py-3'>
								<button
									onClick={onClose}
									className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-6 py-2 font-medium transition-colors'
								>
									Đóng
								</button>
							</div>
						</DialogPanel>
					</div>
				</Dialog>
			)}
		</AnimatePresence>
	)
}

export default MyPostDetailDialog
