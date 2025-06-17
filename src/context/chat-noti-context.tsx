// src/context/ChatNotificationContext.tsx
import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'

import { getAccessToken } from '@/lib/token'
import { ETypeNotification } from '@/models/enums'

interface ChatNoti {
	interestID?: number
	type?: ETypeNotification // "following" || "followedBy"
	userID?: number
	timestamp?: string
}
// Định nghĩa kiểu dữ liệu cho response
interface ChatNotificationResponse {
	event: string
	status: string
	data: ChatNoti
	error?: string
}

// Định nghĩa kiểu dữ liệu cho Context
interface ChatNotificationContextType {
	followedByNotifications: ChatNoti[]
	followingNotifications: ChatNoti[]
}

// Tạo Context với giá trị mặc định
const ChatNotificationContext = createContext<
	ChatNotificationContextType | undefined
>(undefined)

// Provider Component
export const ChatNotificationProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const socketRef = useRef<WebSocket | null>(null)
	const [followedByNotifications, setFollowedByNotifications] = useState<
		ChatNoti[]
	>([])
	const [followingNotifications, setFollwingNotifications] = useState<
		ChatNoti[]
	>([])
	const token = getAccessToken()

	// Hàm kết nối WebSocket
	const connectNoti = (token: string) => {
		if (socketRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
			console.log(
				'[ℹ️] Socket already connected or connecting, skipping reconnection'
			)
			return
		}

		if (socketRef.current) {
			socketRef.current.close() // Đóng kết nối cũ nếu có
		}

		const wsUrl = `ws://34.142.168.171:8001/chat-noti`
		const newSocket = new WebSocket(wsUrl, token || '')

		newSocket.onopen = () => {
			console.log('[✅] Connected to server noti. ReadyState:', newSocket)
		}

		newSocket.onmessage = event => {
			try {
				const data = JSON.parse(event.data) as ChatNotificationResponse
				if (data.event === 'send_message_response') {
					const type = data.data.type as ETypeNotification
					if (type === ETypeNotification.FOLLOWING) {
						setFollwingNotifications(prev => [...prev, data.data])
					} else {
						setFollowedByNotifications(prev => [...prev, data.data])
					}
				}
			} catch (error) {
				console.log('[⚠️] Error parsing message: ', error)
			}
		}

		newSocket.onclose = event => {
			console.log(
				'[❌] Connection closed. Code:',
				event.code,
				'Reason:',
				event.reason
			)
			socketRef.current = null
		}

		newSocket.onerror = err => {
			console.log('[⚠️] Error: ', err)
		}

		socketRef.current = newSocket
	}

	// Tự động kết nối khi token thay đổi
	useEffect(() => {
		if (
			token &&
			(!socketRef.current || socketRef.current.readyState === WebSocket.CLOSED)
		) {
			connectNoti(token)
		}

		return () => {
			if (
				socketRef.current &&
				socketRef.current?.readyState === WebSocket.OPEN
			) {
				socketRef.current.close() // Chỉ đóng nếu còn mở hoặc đang kết nối
			}
		}
	}, [token])

	// Cung cấp socket từ ref trong context
	const contextValue = {
		followedByNotifications,
		followingNotifications
	}

	return (
		<ChatNotificationContext.Provider value={contextValue}>
			{children}
		</ChatNotificationContext.Provider>
	)
}

// Custom hook để sử dụng context
export const useChatNotification = () => {
	const context = useContext(ChatNotificationContext)
	if (!context) {
		throw new Error(
			'useChatNotification must be used within a ChatNotificationProvider'
		)
	}
	return context
}
