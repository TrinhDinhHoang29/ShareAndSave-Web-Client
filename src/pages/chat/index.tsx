import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	useCreateTransactionMutation,
	useUpdateTransactionMutation
} from '@/hooks/mutations/use-transaction.mutation'
import { useListMessageQuery } from '@/hooks/queries/use-chat.query'
import { useDetailPostQueryByID } from '@/hooks/queries/use-post-query'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { getAccessToken } from '@/lib/token'
import { generateRandomId } from '@/lib/utils'
import { LIMIT_MESSAGE } from '@/models/constants'
import { EMessageStatus, ESortOrder, ETransactionStatus } from '@/models/enums'
import {
	IMessage,
	IMessageResponse,
	IReceiver,
	ITransactionItem,
	ITransactionParams,
	ITransactionRequest
} from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

import { ChatHeaderWithRequests } from './components/ChatHeaderWithRequests'
import ChatMessagesPanel from './components/ChatMessagesPanel'
import { ItemSidebar } from './components/ItemSidebar'

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

	const parsedPostID = Number(postID)
	const parsedInterestID = Number(interestID)

	const initialState = state || {
		receiver: { id: 0, name: 'Unknown' },
		postTitle: 'No Title',
		items: [],
		authorID: 0
	}
	const { receiver } = initialState

	useEffect(() => {
		if (isNaN(parsedPostID) || isNaN(parsedInterestID) || !receiver) {
			navigate('/', { replace: true })
		}
	}, [parsedPostID, parsedInterestID, receiver, navigate])

	const {
		data: postDetailData,
		isPending: isPostDetailDataPending,
		refetch: postDetailDataRefetch
	} = useDetailPostQueryByID(parsedPostID)

	// Sử dụng useListMessageQuery để lấy lịch sử tin nhắn
	const {
		data: messagesData,
		fetchNextPage: messageFetchNextPage,
		hasNextPage: messageHasNextPage,
		isFetchingNextPage: isMessageFetchingNextPage,
		refetch: messageRefetch
	} = useListMessageQuery({
		interestID: parsedInterestID,
		limit: LIMIT_MESSAGE
	})
	const [isMoreThanLimitMessage, setIsMoreThanLimitMessage] = useState(false)
	const pageMessages: IMessageResponse[] = useMemo(() => {
		return messagesData?.pages.flatMap(page => page) || []
	}, [messagesData])

	// Sử dụng useInView để theo dõi đầu danh sách (infinite scroll khi cuộn lên)
	const { ref: messageRef, inView: messageInView } = useInView({
		threshold: 0.5,
		rootMargin: '100px' // Tải sớm hơn 100px khi cuộn lên
	})

	// Tải thêm khi cuộn lên và sentinel ở đầu vào vùng hiển thị
	useEffect(() => {
		if (messageInView && messageHasNextPage && !isMessageFetchingNextPage) {
			messageFetchNextPage()
		}
	}, [
		messageInView,
		messageHasNextPage,
		isMessageFetchingNextPage,
		messageFetchNextPage
	])

	const socketRef = useRef<WebSocket | null>(null)
	const token = getAccessToken()

	const { user } = useAuthStore()
	const senderID = user?.id
	const isAuthor = senderID === postDetailData?.authorID

	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState<IMessage[]>([])

	// Thêm state để track việc scroll
	const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true)
	const [isInitialLoad, setIsInitialLoad] = useState(true)
	const messagesContainerRef = useRef<HTMLDivElement>(null)

	const handleSend = () => {
		if (message.trim()) {
			const newMessage: IMessage = {
				id: generateRandomId(),
				receiver: 'user',
				message,
				time: new Date().toISOString(),
				status: EMessageStatus.SENDING
			}
			setMessages(prev => [...prev, newMessage])
			setShouldScrollToBottom(true) // Đánh dấu cần scroll xuống

			if (socketRef.current?.readyState === WebSocket.OPEN) {
				const msgId = newMessage.id
				socketRef.current.send(
					JSON.stringify({
						event: 'send_message',
						data: {
							isOwner: isAuthor,
							interestID: parsedInterestID,
							userID: receiver.id,
							message: message
						}
					})
				)

				const retrySend = () => {
					setMessages(prev =>
						prev.map(m =>
							m.id === msgId && m.status === EMessageStatus.ERROR
								? { ...m, status: EMessageStatus.SENDING }
								: m
						)
					)
					socketRef.current?.send(
						JSON.stringify({
							event: 'send_message',
							data: {
								isOwner: isAuthor,
								interestID: parsedInterestID,
								userID: receiver.id,
								message: message
							}
						})
					)
				}

				setMessages(prev =>
					prev.map(m =>
						m.id === msgId
							? { ...m, retry: retrySend, status: EMessageStatus.SENDING }
							: m
					)
				)
			}
			setMessage('')
		}
	}

	useEffect(() => {
		if (
			!socketRef.current ||
			socketRef.current.readyState === WebSocket.CLOSED
		) {
			const wsUrl =
				import.meta.env.VITE_SOCKET_CHAT || 'ws://34.142.168.171:8001/chat'
			socketRef.current = new WebSocket(wsUrl, [token ?? ''])

			socketRef.current.onopen = () => {
				if (interestID) {
					const msg = {
						event: 'join_room',
						data: {
							interestID: parsedInterestID
						}
					}
					socketRef.current?.send(JSON.stringify(msg))
				}
			}

			socketRef.current.onmessage = event => {
				try {
					const data = JSON.parse(event.data)
					if (data.event === 'send_message_response' && data.data.message) {
						const { senderID: senderChatID, message, timestamp } = data.data
						const isCurrentUser = senderID === senderChatID
						const receiverType = isCurrentUser ? 'user' : 'other'

						if (isCurrentUser) {
							setMessages((prev: IMessage[]) => {
								return prev.map(m => {
									if (
										m.status === EMessageStatus.SENDING ||
										m.status === EMessageStatus.SENT
									) {
										const status =
											m.status === EMessageStatus.SENDING
												? EMessageStatus.SENT
												: m.status === EMessageStatus.SENT
													? EMessageStatus.DELIVERED
													: m.status
										return { ...m, status }
									} else {
										return m
									}
								})
							})
						} else {
							setMessages((prev: IMessage[]) => {
								const updatedMessages: IMessage[] = [
									...prev,
									{
										id: generateRandomId(),
										receiver: receiverType,
										message,
										time: timestamp,
										status: EMessageStatus.DELIVERED
									}
								]

								return updatedMessages.map(m =>
									m.status === EMessageStatus.SENT
										? { ...m, status: EMessageStatus.DELIVERED }
										: m
								)
							})
							// Scroll xuống khi nhận tin nhắn mới từ người khác
							setShouldScrollToBottom(true)
						}
					} else if (
						data.event === 'send_message_response' &&
						data.status === 'error'
					) {
						setMessages((prev: IMessage[]) =>
							prev.map(m =>
								m.status === EMessageStatus.SENDING
									? {
											...m,
											status: EMessageStatus.ERROR,
											retry: () => handleSend()
										}
									: m
							)
						)
					}
				} catch (error) {
					console.error('❌ Parse error:', error)
				}
			}

			socketRef.current.onerror = error => {
				console.log(error)
				setMessages((prev: IMessage[]) =>
					prev.map(m =>
						m.status === EMessageStatus.SENDING
							? {
									...m,
									status: EMessageStatus.ERROR,
									retry: () => handleSend()
								}
							: m
					)
				)
			}

			socketRef.current.onclose = event => {
				console.warn(
					`⚠️ WebSocket closed. Code: ${event.code}, Reason: ${event.reason}, ReadyState: ${socketRef.current?.readyState}`
				)
			}
		}

		return () => {
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				if (interestID) {
					const msg = {
						event: 'left_room',
						data: {
							interestID: parsedInterestID
						}
					}
					socketRef.current?.send(JSON.stringify(msg))
				}
				socketRef.current.close()
				if (pageMessages.length !== messages.length) {
					messageRefetch()
				}
			}
		}
	}, [token, interestID])

	// Cập nhật useEffect xử lý messagesData
	useEffect(() => {
		if (pageMessages.length !== messages.length) {
			const convertedMessages: IMessage[] = pageMessages.map(m => {
				const isCurrentUser = senderID === m.senderID
				const receiverType = isCurrentUser ? 'user' : 'other'
				return {
					id: m.id,
					receiver: receiverType,
					message: m.message,
					time: m.createdAt,
					status: EMessageStatus.DELIVERED
				}
			})

			// Kiểm tra xem đây có phải là lần load đầu tiên không
			const isFirstLoad = messages.length === 0

			setMessages(prev => {
				// Nếu là lần load đầu tiên, thay thế toàn bộ và đánh dấu scroll xuống bottom
				if (isFirstLoad) {
					setShouldScrollToBottom(true)
					setIsMoreThanLimitMessage(pageMessages.length > LIMIT_MESSAGE)
					return convertedMessages
				}
				// Nếu load thêm messages cũ (infinite scroll), thêm vào đầu
				return [...convertedMessages, ...prev]
			})
		}
	}, [pageMessages, senderID])
	// Logic auto scroll cải tiến
	useEffect(() => {
		if (messagesContainerRef.current) {
			const container = messagesContainerRef.current

			// Nếu là lần load đầu tiên hoặc được đánh dấu cần scroll xuống bottom
			if (shouldScrollToBottom || isInitialLoad) {
				setTimeout(() => {
					container.scrollTop = container.scrollHeight
					setShouldScrollToBottom(false)
					setIsInitialLoad(false)
				}, 0)
				return
			}

			// Chỉ auto scroll khi user ở gần cuối danh sách (cho tin nhắn mới)
			const isAtBottom =
				container.scrollHeight - container.scrollTop - container.clientHeight <
				100
			if (isAtBottom && messages.length > 0) {
				const lastMessage = messages[messages.length - 1]
				if (
					lastMessage &&
					(lastMessage.receiver === 'user' || shouldScrollToBottom)
				) {
					setTimeout(() => {
						container.scrollTop = container.scrollHeight
					}, 0)
				}
			}
		}
	}, [messages, shouldScrollToBottom, isInitialLoad])

	//Handle Transactions
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
		fetchNextPage: transactionFetchNextPage,
		hasNextPage: transactionHasNextPage,
		isFetchingNextPage: isTransactionFetchingNextPage,
		refetch: transactionDataRefetch
	} = useListTransactionQuery(transactionParams)

	const transactions = useMemo(() => {
		return transactionData?.pages.flatMap(page => page.transactions) || []
	}, [transactionData])

	const { ref: transactionRef, inView: transactionInView } = useInView({
		threshold: 0.5,
		rootMargin: '100px'
	})

	useEffect(() => {
		if (
			transactionInView &&
			transactionHasNextPage &&
			!isTransactionFetchingNextPage
		) {
			transactionFetchNextPage()
		}
	}, [transactionInView, transactionHasNextPage, isTransactionFetchingNextPage])

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
			return (transactions[0]?.status.toString() as ETransactionStatus) ===
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

	const handleBack = () => {
		navigate(-1)
	}

	const handleApplyItemTransactions = (index: number) => {
		if (transactionData) {
			const transactionItems = transactions[index].items
			const updatedCurrentQuantityTransactionItems = transactionItems.map(
				item => ({
					...item,
					currentQuantity:
						postDetailData?.items.find(i => i.itemID === item.itemID)
							?.currentQuantity || 0
				})
			)
			const status = transactions[index].status.toString() as ETransactionStatus
			setTransactionItems(updatedCurrentQuantityTransactionItems)
			setTransactionStatus(status)
		}
	}

	return (
		<>
			{isPostDetailDataPending ? (
				<Loading
					position='in'
					size='lg'
					color='primary'
					text='Đang tải...'
				/>
			) : (
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
								hasNextPage={transactionHasNextPage}
								isFetchingNextPage={isTransactionFetchingNextPage}
								sentinelRef={transactionRef}
								transactionID={transactionID}
							/>
							<ChatMessagesPanel
								isMoreThanLimitMessage={isMoreThanLimitMessage}
								ref={messagesContainerRef}
								sentinelRef={messageRef}
								hasNextPage={messageHasNextPage}
								isFetchingNextPage={isMessageFetchingNextPage}
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
			)}
		</>
	)
}

export default Chat
