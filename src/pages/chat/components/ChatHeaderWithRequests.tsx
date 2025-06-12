import clsx from 'clsx'
import { motion } from 'framer-motion'
import {
	ArrowLeft,
	Check,
	ChevronLeft,
	ChevronRight,
	Eye,
	EyeOff,
	Minus,
	Package,
	Plus,
	X
} from 'lucide-react'
import { useState } from 'react'

import Loading from '@/components/common/Loading'
import { getTransactionStatusConfig } from '@/models/constants'
import { ETransactionStatus } from '@/models/enums'
import { IReceiver, ITransaction, ITransactionItem } from '@/models/interfaces'

import { TransactionsDialog } from './TransactionDialog'

interface Props {
	receiver: IReceiver
	postTitle: string
	transactionItems: ITransactionItem[]
	currentRequestIndex: number
	isRequestsVisible: boolean
	transactionStatus: ETransactionStatus
	isAuthor: boolean
	onClose: () => void // Giữ onClose nhưng thay bằng logic quay lại
	toggleRequestsVisibility: () => void
	handlePrevRequest: () => void
	handleNextRequest: () => void
	handleConfirmRequest: () => void
	handleRemovePendingRequest: (itemId: number, index: number) => void
	handleQuantityChange: (itemId: number, change: number) => void
	setCurrentRequestIndex: (index: number) => void
	isCreateTransactionPending: boolean
	isUpdateTransactionPending: boolean
	transactions: ITransaction[]
	handleApplyItemTransactions: (index: number) => void
}

