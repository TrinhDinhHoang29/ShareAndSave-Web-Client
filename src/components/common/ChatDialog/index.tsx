// ChatDialog/index.tsx
import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useEffect, useMemo, useState } from 'react'

import { useCreateTransactionMutation } from '@/hooks/mutations/use-transaction.mutation'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { ETransactionStatus } from '@/models/enums'
import {
	IDetailTransactionParams,
	IItem,
	IReceiver,
	ITransactionItem,
	ITransactionRequest
} from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

import { ChatHeaderWithRequests } from './ChatHeaderWithRequests'
import { ChatMessagesPanel } from './ChatMessagesPanel'
import { ItemSidebar } from './ItemSidebar'

interface ChatDialogProps {
	receiver: IReceiver
	postID: number
	postTitle: string
	onClose: () => void
	items?: IItem[]
	interestID: number
	authorID: number
}

export const ChatDialog = ({
	interestID,
	receiver,
	postTitle,
	onClose,
	items = [],
	postID,
	authorID
}: ChatDialogProps) => {
	const detailTransactionParams: IDetailTransactionParams = useMemo(
		() => ({
			postID,
			searchBy: 'interestID',
			searchValue: interestID.toString()
		}),
		[interestID, postID]
	)
	const { data: transactionData } = useListTransactionQuery(
		detailTransactionParams
	)
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([
		{
			id: 1,
			receiver: 'other',
			text: 'Xin chào, tôi quan tâm đến bài đăng của bạn.',
			time: '10:30'
		},
		{
			id: 2,
			receiver: 'user',
			text: 'Chào bạn! Cảm ơn bạn đã quan tâm. Bạn cần thêm thông tin gì không?',
			time: '10:32'
		}
	])
	const [selectedItems, setSelectedItems] = useState<ITransactionItem[]>([])
	const [transactionItems, setTransactionItems] = useState<ITransactionItem[]>(
		[]
	)
	const [currentRequestIndex, setCurrentRequestIndex] = useState(0)
	const [isRequestsVisible, setIsRequestsVisible] = useState(true)
	const [transactionStatus, setTransactionStatus] =
		useState<ETransactionStatus>(ETransactionStatus.DEFAULT)
	const {
		mutate: createTransactionMutation,
		isPending: isCreateTransactionPending
	} = useCreateTransactionMutation({
		onSuccess: (code: number) => {
			if (code === 200) {
				setTransactionStatus(ETransactionStatus.PENDING)
				setSelectedItems([])
			}
		}
	})

	const handleConfirmRequest = () => {
		const transactionRequest: ITransactionRequest = {
			interestID,
			items: transactionItems.map(item => ({
				postItemID: item.postItemID,
				quantity: item.quantity
			}))
		}
		createTransactionMutation(transactionRequest)
	}

	const { user } = useAuthStore()
	const senderID = user?.id
	const isAuthor = senderID === authorID

	useEffect(() => {
		if (transactionData) {
			setTransactionItems(
				transactionData.items.map(item => ({
					...item,
					currentQuantity:
						items.find(i => i.itemID === item.itemID)?.currentQuantity || 0
				}))
			)
			setTransactionStatus(transactionData.status)
		}
	}, [transactionData])

	const handleSend = () => {
		if (message.trim()) {
			setMessages([
				...messages,
				{
					id: messages.length + 1,
					receiver: 'user',
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
									receiver={receiver}
									postTitle={postTitle}
									transactionItems={transactionItems}
									currentRequestIndex={currentRequestIndex}
									isRequestsVisible={isRequestsVisible}
									transactionStatus={transactionStatus}
									isAuthor={isAuthor}
									onClose={onClose}
									toggleRequestsVisibility={() =>
										setIsRequestsVisible(!isRequestsVisible)
									}
									handlePrevRequest={() =>
										setCurrentRequestIndex(prev =>
											prev > 0 ? prev - 1 : transactionItems.length - 1
										)
									}
									handleNextRequest={() =>
										setCurrentRequestIndex(prev =>
											prev < transactionItems.length - 1 ? prev + 1 : 0
										)
									}
									handleConfirmRequest={handleConfirmRequest}
									handleConfirmSingleRequest={itemId => {
										setTransactionItems(prev =>
											prev.map(item =>
												item.itemID === itemId
													? { ...item, isConfirmed: true }
													: item
											)
										)
									}}
									handlePendingQuantityChange={(itemId, delta) => {
										setTransactionItems(prev =>
											prev.map(item =>
												item.itemID === itemId
													? {
															...item,
															requestedQuantity: Math.max(
																1,
																item.quantity + delta
															)
														}
													: item
											)
										)
									}}
									handleRemovePendingRequest={(itemId, index) => {
										setTransactionItems(prev =>
											prev.filter(item => item.itemID !== itemId)
										)
										setCurrentRequestIndex(index > 0 ? index - 1 : index)
									}}
									setCurrentRequestIndex={setCurrentRequestIndex}
									isCreateTransactionPending={isCreateTransactionPending}
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
								transactionStatus={transactionStatus}
								handleItemSelect={item => {
									const isInPending = transactionItems.some(
										i => i.itemID === item.itemID
									)
									const exists = selectedItems.find(
										i => i.itemID === item.itemID
									)
									if (!isInPending) {
										setSelectedItems(prev =>
											exists
												? prev.filter(i => i.itemID !== item.itemID)
												: [
														...prev,
														{
															itemID: item.itemID || 0,
															itemName: item.name,
															itemImage: item.image,
															postItemID: item.id,
															quantity: 1,
															currentQuantity: item.quantity || 1
														}
													]
										)
									}
								}}
								handleQuantityChange={(itemId, change) => {
									setSelectedItems(prev =>
										prev.map(item =>
											item.itemID === itemId
												? {
														...item,
														quantity: Math.max(
															1,
															Math.min(
																items.find(i => i.itemID === itemId)
																	?.quantity || 1,
																item.quantity + change
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
										setTransactionItems([...transactionItems, ...selectedItems])
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
