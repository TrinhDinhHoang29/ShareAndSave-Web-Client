import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'
import { motion } from 'framer-motion'
import {
	ArrowRightLeft,
	Check,
	Minus,
	Package,
	Plus,
	Send,
	X
} from 'lucide-react'
import React, { Fragment } from 'react'

import { EMethod } from '@/models/enums'
import { IItem, ITransactionItem } from '@/models/interfaces'
import { methodOptions } from '@/models/options'

interface Props {
	isOpen: boolean
	onClose: () => void
	items: IItem[]
	onCreateTransaction: (
		selectedItems: ITransactionItem[],
		method: EMethod
	) => void
	title?: string
	description?: string
}

const TransactionInterestDialog = ({
	isOpen,
	onClose,
	items,
	onCreateTransaction,
	title = 'Tạo giao dịch',
	description = 'Chọn những vật phẩm bạn muốn trao đổi'
}: Props) => {
	const [selectedItems, setSelectedItems] = React.useState<ITransactionItem[]>(
		[]
	)
	const [selectedMethod, setSelectedMethod] = React.useState<EMethod>(
		methodOptions[0].value as EMethod
	)

	// Reset state when dialog opens/closes
	React.useEffect(() => {
		if (!isOpen) {
			setSelectedItems([])
			setSelectedMethod(methodOptions[0].value as EMethod)
		}
	}, [isOpen])

	const handleItemSelect = (item: IItem) => {
		const existingItem = selectedItems.find(
			selected => selected.itemID === item.itemID
		)

		if (existingItem) {
			// Remove item if already selected
			setSelectedItems(prev =>
				prev.filter(selected => selected.itemID !== item.itemID)
			)
		} else {
			// Add item with quantity 1
			const newItem: ITransactionItem = {
				postItemID: item.id,
				itemID: item.itemID || 0,
				itemName: item.name,
				itemImage: item.image,
				quantity: 1,
				currentQuantity: item.currentQuantity || 0
			}
			setSelectedItems(prev => [...prev, newItem])
		}
	}

	const handleQuantityChange = (itemId: number, change: number) => {
		setSelectedItems(prev =>
			prev.map(item => {
				if (item.itemID === itemId) {
					const newQuantity = Math.max(1, item.quantity + change)
					const maxQuantity = item.currentQuantity || 1
					return {
						...item,
						quantity: Math.min(newQuantity, maxQuantity)
					}
				}
				return item
			})
		)
	}

	const handleRemoveSelectedItem = (itemId: number) => {
		setSelectedItems(prev => prev.filter(item => item.itemID !== itemId))
	}

	const handleCreateTransaction = () => {
		if (selectedItems.length > 0) {
			onCreateTransaction(selectedItems, selectedMethod)
			onClose()
		}
	}

	const handleClearAll = () => {
		setSelectedItems([])
	}

	return (
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
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/25 backdrop-blur-sm' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='bg-card w-full max-w-6xl transform overflow-hidden rounded-2xl shadow-2xl transition-all'>
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: 20 }}
									className='flex max-h-[85vh] flex-col'
								>
									{/* Header */}
									<div className='border-border bg-card flex items-center justify-between border-b px-6 py-4'>
										<div className='flex items-center gap-3'>
											<div className='bg-primary text-primary-foreground flex h-10 w-10 items-center justify-center rounded-lg'>
												<ArrowRightLeft className='h-5 w-5' />
											</div>
											<div>
												<Dialog.Title className='text-foreground text-lg font-semibold'>
													{title}
												</Dialog.Title>
												<p className='text-muted-foreground text-sm'>
													{description}
												</p>
											</div>
										</div>
										<button
											onClick={onClose}
											className='text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-2 transition-colors'
										>
											<X className='h-5 w-5' />
										</button>
									</div>

									{/* Main Content */}
									<div className='flex flex-1 overflow-hidden'>
										{/* Items Grid */}
										<div className='flex flex-1 flex-col'>
											{/* Method Selection */}
											<div className='border-border bg-muted/30 border-b px-6 py-4'>
												<p className='text-foreground mb-3 text-sm font-medium'>
													Phương thức giao dịch:
												</p>
												<div className='bg-background flex max-w-md rounded-lg p-1'>
													{methodOptions.map(option => (
														<div
															key={option.value}
															onClick={() => setSelectedMethod(option.value)}
															className={clsx(
																'flex-1 cursor-pointer rounded-md px-4 py-2 text-center text-sm font-medium transition-all duration-200',
																selectedMethod === option.value
																	? 'bg-primary text-primary-foreground shadow-sm'
																	: 'text-muted-foreground hover:text-foreground hover:bg-muted/50 border'
															)}
														>
															{option.label}
														</div>
													))}
												</div>
											</div>

											{/* Items List */}
											<div className='flex-1 overflow-y-auto p-6'>
												{items.length === 0 ? (
													<div className='text-muted-foreground flex flex-col items-center justify-center py-16'>
														<Package className='mb-4 h-16 w-16 opacity-50' />
														<p className='mb-2 text-lg font-medium'>
															Không có vật phẩm nào
														</p>
														<p className='text-sm'>
															Hiện tại không có vật phẩm nào để trao đổi
														</p>
													</div>
												) : (
													<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
														{items.map(item => {
															const isSelected = selectedItems.some(
																selected => selected.itemID === item.itemID
															)
															const availableQuantity =
																item.currentQuantity || 0

															return (
																<motion.div
																	key={item.itemID || 0}
																	initial={{ opacity: 0, y: 10 }}
																	animate={{ opacity: 1, y: 0 }}
																	className={clsx(
																		'group cursor-pointer rounded-xl border p-4 transition-all duration-200',
																		isSelected
																			? 'border-primary bg-primary/5 ring-primary/20 shadow-lg ring-1'
																			: 'border-border bg-card hover:border-primary/50 hover:shadow-md',
																		availableQuantity === 0 &&
																			'cursor-not-allowed opacity-50'
																	)}
																	onClick={() =>
																		availableQuantity > 0 &&
																		handleItemSelect(item)
																	}
																>
																	<div className='flex items-start gap-3'>
																		<div className='relative flex-shrink-0'>
																			<img
																				src={item.image}
																				alt={item.name}
																				className='h-16 w-16 rounded-lg object-cover shadow-sm'
																			/>
																			{isSelected && (
																				<div className='bg-primary absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full shadow-md'>
																					<Check className='text-primary-foreground h-3 w-3' />
																				</div>
																			)}
																			<div className='bg-accent text-accent-foreground absolute -right-1 -bottom-1 rounded-full px-2 py-0.5 text-xs font-medium shadow-sm'>
																				{availableQuantity}
																			</div>
																		</div>
																		<div className='min-w-0 flex-1'>
																			<h4 className='text-foreground mb-2 line-clamp-1 font-semibold'>
																				{item.name}
																			</h4>
																			<div className='flex flex-wrap items-center gap-2'>
																				{item.categoryName && (
																					<span className='bg-muted text-muted-foreground inline-block rounded-md px-2 py-1 text-xs font-medium'>
																						{item.categoryName}
																					</span>
																				)}
																				<span
																					className={clsx(
																						'inline-block rounded-md px-2 py-1 text-xs font-medium',
																						availableQuantity > 0
																							? 'bg-success/10 text-success'
																							: 'bg-destructive/10 text-destructive'
																					)}
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
												)}
											</div>
										</div>

										{/* Selected Items Cart */}
										{selectedItems.length > 0 && (
											<div className='border-border bg-sidebar flex w-80 flex-col border-l'>
												{/* Cart Header */}
												<div className='border-sidebar-border bg-sidebar-accent/30 border-b p-4'>
													<div className='mb-3 flex items-center justify-between'>
														<h3 className='text-sidebar-foreground flex items-center gap-2 font-semibold'>
															<ArrowRightLeft className='text-sidebar-primary h-5 w-5' />
															Món đồ bạn đã chọn
														</h3>
														<button
															onClick={handleClearAll}
															className='text-muted-foreground hover:text-destructive text-xs transition-colors'
														>
															Xóa tất cả
														</button>
													</div>
													<p className='text-sidebar-primary text-sm font-medium'>
														{selectedItems.length} vật phẩm đã chọn
													</p>
												</div>

												{/* Selected Items List */}
												<div className='flex-1 overflow-y-auto p-4'>
													<div className='space-y-3'>
														{selectedItems.map(item => (
															<motion.div
																key={item.itemID || 0}
																initial={{ opacity: 0, x: 20 }}
																animate={{ opacity: 1, x: 0 }}
																exit={{ opacity: 0, x: 20 }}
																className='bg-card border-border flex items-center gap-3 rounded-lg border p-3 shadow-sm'
															>
																<img
																	src={item.itemImage}
																	alt={item.itemName}
																	className='h-12 w-12 flex-shrink-0 rounded object-cover'
																/>
																<div className='min-w-0 flex-1'>
																	<p className='text-foreground line-clamp-1 text-sm font-medium'>
																		{item.itemName}
																	</p>
																	<div className='mt-2 flex items-center gap-2'>
																		<button
																			onClick={() =>
																				handleQuantityChange(
																					item.itemID || 0,
																					-1
																				)
																			}
																			className={clsx(
																				'flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200',
																				item.quantity <= 1
																					? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
																					: 'bg-primary hover:bg-primary/90 text-primary-foreground'
																			)}
																		>
																			<Minus className='h-3 w-3' />
																		</button>
																		<span className='text-foreground w-8 text-center text-sm font-medium'>
																			{item.quantity}
																		</span>
																		<button
																			onClick={() =>
																				handleQuantityChange(
																					item.itemID || 0,
																					1
																				)
																			}
																			disabled={
																				item.quantity >=
																				(item.currentQuantity || 1)
																			}
																			className={clsx(
																				'flex h-7 w-7 items-center justify-center rounded-md transition-all duration-200',
																				item.quantity >=
																					(item.currentQuantity || 1)
																					? 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
																					: 'bg-primary hover:bg-primary/90 text-primary-foreground'
																			)}
																		>
																			<Plus className='h-3 w-3' />
																		</button>
																		<button
																			onClick={() =>
																				handleRemoveSelectedItem(
																					item.itemID || 0
																				)
																			}
																			className='text-primary-foreground bg-error hover:bg-error/90 ml-auto rounded-full p-1 transition-colors'
																		>
																			<X className='h-4 w-4' />
																		</button>
																	</div>
																</div>
															</motion.div>
														))}
													</div>
												</div>

												{/* Create Transaction Button */}
												<div className='border-sidebar-border border-t p-4'>
													<motion.button
														whileHover={{ scale: 1.02 }}
														whileTap={{ scale: 0.98 }}
														onClick={handleCreateTransaction}
														className='bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-colors'
													>
														<Send className='h-4 w-4' />
														Tạo giao dịch ({selectedItems.length})
													</motion.button>
												</div>
											</div>
										)}
									</div>

									{/* Empty State Action */}
									{selectedItems.length === 0 && (
										<div className='border-border bg-muted/30 border-t px-6 py-4'>
											<p className='text-muted-foreground text-center text-sm'>
												Chọn ít nhất một vật phẩm để tạo giao dịch
											</p>
										</div>
									)}
								</motion.div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default React.memo(TransactionInterestDialog)
