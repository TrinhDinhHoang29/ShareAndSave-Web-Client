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
	followedByNotification: ChatNoti | null
	followingNotification: ChatNoti | null
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
	const [followedByNotification, setFollowedByNotification] =
		useState<ChatNoti | null>(null)
	const [followingNotification, setFollwingNotification] =
		useState<ChatNoti | null>(null)
	const token = getAccessToken()

	// Hàm kết nối WebSocket
	const connectNoti = (token: string) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			console.log(
				'[ℹ️] Socket đã kết nối hoặc đang kết nối, bỏ qua kết nối lại'
			)
			return
		}

		if (socketRef.current) {
			socketRef.current.close() // Đóng kết nối cũ nếu có
		}

		const wsUrl = `ws://34.142.168.171:8001/chat-noti`
		const newSocket = new WebSocket(wsUrl, token || '')

		newSocket.onopen = () => {
			console.log(
				'[✅] Đã kết nối đến server noti. ReadyState:',
				newSocket.readyState
			)
		}

		newSocket.onmessage = event => {
			console.log('[ℹ️] Tin nhắn thô nhận được:', event.data)
			try {
				const data = JSON.parse(event.data) as ChatNotificationResponse
				if (data.event === 'send_message_response') {
					const type = data.data.type as ETypeNotification
					if (type === ETypeNotification.FOLLOWING) {
						setFollwingNotification(data.data)
					} else {
						setFollowedByNotification(data.data)
					}
				}
			} catch (error) {
				console.log('[⚠️] Lỗi phân tích tin nhắn: ', error)
			}
		}

		newSocket.onclose = event => {
			console.log('[❌] Kết nối đóng. Mã:', event.code, 'Lý do:', event.reason)
			console.log('[ℹ️] Kết nối có được đóng sạch sẽ?', event.wasClean)
			socketRef.current = null
			// Thử kết nối lại sau 3 giây
			setTimeout(() => {
				console.log('[ℹ️] Đang thử kết nối lại...')
				connectNoti(token)
			}, 3000)
		}

		newSocket.onerror = err => {
			console.error('[⚠️] Lỗi WebSocket:', err)
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
				socketRef.current.readyState === WebSocket.OPEN
			) {
				socketRef.current.close() // Chỉ đóng nếu còn mở hoặc đang kết nối
			}
		}
	}, [token])

	// Cung cấp socket từ ref trong context
	const contextValue = {
		followedByNotification,
		followingNotification
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
			'useChatNotification phải được sử dụng trong ChatNotificationProvider'
		)
	}
	return context
}
