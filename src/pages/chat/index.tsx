import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	useCreateTransactionMutation,
	useUpdateTransactionMutation
} from '@/hooks/mutations/use-transaction.mutation'
import { useDetailPostQueryByID } from '@/hooks/queries/use-post-query'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { ETransactionStatus } from '@/models/enums'
import {
	IReceiver,
	ITransaction,
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
			searchValue: parsedInterestID.toString()
		}),
		[parsedInterestID, parsedPostID]
	)
	const { data: transactionData, refetch: transactionDataRefetch } =
		useListTransactionQuery(transactionParams)
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
	console.log(transactionData)
	console.log(transactionParams)
	const transactionID = useMemo(() => {
		if (transactionData) {
			return (
				transactionData.find(
					transaction =>
						(transaction.status.toString() as ETransactionStatus) ===
						ETransactionStatus.PENDING
				)?.id || 0
			)
		}
		return 0
	}, [transactionData])

	const {
		mutate: createTransactionMutation,
		isPending: isCreateTransactionPending
	} = useCreateTransactionMutation({
		onSuccess: (transaction: ITransaction) => {
			setTransactionStatus(ETransactionStatus.PENDING)
			setSelectedItems([])
			transactionData?.unshift({
				...transaction,
				items: transactionItems
			})
		}
	})

	const {
		mutate: updateTransactionMutation,
		isPending: isUpdateTransactionPending
	} = useUpdateTransactionMutation({
		onSuccess: (status: ETransactionStatus) => {
			setTransactionStatus(status)
			transactionDataRefetch()
			if (status === ETransactionStatus.SUCCESS) {
				postDetailDataRefetch()
			}
		}
	})

	const handleConfirmRequest = () => {
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
					const transactionRequest: ITransactionRequest = {
						interestID: parsedInterestID,
						items: transactionItems.map(item => ({
							postItemID: item.postItemID,
							quantity: item.quantity
						}))
					}
					createTransactionMutation(transactionRequest)
					close()
				},
				cancelButtonText: 'Đóng'
			})
		}
	}

	const handleConfirmTransaction = (status: ETransactionStatus) => {
		const transactionRequest: ITransactionRequest = {
			status: Number(status),
			items:
				status === ETransactionStatus.CANCELLED
					? undefined
					: transactionItems.map(item => ({
							postItemID: item.postItemID,
							quantity: item.quantity
						}))
		}
		updateTransactionMutation({
			transactionID,
			data: transactionRequest
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
			const transactionItems = transactionData[index].items.map(item => ({
				...item,
				currentQuantity:
					postDetailData?.items?.find(i => i.itemID === item.itemID)
						?.currentQuantity || 1
			}))
			const status = transactionData[
				index
			].status.toString() as ETransactionStatus
			setTransactionItems(transactionItems)
			setTransactionStatus(status)
		}
	}

	useEffect(() => {
		if (transactionItems.length === 0) {
			setTransactionStatus(ETransactionStatus.DEFAULT)
		}
	}, [transactionItems])

	return (
		<div className='bg-background min-h-full'>
			<div className='bg-card flex w-full overflow-hidden rounded-2xl shadow-2xl'>
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
						isUpdateTransactionPending={isUpdateTransactionPending}
						transactions={transactionData || []} // Truyền transactionData
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
