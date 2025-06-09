// ChatDialog/ChatHeaderWithRequests.tsx
import { Dialog } from '@headlessui/react'
import { motion } from 'framer-motion'
import {
	Check,
	CheckCircle,
	ChevronLeft,
	ChevronRight,
	Eye,
	EyeOff,
	Minus,
	Package,
	Plus,
	X
} from 'lucide-react'

import { ISender, RequestItem } from '@/models/interfaces'

interface Props {
	sender: ISender
	postTitle: string
	pendingRequests: RequestItem[]
	currentRequestIndex: number
	isRequestsVisible: boolean
	isAllConfirmed: boolean
	isAuthor: boolean
	onClose: () => void
	toggleRequestsVisibility: () => void
	handlePrevRequest: () => void
	handleNextRequest: () => void
	handleConfirmRequest: () => void
	handleConfirmSingleRequest: (itemId: number) => void
	handlePendingQuantityChange: (itemId: number, delta: number) => void
	handleRemovePendingRequest: (itemId: number) => void
	setCurrentRequestIndex: (index: number) => void
}

export const ChatHeaderWithRequests = ({
	sender,
	postTitle,
	pendingRequests,
	currentRequestIndex,
	isRequestsVisible,
	isAllConfirmed,
	isAuthor,
	onClose,
	toggleRequestsVisibility,
	handlePrevRequest,
	handleNextRequest,
	handleConfirmRequest,
	handleConfirmSingleRequest,
	handlePendingQuantityChange,
	handleRemovePendingRequest,
	setCurrentRequestIndex
}: Props) => {
	const currentItem = pendingRequests[currentRequestIndex]

	return (
		<div className='bg-primary text-primary-foreground px-6 py-4'>
			{/* Header */}
			<div className='flex items-start justify-between'>
				<div className='flex items-center space-x-3'>
					<div className='bg-primary-foreground/20 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm'>
						<Package className='h-6 w-6' />
					</div>
					<div>
						<Dialog.Title
							as='h3'
							className='font-manrope text-lg font-semibold'
						>
							{sender.name}
						</Dialog.Title>
						<p className='text-primary-foreground/90 text-sm'>{postTitle}</p>
					</div>
				</div>
				<button
					onClick={onClose}
					className='hover:bg-primary-foreground/20 rounded-full p-2'
				>
					<X className='h-6 w-6' />
				</button>
			</div>

			{pendingRequests.length > 0 && (
				<div className='mt-4'>
					<div className='flex items-center justify-between'>
						<h4 className='text-primary-foreground flex items-center gap-2 font-semibold'>
							<Package className='h-5 w-5' />
							{isAuthor ? 'Yêu cầu trao đổi' : 'Yêu cầu đã gửi'}
							{!isRequestsVisible && (
								<span className='bg-primary-foreground/20 text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
									{pendingRequests.length}
								</span>
							)}
							{isRequestsVisible && currentItem && (
								<span className='bg-primary-foreground/20 text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
									{currentRequestIndex + 1}/{pendingRequests.length}
								</span>
							)}
						</h4>
						<div className='flex items-center gap-2'>
							<button
								onClick={toggleRequestsVisibility}
								className='bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200'
							>
								{isRequestsVisible ? (
									<>
										<EyeOff className='h-4 w-4' /> Ẩn
									</>
								) : (
									<>
										<Eye className='h-4 w-4' /> Hiện
									</>
								)}
							</button>
							{!isAuthor && !isAllConfirmed && (
								<button
									onClick={handleConfirmRequest}
									className='flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-green-600 hover:shadow-xl'
								>
									<Check className='h-4 w-4' /> Xác nhận
								</button>
							)}
							{!isAuthor && isAllConfirmed && (
								<button
									disabled
									className='flex cursor-not-allowed items-center gap-2 rounded-lg bg-green-500/50 px-4 py-2 text-sm font-medium text-white shadow-lg'
								>
									<CheckCircle className='h-4 w-4' /> Đã xác nhận
								</button>
							)}
						</div>
					</div>

					{isRequestsVisible && currentItem && (
						<div className='bg-primary-foreground/10 relative mt-3 rounded-xl p-4 backdrop-blur-sm'>
							{pendingRequests.length > 1 && (
								<>
									<button
										onClick={handlePrevRequest}
										className='bg-primary-foreground/20 hover:bg-primary-foreground/30 absolute top-1/2 -left-1 z-10 -translate-x-2 -translate-y-1/2 rounded-full p-1 backdrop-blur-sm transition-all duration-200'
									>
										<ChevronLeft className='text-primary-foreground h-4 w-4' />
									</button>
									<button
										onClick={handleNextRequest}
										className='bg-primary-foreground/20 hover:bg-primary-foreground/30 absolute top-1/2 -right-1 z-10 translate-x-2 -translate-y-1/2 rounded-full p-1 backdrop-blur-sm transition-all duration-200'
									>
										<ChevronRight className='text-primary-foreground h-4 w-4' />
									</button>
								</>
							)}
							<motion.div
								key={currentItem.itemID || 0}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
								className={`bg-primary-foreground/20 hover:bg-primary-foreground/25 flex items-center gap-4 rounded-lg p-2 transition-all duration-200 ${currentItem.isConfirmed ? 'ring-2 ring-green-400' : ''}`}
							>
								<div className='relative'>
									<img
										src={currentItem.image}
										alt={currentItem.name}
										className='h-16 w-16 rounded-md object-cover shadow-md'
									/>
									<div className='absolute -top-2 -right-2 rounded-full bg-blue-500 px-2 py-1 text-sm font-medium text-white shadow-lg'>
										{currentItem.requestedQuantity}
									</div>
									{currentItem.isConfirmed && (
										<div className='absolute -bottom-1 -left-1 rounded-full bg-green-500 p-1'>
											<CheckCircle className='h-3 w-3 text-white' />
										</div>
									)}
								</div>
								<div className='min-w-0 flex-1'>
									<h5 className='text-primary-foreground mb-1 flex items-center gap-2 text-base font-semibold'>
										{currentItem.name}
										{currentItem.isConfirmed && (
											<span className='rounded-full bg-green-500 px-2 py-1 text-xs font-medium text-white'>
												Đã xác nhận
											</span>
										)}
									</h5>
									<p className='text-primary-foreground/80 mb-2 text-sm'>
										{currentItem.description}
									</p>
									<p className='text-primary-foreground/70 text-xs'>
										{currentItem.categoryName &&
											`${currentItem.categoryName} • `}
										Có sẵn: {currentItem.quantity || 0}
									</p>
								</div>
								<div className='flex items-center gap-3'>
									{isAuthor ? (
										<div className='flex items-center gap-2'>
											{!currentItem.isConfirmed && (
												<button
													onClick={() =>
														handleConfirmSingleRequest(currentItem.itemID || 0)
													}
													className='flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white shadow-lg hover:bg-green-600'
													title='Xác nhận yêu cầu này'
												>
													<Check className='h-4 w-4' /> Xác nhận
												</button>
											)}
											{!isAllConfirmed && (
												<div className='bg-primary-foreground/30 flex items-center gap-2 rounded-lg p-2'>
													<button
														onClick={() =>
															handlePendingQuantityChange(
																currentItem.itemID || 0,
																-1
															)
														}
														className='bg-primary-foreground/40 hover:bg-primary-foreground/60 flex h-8 w-8 items-center justify-center rounded-md'
													>
														<Minus className='text-primary-foreground h-4 w-4' />
													</button>
													<span className='text-primary-foreground w-8 text-center text-sm font-semibold'>
														{currentItem.requestedQuantity}
													</span>
													<button
														onClick={() =>
															handlePendingQuantityChange(
																currentItem.itemID || 0,
																1
															)
														}
														className='bg-primary-foreground/40 hover:bg-primary-foreground/60 flex h-8 w-8 items-center justify-center rounded-md'
													>
														<Plus className='text-primary-foreground h-4 w-4' />
													</button>
												</div>
											)}
										</div>
									) : (
										!isAllConfirmed && (
											<button
												onClick={() =>
													handleRemovePendingRequest(currentItem.itemID || 0)
												}
												className='group flex h-8 w-8 items-center justify-center rounded-md bg-red-500/80 hover:bg-red-500 hover:shadow-lg'
												title='Xóa yêu cầu'
											>
												<X className='h-5 w-5 text-white transition-transform group-hover:scale-110' />
											</button>
										)
									)}
								</div>
							</motion.div>
							{pendingRequests.length > 1 && (
								<div className='mt-3 flex justify-center gap-2'>
									{pendingRequests.map((_, index) => (
										<button
											key={index}
											onClick={() => setCurrentRequestIndex(index)}
											className={`h-2 w-2 rounded-full transition-all duration-200 ${
												index === currentRequestIndex
													? 'bg-primary-foreground w-6'
													: 'bg-primary-foreground/40 hover:bg-primary-foreground/60'
											}`}
										/>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	)
}
