// ChatDialog/index.tsx
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'

import { IItem, ISender } from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

import { ChatHeaderWithRequests } from './ChatHeaderWithRequests'
import { ChatMessagesPanel } from './ChatMessagesPanel'
import { ItemSidebar } from './ItemSidebar'

interface RequestItem extends IItem {
	requestedQuantity: number
	isConfirmed?: boolean
}

interface ChatDialogProps {
	sender: ISender
	postTitle: string
	onClose: () => void
	items?: IItem[]
}

export const ChatDialog = ({
	sender,
	postTitle,
	onClose,
	items = []
}: ChatDialogProps) => {
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
	const [selectedItems, setSelectedItems] = useState<RequestItem[]>([])
	const [pendingRequests, setPendingRequests] = useState<RequestItem[]>([])
	const [currentRequestIndex, setCurrentRequestIndex] = useState(0)
	const [isRequestsVisible, setIsRequestsVisible] = useState(true)
	const [isAllConfirmed, setIsAllConfirmed] = useState(false)

	const { user } = useAuthStore()
	const receiverID = user?.id
	const isAuthor = receiverID === sender.id

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

	return (
		<Transition
			appear
			show
			as={Fragment}
		>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={onClose}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-200'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='fixed inset-0 bg-black/60 backdrop-blur-sm' />
				</Transition.Child>

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
						<Dialog.Panel className='bg-card flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl'>
							<div className='flex flex-1 flex-col'>
								<ChatHeaderWithRequests
									sender={sender}
									postTitle={postTitle}
									pendingRequests={pendingRequests}
									currentRequestIndex={currentRequestIndex}
									isRequestsVisible={isRequestsVisible}
									isAllConfirmed={isAllConfirmed}
									isAuthor={isAuthor}
									onClose={onClose}
									toggleRequestsVisibility={() =>
										setIsRequestsVisible(!isRequestsVisible)
									}
									handlePrevRequest={() =>
										setCurrentRequestIndex(prev =>
											prev > 0 ? prev - 1 : pendingRequests.length - 1
										)
									}
									handleNextRequest={() =>
										setCurrentRequestIndex(prev =>
											prev < pendingRequests.length - 1 ? prev + 1 : 0
										)
									}
									handleConfirmRequest={() => {
										setPendingRequests(prev =>
											prev.map(item => ({ ...item, isConfirmed: true }))
										)
										setIsAllConfirmed(true)
									}}
									handleConfirmSingleRequest={itemId => {
										setPendingRequests(prev =>
											prev.map(item =>
												item.itemID === itemId
													? { ...item, isConfirmed: true }
													: item
											)
										)
									}}
									handlePendingQuantityChange={(itemId, delta) => {
										setPendingRequests(prev =>
											prev.map(item =>
												item.itemID === itemId
													? {
															...item,
															requestedQuantity: Math.max(
																1,
																item.requestedQuantity + delta
															)
														}
													: item
											)
										)
									}}
									handleRemovePendingRequest={itemId => {
										setPendingRequests(prev =>
											prev.filter(item => item.itemID !== itemId)
										)
									}}
									setCurrentRequestIndex={setCurrentRequestIndex}
								/>
								<ChatMessagesPanel
									messages={messages}
									message={message}
									setMessage={setMessage}
									handleSend={handleSend}
									handleKeyPress={e => {
										if (e.key === 'Enter' && !e.shiftKey) {
											e.preventDefault()
											handleSend()
										}
									}}
								/>
							</div>

							<ItemSidebar
								items={items}
								selectedItems={selectedItems}
								isAuthor={isAuthor}
								isAllConfirmed={isAllConfirmed}
								handleItemSelect={item => {
									const isInPending = pendingRequests.some(
										i => i.itemID === item.itemID
									)
									const exists = selectedItems.find(
										i => i.itemID === item.itemID
									)
									if (!isInPending) {
										setSelectedItems(prev =>
											exists
												? prev.filter(i => i.itemID !== item.itemID)
												: [...prev, { ...item, requestedQuantity: 1 }]
										)
									}
								}}
								handleQuantityChange={(itemId, change) => {
									setSelectedItems(prev =>
										prev.map(item =>
											item.itemID === itemId
												? {
														...item,
														requestedQuantity: Math.max(
															1,
															Math.min(
																items.find(i => i.itemID === itemId)
																	?.quantity || 1,
																item.requestedQuantity + change
															)
														)
													}
												: item
										)
									)
								}}
								handleRemoveSelectedItem={itemId => {
									setSelectedItems(prev =>
										prev.filter(item => item.itemID !== itemId)
									)
								}}
								handleSendRequest={() => {
									if (selectedItems.length > 0) {
										setPendingRequests([...pendingRequests, ...selectedItems])
										setSelectedItems([])
										setCurrentRequestIndex(0)
									}
								}}
								setSelectedItems={setSelectedItems}
							/>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}
