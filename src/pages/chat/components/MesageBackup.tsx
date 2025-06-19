import { RefreshCw, Send } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import Loading from '@/components/common/Loading'
import { useListMessageQuery } from '@/hooks/queries/use-chat.query'
import {
	formatHoverTime,
	formatNearlyDateTimeVN,
	generateRandomId,
	isOneMinuteDifference
} from '@/lib/utils'
import { LIMIT_MESSAGE } from '@/models/constants'
import { EMessageStatus } from '@/models/enums'
import { IMessage, ISocketMessageResponse } from '@/models/interfaces'

interface Props {
	socket: WebSocket | null
	socketInfo: {
		isOwner: boolean
		interestID: number
		userID: number
		senderID: number
	}
	socketMessageResponse: {
		data?: ISocketMessageResponse
		status: 'success' | 'error'
	}
}

// Constants
const SCROLL_THRESHOLD = 100
const SCROLL_TIMEOUT = 300 // Reduced from 1500ms
const TIME_GAP_THRESHOLD = 30 * 60 * 1000 // 30 minutes in milliseconds

// Helper function to check if timestamp should be shown
const shouldShowTimestamp = (
	currentMessage: IMessage,
	previousMessage?: IMessage
): boolean => {
	if (!previousMessage) return true // Always show timestamp for first message

	const currentTime = new Date(currentMessage.time).getTime()
	const previousTime = new Date(previousMessage.time).getTime()
	const timeDiff = Math.abs(currentTime - previousTime)

	return timeDiff >= TIME_GAP_THRESHOLD
}

// Optimized scroll management with better performance
const useScrollManagement = () => {
	const scrollContainerRef = useRef<HTMLDivElement>(null)
	const [isUserScrolling, setIsUserScrolling] = useState(false)
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const isNearBottomRef = useRef(true)

	const checkIsNearBottom = useCallback(() => {
		const container = scrollContainerRef.current
		if (!container) return false

		const { scrollTop, scrollHeight, clientHeight } = container
		const isNear = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD
		isNearBottomRef.current = isNear
		return isNear
	}, [])

	const scrollToBottom = useCallback(
		(force = false) => {
			const container = scrollContainerRef.current
			if (!container) return

			if (force || (!isUserScrolling && isNearBottomRef.current)) {
				container.scrollTop = container.scrollHeight
			}
		},
		[isUserScrolling]
	)

	// Lightweight scroll handler
	const handleScroll = useCallback(
		(
			onLoadMore: () => void,
			hasNextPage: boolean,
			isFetchingNextPage: boolean
		) => {
			const container = scrollContainerRef.current
			if (!container) return

			const { scrollTop } = container

			// Load more messages when scrolled to top
			if (scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
				onLoadMore()
			}

			// Update near bottom status immediately
			checkIsNearBottom()

			// Debounce user scrolling state with shorter timeout
			setIsUserScrolling(true)
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}
			scrollTimeoutRef.current = setTimeout(() => {
				setIsUserScrolling(false)
			}, SCROLL_TIMEOUT)
		},
		[checkIsNearBottom]
	)

	useEffect(() => {
		return () => {
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}
		}
	}, [])

	return {
		scrollContainerRef,
		isUserScrolling,
		scrollToBottom,
		handleScroll
	}
}

// Simplified infinite scroll
const useInfiniteScroll = (fetchNextPage: () => void) => {
	const [isLoadingMore, setIsLoadingMore] = useState(false)
	const previousScrollHeight = useRef(0)

	const handleLoadMore = useCallback(() => {
		const container = document.querySelector(
			'.messages-container'
		) as HTMLDivElement
		if (container) {
			setIsLoadingMore(true)
			previousScrollHeight.current = container.scrollHeight
			fetchNextPage()
		}
	}, [fetchNextPage])

	const maintainScrollPosition = useCallback(
		(isFetchingNextPage: boolean) => {
			if (isLoadingMore && !isFetchingNextPage) {
				const container = document.querySelector(
					'.messages-container'
				) as HTMLDivElement
				if (container) {
					const newScrollHeight = container.scrollHeight
					const scrollDifference =
						newScrollHeight - previousScrollHeight.current
					container.scrollTop = scrollDifference
				}
				setIsLoadingMore(false)
			}
		},
		[isLoadingMore]
	)

	return {
		isLoadingMore,
		handleLoadMore,
		maintainScrollPosition
	}
}

