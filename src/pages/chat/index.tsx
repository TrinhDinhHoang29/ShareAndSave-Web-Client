import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	useCreateTransactionMutation,
	useUpdateTransactionMutation
} from '@/hooks/mutations/use-transaction.mutation'
import { useDetailPostQueryByID } from '@/hooks/queries/use-post-query'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { ESortOrder, ETransactionStatus } from '@/models/enums'
import {
	IReceiver,
	ITransactionItem,
	ITransactionParams,
	ITransactionRequest
} from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

import { ChatHeaderWithRequests } from './components/ChatHeaderWithRequests'
import { ChatMessagesPanel } from './components/ChatMessagesPanel'
import { ItemSidebar } from './components/ItemSidebar'

// Interface cho state trong location
interface ChatState {
	receiver: IReceiver
}

const Chat = () => {
	const { postID, interestID } = useParams<{
		postID: string
		interestID: string
	}>()
	const { state } = useLocation() as { state: ChatState | undefined }
	const navigate = useNavigate()
	const { showInfo, showConfirm, close } = useAlertModalContext()

	// Parse params
	const parsedPostID = Number(postID)
	const parsedInterestID = Number(interestID)

	// Lấy dữ liệu từ state hoặc fallback
	const initialState = state || {
		receiver: { id: 0, name: 'Unknown' },
		postTitle: 'No Title',
		items: [],
		authorID: 0
	}
	const { receiver } = initialState

	// Kiểm tra dữ liệu hợp lệ
	useEffect(() => {
		if (isNaN(parsedPostID) || isNaN(parsedInterestID) || !receiver) {
			navigate('/', { replace: true })
		}
	}, [parsedPostID, parsedInterestID, receiver, navigate])

	const transactionParams: ITransactionParams = useMemo(
		() => ({
			postID: parsedPostID,
			searchBy: 'interestID',
			searchValue: parsedInterestID.toString(),
			sort: 'createdAt',
			page: 1,
			order: ESortOrder.DESC
		}),
		[parsedInterestID, parsedPostID]
	)

	const {
		data: transactionData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch: transactionDataRefetch
	} = useListTransactionQuery(transactionParams)

	const transactions = useMemo(() => {
		return transactionData?.pages.flatMap(page => page.transactions) || []
	}, [transactionData])

	const handleLoadMore = useCallback(() => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}, [hasNextPage, isFetchingNextPage, fetchNextPage])

	const handleTransactionScroll = useCallback(
		(e: React.UIEvent<HTMLDivElement>) => {
			const { scrollTop, scrollHeight, clientHeight } = e.currentTarget

			// Trigger load more when user scrolls to near bottom (within 100px)
			const isNearBottom = scrollHeight - scrollTop <= clientHeight + 100

			if (isNearBottom && hasNextPage && !isFetchingNextPage) {
				handleLoadMore()
			}
		},
		[hasNextPage, isFetchingNextPage, handleLoadMore]
	)

	const { data: postDetailData, refetch: postDetailDataRefetch } =
		useDetailPostQueryByID(parsedPostID)

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

	const transactionID = useMemo(() => {
		if (transactionData) {
			return (transactions[0].status.toString() as ETransactionStatus) ===
				ETransactionStatus.PENDING
				? transactions[0].id
				: 0
		}
		return 0
	}, [transactions])

	const {
		mutate: createTransactionMutation,
		isPending: isCreateTransactionPending
	} = useCreateTransactionMutation({
		onSuccess: () => {
			setTransactionStatus(ETransactionStatus.PENDING)
			setSelectedItems([])
			transactionDataRefetch()
		}
	})

	const { mutate: updateTransactionMutation } = useUpdateTransactionMutation({
		onSuccess: (status: ETransactionStatus) => {
			setTransactionStatus(status)
			transactionDataRefetch()
			if (status === ETransactionStatus.SUCCESS) {
				postDetailDataRefetch()
			}
		}
	})

	const handleConfirmRequest = async () => {
		if (transactionData && !isAuthor && transactionID) {
			showInfo({
				infoTitle: 'Bạn đang ở trong 1 giao dịch.',
				infoMessage:
					'Bạn cần thực hiện xong giao dịch hiện tại xong mới được thực hiện giao dịch tiếp theo',
				infoButtonText: 'Đã rõ'
			})
			return
		}
		if (isAuthor) {
			const transactionRequest: ITransactionRequest = {
				status: Number(transactionStatus),
				items: transactionItems.map(item => ({
					postItemID: item.postItemID,
					quantity: item.quantity
				}))
			}
			updateTransactionMutation({
				transactionID,
				data: transactionRequest
			})
		} else {
			showConfirm({
				confirmButtonText: 'Xác nhận',
				confirmMessage:
					'Hành động này không thể hoàn tác và người đăng sẽ thấy được các món đồ bạn yêu cầu',
				confirmTitle: 'Xác nhận tạo giao dịch?',
				onConfirm: () => {
					close()
					const transactionRequest: ITransactionRequest = {
						interestID: parsedInterestID,
						items: transactionItems.map(item => ({
							postItemID: item.postItemID,
							quantity: item.quantity
						}))
					}
					createTransactionMutation({ data: transactionRequest })
				},
				cancelButtonText: 'Hủy'
			})
		}
	}

	const handleConfirmTransaction = async (status: ETransactionStatus) => {
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage:
				'Hành động này không thể hoàn tác. Bạn cần cân nhắc trước khi xác nhận',
			confirmTitle:
				status === ETransactionStatus.SUCCESS
					? 'Xác nhận hoàn tất giao dịch?'
					: 'Xác nhận từ chối giao dịch?',
			onConfirm: async () => {
				const transactionRequest: ITransactionRequest = {
					status: Number(status)
				}
				updateTransactionMutation({
					transactionID,
					data: transactionRequest
				})
			},
			cancelButtonText: 'Hủy'
		})
	}

	const { user } = useAuthStore()
	const senderID = user?.id
	const isAuthor = senderID === postDetailData?.authorID

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

	const handleBack = () => {
		navigate(-1)
	}

	const handleApplyItemTransactions = (index: number) => {
		if (transactionData) {
			const transactionItems = transactions[index].items
			const status = transactions[index].status.toString() as ETransactionStatus
			setTransactionItems(transactionItems)
			setTransactionStatus(status)
		}
	}

	return (
		<div className='bg-background min-h-full'>
			<div className='bg-card flex w-full overflow-hidden rounded-2xl shadow-md'>
				<div className='flex w-full flex-1 flex-col'>
					<ChatHeaderWithRequests
						receiver={receiver}
						postTitle={postDetailData?.title || ''}
						transactionItems={transactionItems}
						currentRequestIndex={currentRequestIndex}
						isRequestsVisible={isRequestsVisible}
						transactionStatus={transactionStatus}
						isAuthor={isAuthor}
						onClose={handleBack}
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
						handleRemovePendingRequest={(itemId, index) => {
							setTransactionItems(prev =>
								prev.filter(item => item.itemID !== itemId)
							)
							setCurrentRequestIndex(index > 0 ? index - 1 : index)
						}}
						setCurrentRequestIndex={setCurrentRequestIndex}
						isCreateTransactionPending={isCreateTransactionPending}
						transactions={transactions}
						handleApplyItemTransactions={handleApplyItemTransactions}
						handleQuantityChange={(itemId, change) => {
							setTransactionItems(prev =>
								prev.map(item =>
									item.itemID === itemId
										? {
												...item,
												quantity: Math.max(
													1,
													Math.min(
														postDetailData?.items?.find(
															i => i.itemID === itemId
														)?.quantity || 1,
														item.quantity + change
													)
												)
											}
										: item
								)
							)
						}}
						hasNextPage={hasNextPage}
						isFetchingNextPage={isFetchingNextPage}
						onTransactionScroll={handleTransactionScroll}
						transactionID={transactionID}
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
					handleConfirmTransaction={handleConfirmTransaction}
					items={postDetailData?.items || []}
					selectedItems={selectedItems}
					isAuthor={isAuthor}
					transactionStatus={transactionStatus}
					handleItemSelect={item => {
						const isInPending = transactionItems.some(
							i => i.itemID === item.itemID
						)
						const exists = selectedItems.find(i => i.itemID === item.itemID)
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
													postDetailData?.items?.find(i => i.itemID === itemId)
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
			</div>
		</div>
	)
}

export default Chat