export const ChatHeaderWithRequests = ({
	receiver,
	postTitle,
	transactionItems,
	currentRequestIndex,
	isRequestsVisible,
	transactionStatus,
	isAuthor,
	onClose,
	toggleRequestsVisibility,
	handlePrevRequest,
	handleNextRequest,
	handleConfirmRequest,
	handleRemovePendingRequest,
	handleQuantityChange, // Sử dụng prop mới
	setCurrentRequestIndex,
	isCreateTransactionPending,
	isUpdateTransactionPending,
	transactions,
	handleApplyItemTransactions
}: Props) => {
	transactionStatus = transactionStatus.toString() as ETransactionStatus
	const currentItem = transactionItems[currentRequestIndex]
	const transactionStatusConfig = getTransactionStatusConfig(
		isAuthor,
		transactionStatus
	)
	const TransactionIconStatus = transactionStatusConfig.icon
	const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false)

	const handleTransactionSelect = (index: number) => {
		const status = transactions[index]?.status.toString() as ETransactionStatus
		if (isAuthor && status === ETransactionStatus.PENDING) {
			setCurrentRequestIndex(0)
			handleApplyItemTransactions(index)
			setIsTransactionDialogOpen(false)
		}
	}

	return (
		<>
			<div className='bg-primary text-primary-foreground px-6 py-4'>
				{/* Header với nút quay lại */}
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<button
							onClick={onClose}
							className='hover:bg-primary-foreground/20 rounded-full p-2'
						>
							<ArrowLeft className='text-primary-foreground h-6 w-6' />
						</button>
						<div>
							<h3 className='font-manrope text-lg font-semibold'>
								{receiver.name}
							</h3>
							<p className='text-primary-foreground/90 text-sm'>{postTitle}</p>
						</div>
					</div>
					<div className='relative'>
						<button
							title='Giao dịch của tôi'
							onClick={() => setIsTransactionDialogOpen(true)}
							className='bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200'
						>
							<Package className='h-6 w-6' />
						</button>
						<div className='bg-background/80 text-foreground absolute -top-2 -right-2 rounded-full px-2 py-1 text-sm font-medium shadow-lg'>
							{transactions.length}
						</div>
					</div>
				</div>

				{transactionItems.length > 0 && (
					<div className='mt-4'>
						<div className='flex items-center justify-between'>
							<h4 className='text-primary-foreground flex items-center gap-2 font-semibold'>
								<Package className='h-5 w-5' />
								{isAuthor ? 'Yêu cầu giao dịch' : 'Yêu cầu đã gửi'}
								{!isRequestsVisible && (
									<span className='bg-primary-foreground/20 text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
										{transactionItems.length}
									</span>
								)}
								{isRequestsVisible && currentItem && (
									<span className='bg-primary-foreground/20 text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
										{currentRequestIndex + 1}/{transactionItems.length}
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
								{transactionStatus !== ETransactionStatus.DEFAULT && (
									<div
										className={clsx(
											'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-lg',
											transactionStatusConfig.background,
											transactionStatusConfig.textColor
										)}
									>
										<TransactionIconStatus className='h-4 w-4' />
										{transactionStatusConfig.label}
									</div>
								)}
								{((!isAuthor &&
									transactionStatus === ETransactionStatus.DEFAULT) ||
									(isAuthor &&
										transactionStatus === ETransactionStatus.PENDING)) && (
									<button
										disabled={
											isCreateTransactionPending || isUpdateTransactionPending
										}
										onClick={handleConfirmRequest}
										className={clsx(
											'bg-chart-1/90 hover:bg-chart-1 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-lg hover:shadow-xl'
										)}
									>
										{isCreateTransactionPending ||
										isUpdateTransactionPending ? (
											<Loading size='sm' />
										) : (
											<Check className='h-4 w-4' />
										)}{' '}
										Xác nhận
									</button>
								)}
							</div>
						</div>

						{isRequestsVisible && currentItem && (
							<div className='bg-primary-foreground/10 relative mt-3 rounded-xl p-4 backdrop-blur-sm'>
								{transactionItems.length > 1 && (
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
									className={clsx(
										`bg-primary-foreground/20 hover:bg-primary-foreground/25 flex items-center gap-4 rounded-lg p-2 transition-all duration-200`,
										transactionStatusConfig.border
									)}
								>
									<div className='relative'>
										<img
											src={currentItem.itemImage}
											alt={currentItem.itemName}
											className='h-16 w-16 rounded-md object-cover shadow-md'
										/>
										{transactionStatus !== ETransactionStatus.DEFAULT && (
											<div
												className={clsx(
													'absolute -top-1 -right-1 rounded-full p-1',
													transactionStatusConfig.background
												)}
											>
												<TransactionIconStatus className='h-3 w-3 text-white' />
											</div>
										)}
									</div>
									<div className='min-w-0 flex-1'>
										<h5 className='text-primary-foreground mb-1 flex items-center gap-2 text-base font-semibold'>
											{currentItem.itemName}
										</h5>
										<p className='text-primary-foreground/70 text-xs'>
											Số lượng yêu cầu: {currentItem.quantity}
										</p>
									</div>
									<div className='flex items-center gap-3'>
										{transactionStatus === ETransactionStatus.DEFAULT && (
											<button
												onClick={() =>
													handleRemovePendingRequest(
														currentItem.itemID || 0,
														currentRequestIndex
													)
												}
												className='group flex h-8 w-8 items-center justify-center rounded-md bg-red-500/80 hover:bg-red-500 hover:shadow-lg'
												title='Xóa yêu cầu'
											>
												<X className='h-5 w-5 text-white transition-transform group-hover:scale-110' />
											</button>
										)}
										{transactionStatus === ETransactionStatus.PENDING &&
											isAuthor && (
												<div className='bg-card border-border flex items-center gap-2 rounded-lg border p-1 shadow-sm'>
													<button
														onClick={() =>
															handleQuantityChange(currentItem.itemID || 0, -1)
														}
														className='bg-muted hover:bg-accent group button-ripple flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'
														disabled={currentItem.quantity <= 1}
													>
														<Minus className='text-muted-foreground group-hover:text-accent-foreground h-3.5 w-3.5 transition-colors' />
													</button>

													<div className='flex min-w-[32px] items-center justify-center px-2'>
														<span className='text-foreground text-sm font-medium tabular-nums'>
															{currentItem.quantity}
														</span>
													</div>

													<button
														onClick={() =>
															handleQuantityChange(currentItem.itemID || 0, 1)
														}
														disabled={
															currentItem.quantity >=
															(currentItem.currentQuantity || 1)
														}
														className='bg-primary hover:bg-primary/90 group button-ripple flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50'
													>
														<Plus className='text-primary-foreground h-3.5 w-3.5 transition-colors' />
													</button>
												</div>
											)}
									</div>
								</motion.div>
								{transactionItems.length > 1 && (
									<div className='mt-3 flex justify-center gap-2'>
										{transactionItems.map((_, index) => (
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
			<TransactionsDialog
				isOpen={isTransactionDialogOpen}
				onClose={() => setIsTransactionDialogOpen(false)}
				transactions={transactions}
				isAuthor={isAuthor}
				handleTransactionSelect={handleTransactionSelect}
			/>
		</>
	)
}
