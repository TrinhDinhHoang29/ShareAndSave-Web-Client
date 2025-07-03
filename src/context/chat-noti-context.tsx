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
	isConnected: boolean
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
	const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const [followedByNotification, setFollowedByNotification] =
		useState<ChatNoti | null>(null)
	const [followingNotification, setFollwingNotification] =
		useState<ChatNoti | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const token = getAccessToken()

	// Hàm gửi ping lên server
	const sendPingToServer = () => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			const pingMessage = {
				event: 'ping',
				timestamp: new Date().toISOString()
			}
			socketRef.current.send(JSON.stringify(pingMessage))
			console.log('Đã gửi ping lên server')
		}
	}

	// Hàm bắt đầu ping interval
	const startPingInterval = () => {
		// Clear interval cũ nếu có
		if (pingIntervalRef.current) {
			clearInterval(pingIntervalRef.current)
		}

		// Tạo interval ping mỗi 30s
		pingIntervalRef.current = setInterval(() => {
			sendPingToServer()
		}, 30000) // 30 giây

		console.log('Bắt đầu ping interval mỗi 30s')
	}

	// Hàm dừng ping interval
	const stopPingInterval = () => {
		if (pingIntervalRef.current) {
			clearInterval(pingIntervalRef.current)
			pingIntervalRef.current = null
			console.log('Dừng ping interval')
		}
	}

	// Hàm xử lý keep_alive response từ server
	const handleKeepAliveFromServer = () => {
		console.log('Nhận được keep_alive từ server - kết nối vẫn ổn định')
		setIsConnected(true)
	}

	// Hàm kết nối WebSocket
	const connectNoti = (token: string) => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			return
		}

		if (socketRef.current) {
			socketRef.current.close() // Đóng kết nối cũ nếu có
		}

		const wsUrl =
			import.meta.env.VITE_SOCKET_CHAT_NOTI ||
			'ws://34.142.168.171:8001/chat-noti'
		const newSocket = new WebSocket(wsUrl, token || '')

		newSocket.onopen = () => {
			console.log('Đã kết nối chat noti')
			setIsConnected(true)
			// Bắt đầu ping interval khi kết nối thành công
			startPingInterval()
		}

		newSocket.onmessage = event => {
			try {
				const data = JSON.parse(event.data) as ChatNotificationResponse
				const type = data.data.type as ETypeNotification
				console.log('Nhận được message:', data)

				// Xử lý các event khác nhau
				switch (data.event) {
					case 'send_message_response':
						if (type === ETypeNotification.FOLLOWING) {
							setFollwingNotification(data.data)
						} else {
							setFollowedByNotification(data.data)
						}
						break

					case 'keep_alive':
						handleKeepAliveFromServer()
						break

					default:
						console.log('Nhận được event không xác định:', data.event)
				}
			} catch (error) {
				console.log('[⚠️] Lỗi phân tích tin nhắn: ', error)
			}
		}

		newSocket.onclose = event => {
			console.log('WebSocket đã đóng:', event.code, event.reason)
			socketRef.current = null
			setIsConnected(false)

			// Dừng ping interval khi kết nối đóng
			stopPingInterval()

			// Thử kết nối lại sau 3 giây
			setTimeout(() => {
				connectNoti(token)
			}, 3000)
		}

		newSocket.onerror = err => {
			console.error('[⚠️] Lỗi WebSocket:', err)
			setIsConnected(false)
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
			// Dừng ping interval khi component unmount
			stopPingInterval()

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
		followingNotification,
		isConnected
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