// Optimized message handling with batching
const useMessageHandling = (
	socketInfo: Props['socketInfo'],
	socket: WebSocket | null
) => {
	const [message, setMessage] = useState('')
	const [realtimeMessages, setRealtimeMessages] = useState<IMessage[]>([])

	// Remove complex batching system that causes delays
	const sendMessage = useCallback(
		(messageText: string) => {
			if (
				!messageText.trim() ||
				!socket ||
				socket.readyState !== WebSocket.OPEN
			) {
				return
			}

			const newMessage: IMessage = {
				id: generateRandomId(),
				receiver: 'user',
				message: messageText,
				time: new Date().toISOString(),
				status: EMessageStatus.SENDING
			}

			// Direct state update without batching
			setRealtimeMessages(prev => [...prev, newMessage])

			// Send via socket
			const socketData = {
				event: 'send_message',
				data: {
					isOwner: socketInfo.isOwner,
					interestID: socketInfo.interestID,
					userID: socketInfo.userID,
					message: messageText
				}
			}

			socket.send(JSON.stringify(socketData))

			// Simple retry function
			const retrySend = () => {
				setRealtimeMessages(prev =>
					prev.map(m =>
						m.id === newMessage.id && m.status === EMessageStatus.ERROR
							? { ...m, status: EMessageStatus.SENDING }
							: m
					)
				)
				socket.send(JSON.stringify(socketData))
			}

			// Add retry to message
			setRealtimeMessages(prev =>
				prev.map(m => (m.id === newMessage.id ? { ...m, retry: retrySend } : m))
			)
		},
		[socket, socketInfo]
	)

	const handleSend = useCallback(() => {
		if (message.trim()) {
			sendMessage(message)
			setMessage('')
		}
	}, [message, sendMessage])

	const updateMessageStatus = useCallback(
		(socketResponse: Props['socketMessageResponse'], senderID: number) => {
			if (socketResponse.status === 'success' && socketResponse.data) {
				const {
					senderID: senderChatID,
					message: incomingMessage,
					timestamp
				} = socketResponse.data
				const isCurrentUser = senderID === senderChatID

				if (isCurrentUser) {
					// Update sent message status
					setRealtimeMessages(prev =>
						prev.map(m => {
							if (m.status === EMessageStatus.SENDING) {
								return { ...m, status: EMessageStatus.SENT }
							}
							return m
						})
					)
				} else {
					// Add incoming message and update delivery status
					setRealtimeMessages(prev => {
						const newMessage: IMessage = {
							id: generateRandomId(),
							receiver: 'other',
							message: incomingMessage,
							time: timestamp,
							status: EMessageStatus.RECEIVED
						}

						return [...prev, newMessage]
					})
				}
			} else if (socketResponse.status === 'error') {
				// Handle send error
				setRealtimeMessages(prev =>
					prev.map(m =>
						m.status === EMessageStatus.SENDING
							? {
									...m,
									status: EMessageStatus.ERROR,
									retry: () => sendMessage(m.message)
								}
							: m
					)
				)
			}
		},
		[sendMessage]
	)

	return {
		message,
		setMessage,
		realtimeMessages,
		handleSend,
		updateMessageStatus
	}
}

// Memoized components
const MessageStatusIndicator = React.memo(
	({ message }: { message: IMessage }) => {
		const isTimeDistance = isOneMinuteDifference(message.time)
		switch (message.status) {
			case EMessageStatus.SENDING:
				return (
					<div className='text-muted-foreground flex items-center text-xs'>
						<div className='border-muted-foreground mr-1 h-3 w-3 animate-spin rounded-full border border-t-transparent' />
						Đang gửi...
					</div>
				)
			case EMessageStatus.SENT:
				return (
					<div className='text-muted-foreground flex justify-end text-xs'>
						Đã gửi {isTimeDistance && formatNearlyDateTimeVN(message.time)}
					</div>
				)
			case EMessageStatus.RECEIVED:
				return null
			case EMessageStatus.ERROR:
				return (
					<div className='mt-1 flex items-center text-xs text-red-500'>
						<span>⚠ Gửi thất bại</span>
						{message.retry && (
							<button
								onClick={message.retry}
								className='ml-2 flex items-center text-blue-500 transition-colors hover:text-blue-600'
							>
								<RefreshCw className='mr-1 h-3 w-3' />
								Thử lại
							</button>
						)}
					</div>
				)
			default:
				return null
		}
	}
)

// Timestamp component
const TimestampDivider = React.memo(({ timestamp }: { timestamp: string }) => (
	<div className='flex items-center justify-center py-4'>
		<div className='bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium'>
			{formatHoverTime(timestamp)}
		</div>
	</div>
))

// Simplified MessageBubble without heavy animations
const MessageBubble = React.memo(
	({ message, index }: { message: IMessage; index: number }) => (
		<div
			key={`${message.id}-${index}`}
			className={`flex ${message.receiver === 'user' ? 'justify-end' : 'justify-start'}`}
		>
			<div
				className={`flex flex-col ${message.receiver === 'user' ? 'items-end' : 'items-start'} max-w-[60%]`}
			>
				<div
					className={`group relative w-full rounded-2xl px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md ${
						message.receiver === 'user'
							? 'bg-primary text-primary-foreground rounded-br-md'
							: 'border-border bg-card text-foreground rounded-bl-md border'
					}`}
				>
					<p className='text-sm leading-relaxed break-words'>
						{message.message}
					</p>
					<div
						className={`pointer-events-none absolute top-1/2 z-50 -translate-y-1/2 rounded-md bg-gray-800 px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 ${
							message.receiver === 'user' ? 'right-full mr-2' : 'left-full ml-2'
						}`}
					>
						{formatHoverTime(message.time)}
					</div>
				</div>
			</div>
		</div>
	)
)

