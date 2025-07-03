import { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate, useParams } from 'react-router-dom'

import messageApi from '@/apis/modules/message.api'
import Loading from '@/components/common/Loading'
import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	useCreateTransactionMutation,
	useUpdateTransactionMutation
} from '@/hooks/mutations/use-transaction.mutation'
import { useDetailPostInterestQuery } from '@/hooks/queries/use-interest.query'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { useWebSocketConnection } from '@/hooks/useWebSocketConnection'
import { getConfirmContentTransactionStatus } from '@/models/constants'
import {
	EMethod,
	EPostType,
	ESortOrder,
	ETransactionStatus
} from '@/models/enums'
import {
	IReceiver,
	ISocketMessageResponse,
	ITransaction,
	ITransactionItem,
	ITransactionParams,
	ITransactionRequest
} from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

import ChatHeaderWithRequests from './components/ChatHeaderWithRequests'
import ChatMessagesPanel from './components/ChatMessagesPanel'
import ItemSidebar from './components/ItemSidebar'

const Chat = () => {
	const params = useParams()
	const interestID = Number(params.interestID)
	const navigate = useNavigate()
	const { showInfo, showConfirm, showSuccess } = useAlertModalContext()

	useEffect(() => {
		if (isNaN(interestID)) {
			navigate('/', { replace: true })
		}
	}, [interestID, navigate])

	const {
		data: postDetailInterestData,
		isPending: isPostDetailInterestDataPending,
		refetch: postDetailDataRefetch
	} = useDetailPostInterestQuery(interestID)

	const { user } = useAuthStore()
	const senderID = user?.id
	const isAuthor = useMemo(() => {
		if (!postDetailInterestData || !senderID) return false
		return senderID === postDetailInterestData.authorID
	}, [postDetailInterestData?.authorID, senderID])

	const receiver: IReceiver = isAuthor
		? {
				id: postDetailInterestData?.interests[0]?.userID || 0,
				name: postDetailInterestData?.interests[0]?.userName || '',
				avatar: postDetailInterestData?.interests[0]?.userAvatar || ''
			}
		: {
				id: postDetailInterestData?.authorID || 0,
				name: postDetailInterestData?.authorName || '',
				avatar: postDetailInterestData?.authorAvatar || ''
			}

	const [socketMessageResponse, setSocketMessageResponse] = useState<{
		data?: ISocketMessageResponse
		status: 'success' | 'error'
	}>(Object)

	//Handle Transactions
	const transactionParams: ITransactionParams = useMemo(
		() => ({
			postID: postDetailInterestData?.id || 0,
			searchBy: 'interestID',
			searchValue: interestID.toString(),
			sort: 'createdAt',
			page: 1,
			order: ESortOrder.DESC
		}),
		[interestID, postDetailInterestData]
	)

	const {
		data: transactionData,
		fetchNextPage: transactionFetchNextPage,
		hasNextPage: transactionHasNextPage,
		isFetchingNextPage: isTransactionFetchingNextPage,
		refetch: transactionDataRefetch
	} = useListTransactionQuery(transactionParams)

	const transactions: ITransaction[] = useMemo(() => {
		return transactionData?.pages.flatMap(page => page.transactions) || []
	}, [transactionData])

	// Memoize callback functions to prevent unnecessary re-renders
	const handleMessageResponse = useCallback((data: any) => {
		if (data.data.message) {
			const messageResponse: ISocketMessageResponse = data.data
			setSocketMessageResponse({
				data: messageResponse,
				status: 'success'
			})
		} else if (data.status === 'error') {
			setSocketMessageResponse({
				status: 'error'
			})
		}
	}, [])

	const handleTransactionResponse = useCallback(() => {
		if (!isAuthor) {
			setTransactionStatus(ETransactionStatus.DEFAULT)
			setTransactionItems([])
			postDetailDataRefetch()
		}
		transactionDataRefetch()
	}, [isAuthor, postDetailDataRefetch, transactionDataRefetch])

	// WebSocket connection hook
	const { socket, connectionStatus, manualReconnect, sendTransaction } =
		useWebSocketConnection({
			interestID,
			onMessage: handleMessageResponse,
			onTransactionResponse: handleTransactionResponse
		})

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
	const [selectedTransactionID, setSelectedTransactionID] = useState<number>(0)
	const [selectedMethod, setSelectedMethod] = useState<EMethod>(
		EMethod.IN_PERSON
	)

	const handleSendRequest = (method: EMethod) => {
		if (selectedItems.length > 0) {
			setSelectedMethod(method)
			setTransactionItems([...transactionItems, ...selectedItems])
			setSelectedItems([])
			setCurrentRequestIndex(0)
		}
	}

	const isPendingTransaction = useMemo(() => {
		if (transactions && transactions.length > 0) {
			return (
				(transactions[0]?.status.toString() as ETransactionStatus) ===
				ETransactionStatus.PENDING
			)
		}
		return false
	}, [transactions])

	const {
		mutate: createTransactionMutation,
		isPending: isCreateTransactionPending
	} = useCreateTransactionMutation({
		onSuccess: () => {
			showSuccess({
				successTitle: 'Giao dịch thành công',
				successMessage:
					'Bạn có thể xem danh sách giao dịch trong trò chuyện hoặc trong danh sách quan tâm.',
				successButtonText: 'Đóng'
			})
			setTransactionStatus(ETransactionStatus.PENDING)
			setSelectedItems([])
			transactionDataRefetch()
			sendTransaction(receiver.id)
		}
	})

	const { mutate: updateTransactionMutation } = useUpdateTransactionMutation({
		onSuccess: (status: ETransactionStatus) => {
			setTransactionStatus(status)
			transactionDataRefetch()
			if (
				status === ETransactionStatus.SUCCESS ||
				status === ETransactionStatus.REJECTED
			) {
				postDetailDataRefetch()
			}
			sendTransaction(receiver.id)
		}
	})

	const handleConfirmRequest = async () => {
		if (transactionData && !isAuthor && isPendingTransaction) {
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
				})),
				method: selectedMethod
			}
			updateTransactionMutation({
				transactionID: selectedTransactionID,
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
						interestID,
						items: transactionItems.map(item => ({
							postItemID: item.postItemID,
							quantity: item.quantity
						})),
						method: selectedMethod
					}
					createTransactionMutation({ data: transactionRequest })
				},
				cancelButtonText: 'Hủy'
			})
		}
	}

	const handleConfirmTransaction = async (status: ETransactionStatus) => {
		const contentStatus = getConfirmContentTransactionStatus(status)
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage: contentStatus.message,
			confirmTitle: contentStatus.title,
			onConfirm: async () => {
				const transactionRequest: ITransactionRequest = {
					status: Number(status)
				}
				updateTransactionMutation({
					transactionID: selectedTransactionID,
					data: transactionRequest
				})
			},
			cancelButtonText: 'Hủy'
		})
	}

	const handleApplyItemTransactions = (index: number) => {
		if (transactionData) {
			const transactionItems = transactions[index].items
			const updatedCurrentQuantityTransactionItems = transactionItems.map(
				item => ({
					...item,
					currentQuantity:
						postDetailInterestData?.items.find(i => i.itemID === item.itemID)
							?.currentQuantity || 0
				})
			)
			const status = transactions[index].status.toString() as ETransactionStatus
			setTransactionItems(updatedCurrentQuantityTransactionItems)
			setTransactionStatus(status)
			setSelectedMethod(
				(transactions[index].method as EMethod) || EMethod.IN_PERSON
			)
			setSelectedTransactionID(transactions[index].id)
		}
	}

	const handleTransactionDataRefetch = async () => {
		await transactionDataRefetch()
		await postDetailDataRefetch()
		setSelectedItems([])
		setCurrentRequestIndex(0)
	}

	useEffect(() => {
		const handleRefetch = async () => {
			await messageApi.update(interestID)
		}
		if (interestID) handleRefetch()
	}, [interestID])

	useEffect(() => {
		if (
			transactions &&
			transactions.length > 0 &&
			(transactions[0].status.toString() as ETransactionStatus) !==
				ETransactionStatus.PENDING
		) {
			setTransactionStatus(ETransactionStatus.DEFAULT)
			setTransactionItems([])
		}
	}, [transactions])

	return (
		<>
			{isPostDetailInterestDataPending ? (
				<div className='flex items-center justify-center py-12'>
					<Loading
						size='lg'
						color='primary'
						text='Đang tải...'
					/>
				</div>
			) : (
				<div className='container mx-auto py-12'>
					<div className='flex w-full overflow-hidden rounded-2xl shadow-md'>
						<div className='flex w-full flex-1 flex-col'>
							<ChatHeaderWithRequests
								onRefetch={handleTransactionDataRefetch}
								setSelectedMethod={(method: EMethod) =>
									setSelectedMethod(method)
								}
								method={selectedMethod}
								receiver={receiver}
								postTitle={postDetailInterestData?.title || ''}
								transactionItems={transactionItems}
								currentRequestIndex={currentRequestIndex}
								isRequestsVisible={isRequestsVisible}
								transactionStatus={transactionStatus}
								isAuthor={isAuthor}
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
																postDetailInterestData?.items?.find(
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
								isPendingTransaction={isPendingTransaction}
								postType={
									(postDetailInterestData?.type.toString() as EPostType) ||
									EPostType.GIVE_AWAY_OLD_ITEM
								}
							/>
							<ChatMessagesPanel
								socketMessageResponse={socketMessageResponse}
								socket={socket}
								socketInfo={{
									isOwner: isAuthor,
									interestID,
									userID: receiver.id,
									senderID: senderID || 0
								}}
								connectionStatus={connectionStatus}
								onReconnect={manualReconnect}
							/>
						</div>

						<ItemSidebar
							handleConfirmTransaction={handleConfirmTransaction}
							items={postDetailInterestData?.items || []}
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
															postDetailInterestData?.items?.find(
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
							handleSendRequest={handleSendRequest}
							setSelectedItems={setSelectedItems}
						/>
					</div>
				</div>
			)}
		</>
	)
}

export default Chat
