import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Check, Minus, Package, Plus, Send, X } from 'lucide-react'
import React from 'react'

import { ETransactionStatus } from '@/models/enums'
import { IItem, ITransactionItem } from '@/models/interfaces'

interface Props {
	items: IItem[]
	selectedItems: ITransactionItem[]
	isAuthor: boolean
	transactionStatus: ETransactionStatus
	handleItemSelect: (item: IItem) => void
	handleQuantityChange: (itemId: number, change: number) => void
	handleRemoveSelectedItem: (itemId: number) => void
	handleSendRequest: () => void
	setSelectedItems: React.Dispatch<React.SetStateAction<ITransactionItem[]>>
	handleConfirmTransaction: (status: ETransactionStatus) => void
}

const ItemSidebar = ({
	items,
	selectedItems,
	isAuthor,
	transactionStatus,
	handleItemSelect,
	handleQuantityChange,
	handleRemoveSelectedItem,
	handleSendRequest,
	setSelectedItems,
	handleConfirmTransaction
}: Props) => {
	if (items.length === 0) return null
	transactionStatus = transactionStatus.toString() as ETransactionStatus
	return (
		<div className='border-border/50 bg-muted/30 flex w-80 flex-col border-l'>
			{transactionStatus === ETransactionStatus.DEFAULT && !isAuthor && (
				<div className='border-border from-primary/5 to-chart-1/5 border-b bg-gradient-to-r p-4'>
					<h3 className='text-foreground mb-1 flex items-center gap-2 font-semibold'>
						<Package className='text-primary h-5 w-5' />
						Vật phẩm có sẵn
					</h3>
					<p className='text-muted-foreground mb-3 text-xs'>
						Chọn những vật phẩm bạn muốn trao đổi
					</p>

					{selectedItems.length > 0 && (
						<div className='bg-primary/10 border-primary/20 mb-3 rounded-lg border p-3'>
							<div className='mb-2 flex items-center justify-between'>
								<span className='text-primary text-sm font-medium'>
									Đã chọn: {selectedItems.length} vật phẩm
								</span>
								<button
									onClick={() => setSelectedItems([])}
									className='text-muted-foreground hover:text-foreground text-xs'
								>
									Xóa tất cả
								</button>
							</div>

							<div className='mb-3 max-h-28 space-y-2 overflow-y-auto'>
								{selectedItems.map(item => (
									<div
										key={item.itemID || 0}
										className='bg-background/50 flex items-center gap-2 rounded-md p-2'
									>
										<img
											src={item.itemImage}
											alt={item.itemName}
											className='h-8 w-8 rounded object-cover'
										/>
										<div className='min-w-0 flex-1'>
											<p className='truncate text-xs font-medium'>
												{item.itemName}
											</p>
										</div>
										<div className='flex items-center gap-1'>
											<button
												onClick={() =>
													handleQuantityChange(item.itemID || 0, -1)
												}
												className='bg-muted hover:bg-muted/80 flex h-6 w-6 items-center justify-center rounded'
											>
												<Minus className='h-3 w-3' />
											</button>
											<span className='w-6 text-center text-xs font-medium'>
												{item.quantity}
											</span>
											<button
												onClick={() =>
													handleQuantityChange(item.itemID || 0, 1)
												}
												disabled={item.quantity >= (item.currentQuantity || 1)}
												className='bg-muted hover:bg-muted/80 flex h-6 w-6 items-center justify-center rounded disabled:opacity-50'
											>
												<Plus className='h-3 w-3' />
											</button>
											<button
												onClick={() =>
													handleRemoveSelectedItem(item.itemID || 0)
												}
												className='ml-1 text-red-500 hover:text-red-700'
											>
												<X className='h-3 w-3' />
											</button>
										</div>
									</div>
								))}
							</div>

							<button
								onClick={handleSendRequest}
								className='bg-primary hover:bg-primary/90 text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg hover:shadow-xl'
							>
								<Send className='h-4 w-4' />
								Gửi yêu cầu trao đổi
							</button>
						</div>
					)}
				</div>
			)}

			<div
				className={clsx(
					'flex-1 space-y-3 overflow-y-auto p-4'
					// transactionStatus === ETransactionStatus.DEFAULT || isAuthor
					//   ? 'max-h-56'
					//   : 'max-h-full'
				)}
			>
				{items.map(item => {
					const isSelected = selectedItems.some(
						selected => selected.itemID === item.itemID
					)
					const availableQuantity = item.currentQuantity || 0

					return (
						<motion.div
							key={item.itemID || 0}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
								isSelected
									? 'border-primary bg-primary/5 ring-primary/20 shadow-md ring-1'
									: 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
							} ${availableQuantity === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
							onClick={() =>
								availableQuantity > 0 &&
								transactionStatus === ETransactionStatus.DEFAULT &&
								!isAuthor &&
								handleItemSelect(item)
							}
						>
							<div className='flex items-start gap-3'>
								<div className='relative'>
									<img
										src={item.image}
										alt={item.name}
										className='h-14 w-14 flex-shrink-0 rounded-lg object-cover shadow-sm'
									/>
									{isSelected && (
										<div className='bg-primary absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full'>
											<Check className='text-primary-foreground h-3 w-3' />
										</div>
									)}
									<div className='absolute -right-1 -bottom-1 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-medium text-white'>
										{availableQuantity}
									</div>
								</div>
								<div className='min-w-0 flex-1'>
									<h4 className='text-foreground mb-1 truncate text-sm font-semibold'>
										{item.name}
									</h4>
									<p className='text-muted-foreground mb-2 line-clamp-2 text-xs'>
										{item.description}
									</p>
									<div className='flex flex-wrap items-center gap-2'>
										{item.categoryName && (
											<span className='bg-muted text-muted-foreground inline-block rounded-md px-2 py-1 text-xs font-medium'>
												{item.categoryName}
											</span>
										)}
										<span
											className={`inline-block rounded-md px-2 py-1 text-xs font-medium ${
												availableQuantity > 0
													? 'bg-green-100 text-green-700'
													: 'bg-red-100 text-red-700'
											}`}
										>
											{availableQuantity > 0
												? `Còn ${availableQuantity}`
												: 'Hết hàng'}
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					)
				})}
			</div>
			{isAuthor && transactionStatus === ETransactionStatus.PENDING && (
				<div className='grid grid-cols-2 gap-2 p-4'>
					<button
						className='bg-chart-3 rounded-md px-4 py-2 text-white'
						onClick={() =>
							handleConfirmTransaction(ETransactionStatus.CANCELLED)
						}
					>
						Từ chối
					</button>
					<button
						className='bg-chart-1 rounded-md px-4 py-2 text-white'
						onClick={() => handleConfirmTransaction(ETransactionStatus.SUCCESS)}
					>
						Hoàn tất
					</button>
				</div>
			)}
		</div>
	)
}

export default React.memo(ItemSidebar)
