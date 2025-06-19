import { useCallback, useEffect, useMemo, useRef } from 'react'

import messageApi from '@/apis/modules/message.api'
import { useListMessageQuery } from '@/hooks/queries/use-chat.query'
import { useInfiniteScroll } from '@/hooks/use-infinite-scroll'
import { useMessageHandling } from '@/hooks/use-message-handling'
import { useScrollManagement } from '@/hooks/use-scroll-management'
import { LIMIT_MESSAGE } from '@/models/constants'
import { EMessageStatus } from '@/models/enums'
import { IChatMessagesPanel, IMessage } from '@/models/interfaces'

import MessageInput from './MessageInput'
import MessagesContainer from './MessagesContainer'
import ScrollToBottomButton from './ScrollToBottomButton'

const ChatMessagesPanel = ({
	socketInfo,
	socket,
	socketMessageResponse
}: IChatMessagesPanel) => {
	const isInitialLoad = useRef(true)

	// Custom hooks
	const {
		scrollContainerRef,
		scrollToBottom,
		handleScroll,
		incrementUnreadCount,
		showScrollToBottom,
		unreadCount
	} = useScrollManagement()
	const {
		message,
		setMessage,
		realtimeMessages,
		handleSend,
		updateMessageStatus
	} = useMessageHandling(
		socketInfo,
		socket,
		scrollToBottom,
		incrementUnreadCount,
		!showScrollToBottom
	)

	const handleScrollToBottomClick = useCallback(() => {
		scrollToBottom(true, true)
	}, [scrollToBottom])
	// API data fetching
	const {
		data: messagesData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		refetch
	} = useListMessageQuery({
		interestID: socketInfo.interestID,
		limit: LIMIT_MESSAGE
	})

	useEffect(() => {
		const handleRefetch = async () => {
			const data = await messageApi.update(socketInfo.interestID)
			console.log(data.message)
			refetch()
		}
		handleRefetch()
	}, [])

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

	// Effects
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
		if (
			!isInitialLoad.current &&
			socketMessageResponse.data?.senderID === socketInfo.senderID
		) {
			scrollToBottom(true)
		}
	}, [socketMessageResponse.data])

	useEffect(() => {
		updateMessageStatus(socketMessageResponse, socketInfo.senderID)
	}, [socketMessageResponse, socketInfo.senderID, updateMessageStatus])

	// Event handlers
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

	const throttledHandleScroll = useCallback(() => {
		handleScroll(handleLoadMore, hasNextPage, isFetchingNextPage)
	}, [handleScroll, handleLoadMore, hasNextPage, isFetchingNextPage])

	const isStatusChange = useMemo(() => {
		return (
			allMessages &&
			allMessages.length > 0 &&
			((realtimeMessages &&
				realtimeMessages.length > 0 &&
				allMessages[allMessages.length - 1].id ===
					realtimeMessages[realtimeMessages.length - 1].id) ||
				allMessages.length === apiMessages.length)
		)
	}, [allMessages.length, realtimeMessages.length, apiMessages.length])

	return (
		<>
			<MessagesContainer
				scrollContainerRef={scrollContainerRef}
				onScroll={throttledHandleScroll}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				allMessages={allMessages}
				isStatusChange={isStatusChange}
			/>
			<div className='relative'>
				<ScrollToBottomButton
					onClick={handleScrollToBottomClick}
					unreadCount={unreadCount}
					show={showScrollToBottom}
				/>
				<MessageInput
					message={message}
					onMessageChange={handleInputChange}
					onSend={handleSend}
					onKeyPress={handleKeyPress}
				/>
			</div>
		</>
	)
}

export default ChatMessagesPanel
