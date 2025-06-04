import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Minus, Package, Plus, Send, User, X } from 'lucide-react'
import React, { Fragment, useState } from 'react'

import useAuthStore from '@/stores/authStore'

export interface IItem {
	id: number
	categoryID: number
	name: string
	description: string
	image: string
	alternativeImage: string
	itemID?: number
	categoryName?: string
	quantity?: number
}

interface RequestItem extends IItem {
	requestedQuantity: number
}

export const ChatDialog = ({
	userName,
	postTitle,
	onClose,
	items = [],
	userId
}: {
	userName: string
	postTitle: string
	onClose: () => void
	items?: IItem[]
	userId: number
}) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([
		{
			id: 1,
			sender: 'other',
			text: 'Xin chào, tôi quan tâm đến bài đăng của bạn.',
			time: '10:30'
		},
		{
			id: 2,
			sender: 'user',
			text: 'Chào bạn! Cảm ơn bạn đã quan tâm. Bạn cần thêm thông tin gì không?',
			time: '10:32'
		}
	])

	// State cho việc quản lý yêu cầu
	const [selectedItems, setSelectedItems] = useState<RequestItem[]>([])
	const [pendingRequests, setPendingRequests] = useState<RequestItem[]>([])
	const { user } = useAuthStore()
	const authorId = user?.id

	const isAuthor = userId === authorId
	const hasItems = items && items.length > 0

	const handleSend = () => {
		if (message.trim()) {
			setMessages([
				...messages,
				{
					id: messages.length + 1,
					sender: 'user',
					text: message,
					time: new Date().toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			])
			setMessage('')
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	// Xử lý chọn item (cho người không phải tác giả) - chỉ toggle select, không thêm vào header ngay
	const handleItemSelect = (item: IItem) => {
		const existingItem = selectedItems.find(selected => selected.id === item.id)
		if (existingItem) {
			setSelectedItems(
				selectedItems.filter(selected => selected.id !== item.id)
			)
		} else {
			setSelectedItems([...selectedItems, { ...item, requestedQuantity: 1 }])
		}
	}

	// Thay đổi số lượng yêu cầu
	const handleQuantityChange = (
		itemId: number,
		change: number,
		isRequest = false
	) => {
		if (isRequest) {
			setPendingRequests(prev =>
				prev.map(item =>
					item.id === itemId
						? {
								...item,
								requestedQuantity: Math.max(1, item.requestedQuantity + change)
							}
						: item
				)
			)
		} else {
			setSelectedItems(prev =>
				prev.map(item => {
					if (item.id === itemId) {
						const originalItem = items.find(i => i.id === itemId)
						const maxQuantity = originalItem?.quantity || 1
						const newQuantity = Math.max(
							1,
							Math.min(maxQuantity, item.requestedQuantity + change)
						)
						return { ...item, requestedQuantity: newQuantity }
					}
					return item
				})
			)
		}
	}

	// Xóa item khỏi danh sách đã chọn
	const handleRemoveSelectedItem = (itemId: number) => {
		setSelectedItems(prev => prev.filter(item => item.id !== itemId))
	}

	// Gửi yêu cầu trao đổi
	const handleSendRequest = () => {
		if (selectedItems.length > 0) {
			setPendingRequests([...pendingRequests, ...selectedItems])
			setSelectedItems([])
			// Ở đây có thể thêm logic gửi API
		}
	}

	// Xóa item khỏi pending requests (ở header)
	const handleRemovePendingRequest = (itemId: number) => {
		setPendingRequests(prev => prev.filter(item => item.id !== itemId))
	}

	// Xác nhận yêu cầu (cho tác giả)
	const handleConfirmRequest = () => {
		// Logic xử lý xác nhận yêu cầu
		console.log('Confirming requests:', pendingRequests)
		// Có thể clear requests sau khi xác nhận
		setPendingRequests([])
	}

	return (
		<Transition
			appear
			show={true}
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
						className='fixed inset-0 bg-black/60 backdrop-blur-sm'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>
				</Transition.Child>

				{/* Panel */}
				<div className='fixed inset-0 flex items-center justify-center p-4'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-90 translate-y-5'
						enterTo='opacity-100 scale-100 translate-y-0'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100 translate-y-0'
						leaveTo='opacity-0 scale-90 translate-y-5'
					>
						<Dialog.Panel
							as={motion.div}
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className='bg-card flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl'
						>
							{/* Main Chat Area */}
							<div className='flex flex-1 flex-col'>
								{/* Header */}
								<div className={`bg-primary text-primary-foreground p-6`}>
									<div className='flex items-start justify-between'>
										<div className='flex items-center space-x-3'>
											<div className='bg-primary-foreground/20 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm'>
												<User className='h-6 w-6' />
											</div>
											<div>
												<Dialog.Title
													as='h3'
													className='font-manrope text-lg font-semibold'
												>
													{userName}
												</Dialog.Title>
												<p className='text-primary-foreground/90 text-sm'>
													{postTitle}
												</p>
											</div>
										</div>
										<button
											onClick={onClose}
											className='hover:bg-primary-foreground/20 rounded-full p-2 transition-colors duration-200'
											aria-label='Đóng'
										>
											<X className='h-6 w-6' />
										</button>
									</div>

									{/* Pending Requests Display - Chỉ hiển thị khi đã gửi yêu cầu */}
									{pendingRequests.length > 0 && (
										<div className='bg-primary-foreground/10 mt-4 rounded-xl p-4 backdrop-blur-sm'>
											{/* Header */}
											<div className='mb-4 flex items-center justify-between'>
												<h4 className='text-primary-foreground flex items-center gap-2 font-semibold'>
													<Package className='h-5 w-5' />
													{isAuthor ? 'Yêu cầu trao đổi' : 'Yêu cầu đã gửi'}
													<span className='bg-primary-foreground/20 text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
														{pendingRequests.length}
													</span>
												</h4>
												{isAuthor && (
													<button
														onClick={handleConfirmRequest}
														className='flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-green-600 hover:shadow-xl'
													>
														<Check className='h-4 w-4' />
														Xác nhận tất cả
													</button>
												)}
											</div>

											{/* Items Grid */}
											<div className='grid max-h-32 grid-cols-1 gap-3 overflow-y-auto'>
												{pendingRequests.map(item => (
													<motion.div
														key={item.id}
														initial={{ opacity: 0, scale: 0.95 }}
														animate={{ opacity: 1, scale: 1 }}
														exit={{ opacity: 0, scale: 0.95 }}
														className='bg-primary-foreground/20 hover:bg-primary-foreground/30 flex items-center gap-3 rounded-lg p-3 transition-all duration-200'
													>
														<div className='relative'>
															<img
																src={item.image}
																alt={item.name}
																className='h-12 w-12 rounded-lg object-cover shadow-md'
															/>
															<div className='absolute -top-1 -right-1 rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-medium text-white'>
																{item.requestedQuantity}
															</div>
														</div>

														<div className='min-w-0 flex-1'>
															<h5 className='text-primary-foreground truncate text-sm font-medium'>
																{item.name}
															</h5>
															<p className='text-primary-foreground/70 mt-1 text-xs'>
																{item.categoryName && `${item.categoryName} • `}
																Có sẵn: {item.quantity || 0}
															</p>
														</div>

														<div className='flex items-center gap-2'>
															{isAuthor ? (
																// Điều chỉnh cho tác giả
																<div className='bg-primary-foreground/20 flex items-center gap-1 rounded-lg p-1'>
																	<button
																		onClick={() =>
																			handleQuantityChange(item.id, -1, true)
																		}
																		className='bg-primary-foreground/30 hover:bg-primary-foreground/50 flex h-7 w-7 items-center justify-center rounded-md transition-colors'
																	>
																		<Minus className='text-primary-foreground h-3 w-3' />
																	</button>
																	<span className='text-primary-foreground w-8 text-center text-sm font-medium'>
																		{item.requestedQuantity}
																	</span>
																	<button
																		onClick={() =>
																			handleQuantityChange(item.id, 1, true)
																		}
																		className='bg-primary-foreground/30 hover:bg-primary-foreground/50 flex h-7 w-7 items-center justify-center rounded-md transition-colors'
																	>
																		<Plus className='text-primary-foreground h-3 w-3' />
																	</button>
																</div>
															) : (
																// Nút xóa cho người gửi yêu cầu
																<button
																	onClick={() =>
																		handleRemovePendingRequest(item.id)
																	}
																	className='group flex h-8 w-8 items-center justify-center rounded-md bg-red-500/80 transition-colors hover:bg-red-500'
																	title='Xóa yêu cầu'
																>
																	<X className='h-4 w-4 text-white transition-transform group-hover:scale-110' />
																</button>
															)}
														</div>
													</motion.div>
												))}
											</div>
										</div>
									)}
								</div>

								{/* Messages */}
								<div className='bg-muted max-h-[400px] min-h-[350px] flex-1 overflow-y-auto p-6'>
									<AnimatePresence>
										{messages.map(msg => (
											<motion.div
												key={msg.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
											>
												<div
													className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
														msg.sender === 'user'
															? `bg-primary text-primary-foreground rounded-br-md`
															: 'border-border bg-card text-foreground rounded-bl-md border'
													}`}
												>
													<p className='text-sm leading-relaxed'>{msg.text}</p>
													<p
														className={`mt-2 text-xs ${
															msg.sender === 'user'
																? 'text-primary-foreground/70'
																: 'text-muted-foreground'
														}`}
													>
														{msg.time}
													</p>
												</div>
											</motion.div>
										))}
									</AnimatePresence>
								</div>

								{/* Input */}
								<div className='border-border bg-card border-t p-4'>
									<div className='flex space-x-3'>
										<input
											type='text'
											value={message}
											onChange={e => setMessage(e.target.value)}
											onKeyPress={handleKeyPress}
											className='border-border focus:ring-chart-accent-1 flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
											placeholder='Nhập tin nhắn...'
										/>
										<button
											onClick={handleSend}
											disabled={!message.trim()}
											className={`bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground disabled:bg-muted rounded-xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:shadow-none`}
										>
											<Send className='h-5 w-5' />
										</button>
									</div>
								</div>
							</div>

							{/* Items Sidebar (chỉ hiển thị cho người không phải tác giả và có items) */}
							{!isAuthor && hasItems && (
								<div className='border-border bg-muted/30 flex w-80 flex-col border-l'>
									<div className='border-border from-primary/5 to-chart-1/5 border-b bg-gradient-to-r p-4'>
										<h3 className='text-foreground mb-1 flex items-center gap-2 font-semibold'>
											<Package className='text-primary h-5 w-5' />
											Vật phẩm có sẵn
										</h3>
										<p className='text-muted-foreground mb-3 text-xs'>
											Chọn những vật phẩm bạn muốn trao đổi
										</p>
										{selectedItems.length > 0 && (
											<div className='bg-primary/10 border-primary/20 rounded-lg border p-3'>
												<div className='mb-2 flex items-center justify-between'>
													<span className='text-primary text-sm font-medium'>
														Đã chọn: {selectedItems.length} vật phẩm
													</span>
													<button
														onClick={() => setSelectedItems([])}
														className='text-muted-foreground hover:text-foreground text-xs transition-colors'
													>
														Xóa tất cả
													</button>
												</div>
												<button
													onClick={handleSendRequest}
													className={`bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl`}
												>
													<Send className='h-4 w-4' />
													Gửi yêu cầu trao đổi
												</button>
											</div>
										)}
									</div>

									<div className='flex-1 space-y-3 overflow-y-auto p-4'>
										{items.map(item => {
											const selectedItem = selectedItems.find(
												selected => selected.id === item.id
											)
											const isSelected = !!selectedItem
											const availableQuantity = item.quantity || 0

											return (
												<motion.div
													key={item.id}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
														isSelected
															? 'border-primary bg-primary/5 ring-primary/20 shadow-md ring-1'
															: 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
													} ${availableQuantity === 0 ? 'cursor-not-allowed opacity-50' : ''}`}
													onClick={() =>
														availableQuantity > 0 && handleItemSelect(item)
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

													{isSelected && (
														<motion.div
															initial={{ opacity: 0, height: 0 }}
															animate={{ opacity: 1, height: 'auto' }}
															className='border-primary/20 mt-4 border-t pt-4'
														>
															<div className='flex items-center justify-between'>
																<span className='text-foreground text-sm font-medium'>
																	Số lượng yêu cầu:
																</span>
																<div className='flex items-center gap-2'>
																	<button
																		onClick={e => {
																			e.stopPropagation()
																			handleQuantityChange(item.id, -1)
																		}}
																		className='bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-lg transition-colors'
																	>
																		<Minus className='h-4 w-4' />
																	</button>
																	<div className='w-12 text-center'>
																		<span className='text-primary font-semibold'>
																			{selectedItem.requestedQuantity}
																		</span>
																		<span className='text-muted-foreground text-xs'>
																			/{availableQuantity}
																		</span>
																	</div>
																	<button
																		onClick={e => {
																			e.stopPropagation()
																			handleQuantityChange(item.id, 1)
																		}}
																		disabled={
																			selectedItem.requestedQuantity >=
																			availableQuantity
																		}
																		className='bg-muted hover:bg-muted/80 flex h-8 w-8 items-center justify-center rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50'
																	>
																		<Plus className='h-4 w-4' />
																	</button>
																</div>
															</div>
														</motion.div>
													)}
												</motion.div>
											)
										})}

										{items.length === 0 && (
											<div className='flex flex-col items-center justify-center py-8 text-center'>
												<Package className='text-muted-foreground mb-3 h-12 w-12' />
												<p className='text-muted-foreground text-sm'>
													Không có vật phẩm nào
												</p>
											</div>
										)}
									</div>
								</div>
							)}
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}
