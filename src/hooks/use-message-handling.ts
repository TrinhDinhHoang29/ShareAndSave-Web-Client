import { useCallback, useState } from 'react'

import { generateRandomId } from '@/lib/utils'
import { EMessageStatus } from '@/models/enums'
import { IChatMessagesPanel, IMessage } from '@/models/interfaces'

export const useMessageHandling = (
	socketInfo: IChatMessagesPanel['socketInfo'],
	socket: WebSocket | null,
	scrollToBottom: (force?: boolean, smooth?: boolean) => void,
	incrementUnreadCount: () => void,
	isNearBottom: boolean
) => {
	const [message, setMessage] = useState('')
	const [realtimeMessages, setRealtimeMessages] = useState<IMessage[]>([])

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

			setTimeout(() => scrollToBottom(true, true), 100)

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
		(
			socketResponse: IChatMessagesPanel['socketMessageResponse'],
			senderID: number
		) => {
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
					// Smart scroll behavior for incoming messages
					if (isNearBottom) {
						// If user is near bottom, auto-scroll
						setTimeout(() => scrollToBottom(true, true), 100)
					} else {
						// If user is not near bottom, increment unread count
						incrementUnreadCount()
					}
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