const ChatMessagesPanel = ({
	socketInfo,
	socket,
	socketMessageResponse
}: Props) => {
	const isInitialLoad = useRef(true)

	// Custom hooks
	const { scrollContainerRef, scrollToBottom, handleScroll } =
		useScrollManagement()
	const {
		message,
		setMessage,
		realtimeMessages,
		handleSend,
		updateMessageStatus
	} = useMessageHandling(socketInfo, socket)

	// API data fetching
	const {
		data: messagesData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useListMessageQuery({
		interestID: socketInfo.interestID,
		limit: LIMIT_MESSAGE
	})

	const { handleLoadMore, maintainScrollPosition } =
		useInfiniteScroll(fetchNextPage)

	// Simplified API messages conversion
	const apiMessages: IMessage[] = useMemo(() => {
		if (!messagesData?.pages?.length) return []

		return messagesData.pages
			.flatMap(page => page)
			.map(m => ({
				id: m.id,
				receiver:
					socketInfo.senderID === m.senderID
						? ('user' as const)
						: ('other' as const),
				message: m.message,
				time: m.createdAt,
				status:
					socketInfo.senderID === m.senderID
						? EMessageStatus.SENT
						: EMessageStatus.RECEIVED
			}))
			.reverse()
	}, [messagesData?.pages, socketInfo.senderID])

	// Simplified message deduplication
	const allMessages = useMemo(() => {
		if (!apiMessages.length && !realtimeMessages.length) return []

		const apiIds = new Set(apiMessages.map(m => m.id))
		const uniqueRealtime = realtimeMessages.filter(m => !apiIds.has(m.id))
		return [...apiMessages, ...uniqueRealtime]
	}, [apiMessages, realtimeMessages])

	// Simplified effects
	useEffect(() => {
		maintainScrollPosition(isFetchingNextPage)
	}, [isFetchingNextPage, maintainScrollPosition])

	useEffect(() => {
		if (isInitialLoad.current && allMessages.length > 0) {
			scrollToBottom(true)
			isInitialLoad.current = false
		}
	}, [allMessages.length])

	useEffect(() => {
		if (!isInitialLoad.current && socketMessageResponse.data) {
			scrollToBottom(true)
		}
	}, [socketMessageResponse.data])

	useEffect(() => {
		updateMessageStatus(socketMessageResponse, socketInfo.senderID)
	}, [socketMessageResponse, socketInfo.senderID, updateMessageStatus])

	// Direct input handling - no debouncing or complex logic
	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			setMessage(e.target.value)
		},
		[setMessage]
	)

	const handleKeyPress = useCallback(
		(e: React.KeyboardEvent) => {
			if (e.key === 'Enter' && !e.shiftKey) {
				e.preventDefault()
				handleSend()
			}
		},
		[handleSend]
	)

	// Throttled scroll handler
	const throttledHandleScroll = useCallback(() => {
		handleScroll(handleLoadMore, hasNextPage, isFetchingNextPage)
	}, [handleScroll, handleLoadMore, hasNextPage, isFetchingNextPage])

	return (
		<>
			<div
				ref={scrollContainerRef}
				onScroll={throttledHandleScroll}
				className='bg-muted messages-container max-h-[400px] min-h-[350px] flex-1 overflow-y-auto'
			>
				{/* End of messages indicator */}
				{!hasNextPage && allMessages.length > 0 && (
					<div className='flex justify-center pt-4'>
						<div className='text-muted-foreground text-xs'>
							Không còn tin nhắn nào
						</div>
					</div>
				)}
				{/* Loading indicator */}
				{isFetchingNextPage && (
					<Loading
						size='sm'
						color='primary'
					/>
				)}

				{/* Messages with timestamp dividers */}
				<div className='space-y-2 p-4'>
					{allMessages.map((msg, i) => (
						<React.Fragment key={`${msg.id}-${i}`}>
							{/* Show timestamp if there's a significant time gap */}
							{shouldShowTimestamp(msg, allMessages[i - 1]) && (
								<TimestampDivider timestamp={msg.time} />
							)}
							<MessageBubble
								message={msg}
								index={i}
							/>
						</React.Fragment>
					))}
					{allMessages &&
					allMessages.length > 0 &&
					((realtimeMessages &&
						realtimeMessages.length > 0 &&
						allMessages[allMessages.length - 1].id ===
							realtimeMessages[realtimeMessages.length - 1].id) ||
						allMessages.length === apiMessages.length) ? (
						<MessageStatusIndicator
							message={allMessages[allMessages.length - 1]}
						/>
					) : null}
				</div>
			</div>

			{/* Message input */}
			<div className='border-border bg-card border-t px-4 py-3'>
				<div className='flex space-x-3'>
					<input
						type='text'
						value={message}
						onChange={handleInputChange}
						onKeyPress={handleKeyPress}
						className='border-border focus:ring-primary bg-background flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
						placeholder='Nhập tin nhắn...'
					/>
					<button
						onClick={handleSend}
						disabled={!message.trim()}
						className='bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground flex min-w-[60px] items-center justify-center rounded-xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none'
					>
						<Send className='h-5 w-5' />
					</button>
				</div>
			</div>
		</>
	)
}

export default ChatMessagesPanel
