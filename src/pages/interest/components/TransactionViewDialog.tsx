import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { Fragment, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import Loading from '@/components/common/Loading'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import { getTransactionStatusConfig } from '@/models/constants'
import { ESortOrder, ETransactionStatus } from '@/models/enums'
import { ITransaction, ITransactionParams } from '@/models/interfaces'

interface TransactionViewDialogProps {
	isOpen: boolean
	onClose: () => void
	postID: number
	interestID: number
}

interface TransactionItemProps {
	transaction: ITransaction
	index: number
	onSelect?: (index: number) => void
}

const TransactionItem = ({ transaction }: TransactionItemProps) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const status = transaction.status.toString() as ETransactionStatus
	const statusConfig = getTransactionStatusConfig(false, status) // Removed isAuthor dependency
	const { Icon: StatusIcon } = statusConfig

	const handleToggle = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<div className='border-border overflow-hidden rounded-lg border shadow-sm'>
			{/* Collapse Header */}
			<div
				onClick={handleToggle}
				className='hover:bg-muted focus:ring-primary/50 w-full cursor-pointer p-4 text-left transition-colors duration-200 focus:ring-2 focus:outline-none focus:ring-inset'
			>
				<div className='flex items-center justify-between'>
					<div className='min-w-0 flex-1'>
						{/* Time */}
						<div className='text-foreground mb-1 text-sm font-medium'>
							{formatNearlyDateTimeVN(transaction.updatedAt)}
						</div>

						{/* Items count and Status */}
						<div className='text-muted-foreground flex items-center gap-3 text-sm'>
							<span className='flex items-center gap-1'>
								<span className='font-medium'>{transaction.items.length}</span>
								<span>món đồ</span>
							</span>
						</div>
					</div>

					<div className='flex items-center gap-4'>
						{transaction.method && (
							<div
								className={`bg-primary/80 text-primary-foreground flex items-center gap-2 rounded-full p-2 text-xs font-medium`}
							>
								<span>{transaction.method}</span>
							</div>
						)}

						<div
							className={`flex items-center gap-2 rounded-full p-2 text-xs font-medium ${statusConfig.background} ${statusConfig.textColor}`}
						>
							<StatusIcon className='h-3 w-3' />
							<span>{statusConfig.label}</span>
						</div>

						<ChevronDown
							className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${
								isExpanded ? 'rotate-180' : ''
							}`}
						/>
					</div>
				</div>
			</div>

			{/* Collapse Content */}
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className='border-border border-t'
					>
						<div className='bg-muted/50 p-4'>
							<div className='space-y-3'>
								{transaction.items.map((item, itemIndex) => (
									<motion.div
										key={item.itemID || itemIndex}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											duration: 0.2,
											delay: itemIndex * 0.05,
											ease: 'easeOut'
										}}
										className='bg-card border-border flex items-center gap-3 rounded-lg border p-3 shadow-sm'
									>
										{/* Item Image */}
										<div className='flex-shrink-0'>
											<img
												src={item.itemImage}
												alt={item.itemName}
												className='border-border h-12 w-12 rounded-lg border object-cover'
												onError={e => {
													const target = e.target as HTMLImageElement
													target.src =
														'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGggND0iNDAiIGhlaWdodD0iNDAiIGZpbGw9IiNGRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
												}}
											/>
										</div>

										{/* Item Info */}
										<div className='min-w-0 flex-1'>
											<h4 className='text-foreground truncate text-sm font-medium'>
												{item.itemName}
											</h4>
											<p className='text-muted-foreground mt-1 text-xs'>
												Số lượng yêu cầu:{' '}
												<span className='text-foreground font-medium'>
													{item.quantity}
												</span>
											</p>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export const TransactionViewDialog = ({
	isOpen,
	onClose,
	postID,
	interestID
}: TransactionViewDialogProps) => {
	// TanStack Query for transactions with infinite scroll
	const transactionParams: ITransactionParams = useMemo(
		() => ({
			postID: postID,
			searchBy: 'interestID',
			searchValue: interestID.toString(),
			sort: 'createdAt',
			page: 1,
			order: ESortOrder.DESC
		}),
		[interestID]
	)

	const {
		data: transactionData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		isError
	} = useListTransactionQuery(transactionParams)

	// Flatten transactions from all pages
	const transactions = useMemo(() => {
		return transactionData?.pages.flatMap(page => page.transactions) || []
	}, [transactionData])

	// Intersection Observer for infinite scroll
	const { ref: sentinelRef, inView } = useInView({
		threshold: 0.5,
		rootMargin: '100px'
	})

	// Trigger fetch next page when sentinel is in view
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

	return (
		<AnimatePresence>
			{isOpen && (
				<Transition
					appear
					show={isOpen}
					as={Fragment}
				>
					<Dialog
						as='div'
						className='relative z-50'
						onClose={onClose}
					>
						{/* Backdrop */}
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-200'
							enterFrom='opacity-0'
							enterTo='opacity-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100'
							leaveTo='opacity-0'
						>
							<motion.div
								className='bg-background/50 fixed inset-0 backdrop-blur-sm'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2, ease: 'easeInOut' }}
							/>
						</Transition.Child>

						{/* Dialog */}
						<div className='fixed inset-0 flex items-center justify-center p-4'>
							<Transition.Child
								as={Fragment}
								enter='ease-out duration-200'
								enterFrom='opacity-0 scale-95 translate-y-5'
								enterTo='opacity-100 scale-100 translate-y-0'
								leave='ease-in duration-200'
								leaveFrom='opacity-100 scale-100 translate-y-0'
								leaveTo='opacity-0 scale-95 translate-y-5'
							>
								<Dialog.Panel
									as={motion.div}
									initial={{ opacity: 0, scale: 0.95, y: 10 }}
									animate={{ opacity: 1, scale: 1, y: 0 }}
									exit={{ opacity: 0, scale: 0.95, y: 10 }}
									className='bg-card mx-auto w-full max-w-2xl overflow-hidden rounded-2xl shadow-xl'
								>
									{/* Header */}
									<div className='bg-card border-border border-b px-6 py-4'>
										<div className='flex items-center justify-between'>
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration: 0.2,
													delay: 0.1,
													ease: 'easeOut'
												}}
											>
												<Dialog.Title
													as='h1'
													className='text-foreground text-xl font-bold'
												>
													Danh sách giao dịch
												</Dialog.Title>
												<Dialog.Description
													as='p'
													className='text-muted-foreground mt-1 text-sm'
												>
													Xem chi tiết các giao dịch
												</Dialog.Description>
											</motion.div>

											<button
												onClick={onClose}
												className='text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-primary/50 rounded-full p-2 transition-colors duration-200 focus:ring-2 focus:outline-none'
												aria-label='Đóng'
											>
												<X className='h-5 w-5' />
											</button>
										</div>
									</div>

									{/* Content */}
									<div className='max-h-[60vh] overflow-y-auto'>
										<div className='p-6'>
											{isLoading ? (
												<div className='py-12'>
													<Loading
														size='lg'
														color='primary'
													/>
												</div>
											) : isError ? (
												<motion.div
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.3 }}
													className='py-12 text-center'
												>
													<p className='text-destructive text-lg font-medium'>
														Có lỗi xảy ra khi tải dữ liệu
													</p>
													<p className='text-muted-foreground mt-1 text-sm'>
														Vui lòng thử lại sau
													</p>
												</motion.div>
											) : transactions.length > 0 ? (
												<motion.div
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													transition={{ duration: 0.3, delay: 0.2 }}
													className='space-y-4'
												>
													{transactions.map((transaction, index) => (
														<motion.div
															key={transaction.id}
															initial={{ opacity: 0, y: 20 }}
															animate={{ opacity: 1, y: 0 }}
															transition={{
																duration: 0.3,
																delay: 0.1 + index * 0.05,
																ease: 'easeOut'
															}}
														>
															<TransactionItem
																transaction={transaction}
																index={index}
															/>
														</motion.div>
													))}

													{/* Loading spinner for infinite scroll */}
													{isFetchingNextPage && (
														<div className='flex justify-center py-4'>
															<Loading
																size='sm'
																color='secondary'
															/>
														</div>
													)}

													{/* Sentinel for infinite scroll */}
													{hasNextPage && (
														<div
															ref={sentinelRef}
															style={{ height: '1px' }}
														/>
													)}

													{/* End of list indicator */}
													{!hasNextPage && transactions.length > 0 && (
														<div className='py-4 text-center'>
															<span className='text-muted-foreground text-sm'>
																Đã hiển thị tất cả giao dịch
															</span>
														</div>
													)}
												</motion.div>
											) : (
												<motion.div
													initial={{ opacity: 0, y: 20 }}
													animate={{ opacity: 1, y: 0 }}
													transition={{ duration: 0.3, delay: 0.2 }}
													className='py-12 text-center'
												>
													<div className='text-muted-foreground mx-auto mb-4 h-24 w-24'>
														<svg
															fill='currentColor'
															viewBox='0 0 24 24'
														>
															<path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' />
														</svg>
													</div>
													<p className='text-muted-foreground text-lg font-medium'>
														Không có giao dịch nào
													</p>
													<p className='text-muted-foreground mt-1 text-sm'>
														Các giao dịch sẽ xuất hiện ở đây
													</p>
												</motion.div>
											)}
										</div>
									</div>

									{/* Footer */}
									<div className='bg-card border-border border-t px-6 py-4'>
										<div className='flex justify-end'>
											<button
												type='button'
												className='bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:ring-primary/50 rounded-lg px-6 py-2.5 font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none'
												onClick={onClose}
											>
												Đóng
											</button>
										</div>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition>
			)}
		</AnimatePresence>
	)
}
