import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'

import { INoti } from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

// Định nghĩa kiểu dữ liệu cho WebSocket response
interface ChatNotificationResponse {
	event: string
	data: INoti
}

// Định nghĩa kiểu dữ liệu cho Context
interface NotiContextType {
	noti: INoti | null
	setNoti: React.Dispatch<React.SetStateAction<INoti | null>>
	isConnected: boolean
	reconnect: () => void
}

// Tạo Context với giá trị mặc định
const NotiContext = createContext<NotiContextType | undefined>(undefined)

// Provider Component
export const NotiProvider: React.FC<{
	children: React.ReactNode
}> = ({ children }) => {
	const socketRef = useRef<WebSocket | null>(null)
	const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const [noti, setNoti] = useState<INoti | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const token = useAuthStore.getState().accessToken

	// Hàm gửi ping lên server
	const sendPingToServer = () => {
		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			const pingMessage = {
				event: 'ping',
				timestamp: new Date().toISOString()
			}
			socketRef.current.send(JSON.stringify(pingMessage))
			console.log('[NOTI] Đã gửi ping lên server')
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

		console.log('[NOTI] Bắt đầu ping interval mỗi 30s')
	}

	// Hàm dừng ping interval
	const stopPingInterval = () => {
		if (pingIntervalRef.current) {
			clearInterval(pingIntervalRef.current)
			pingIntervalRef.current = null
			console.log('[NOTI] Dừng ping interval')
		}
	}

	// Hàm dừng reconnect timeout
	const stopReconnectTimeout = () => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current)
			reconnectTimeoutRef.current = null
			console.log('[NOTI] Dừng reconnect timeout')
		}
	}

	// Hàm disconnect WebSocket
	const disconnectSocket = () => {
		console.log('[NOTI] Disconnecting WebSocket...')

		// Dừng tất cả timers
		stopPingInterval()
		stopReconnectTimeout()

		// Đóng socket
		if (socketRef.current) {
			socketRef.current.close()
			socketRef.current = null
		}

		setIsConnected(false)
		setNoti(null) // Reset notification khi disconnect
	}

	// Hàm xử lý keep_alive response từ server
	const handleKeepAliveFromServer = () => {
		console.log('[NOTI] Nhận được keep_alive từ server - kết nối vẫn ổn định')
		setIsConnected(true)
	}

	// Hàm kết nối WebSocket
	const connectNoti = (token: string) => {
		// Chỉ kết nối khi có token
		if (!token) {
			console.log('[NOTI] Không có token, bỏ qua kết nối socket')
			return
		}

		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			console.log('[NOTI] Socket đã kết nối, bỏ qua kết nối lại')
			return
		}

		if (socketRef.current) {
			socketRef.current.close() // Đóng kết nối cũ nếu có
		}

		const wsUrl =
			import.meta.env.VITE_SOCKET_NOTI || 'ws://34.142.168.171:8001/noti'
		const newSocket = new WebSocket(wsUrl, token)

		newSocket.onopen = () => {
			console.log(
				'[NOTI] Đã kết nối đến server notification. ReadyState:',
				newSocket.readyState
			)
			setIsConnected(true)
			// Bắt đầu ping interval khi kết nối thành công
			startPingInterval()
		}

		newSocket.onmessage = event => {
			try {
				const data = JSON.parse(event.data) as ChatNotificationResponse
				console.log('[NOTI] Thông báo nhận được:', data)

				// Xử lý các event khác nhau
				switch (data.event) {
					case 'receive_noti_response':
						if (data.data) {
							console.log('[NOTI] Notification data:', data.data)
							// Cập nhật notification vào state để truyền ra context
							setNoti(data.data)
						}
						break

					case 'keep_alive':
						handleKeepAliveFromServer()
						break

					default:
						console.log('[NOTI] Nhận được event không xác định:', data.event)
				}
			} catch (error) {
				console.log('[NOTI] Lỗi phân tích tin nhắn: ', error)
			}
		}

		newSocket.onclose = event => {
			console.log(
				'[NOTI] Kết nối đóng. Mã:',
				event.code,
				'Lý do:',
				event.reason
			)
			console.log('[NOTI] Kết nối có được đóng sạch sẽ?', event.wasClean)
			setIsConnected(false)
			socketRef.current = null

			// Dừng ping interval khi kết nối đóng
			stopPingInterval()

			// Chỉ thử kết nối lại nếu vẫn có token
			const currentToken = useAuthStore.getState().accessToken
			if (currentToken && event.code !== 1000) {
				console.log('[NOTI] Attempting to reconnect in 3 seconds...')
				reconnectTimeoutRef.current = setTimeout(() => {
					// Kiểm tra lại token trước khi reconnect
					const tokenAtReconnect = useAuthStore.getState().accessToken
					if (tokenAtReconnect) {
						connectNoti(tokenAtReconnect)
					} else {
						console.log('[NOTI] No token available at reconnect time')
					}
				}, 3000)
			} else {
				console.log(
					'[NOTI] No token available or manual close, not reconnecting'
				)
			}
		}

		newSocket.onerror = err => {
			console.error('[NOTI] Lỗi WebSocket:', err)
			setIsConnected(false)
		}

		socketRef.current = newSocket
	}

	// Hàm kết nối lại thủ công
	const reconnect = () => {
		const currentToken = useAuthStore.getState().accessToken
		if (currentToken) {
			console.log('[NOTI] Manual reconnection...')
			connectNoti(currentToken)
		} else {
			console.log('[NOTI] No token available for manual reconnection')
		}
	}

	// Effect để xử lý thay đổi token
	useEffect(() => {
		if (token) {
			// Có token -> kết nối
			if (
				!socketRef.current ||
				socketRef.current.readyState === WebSocket.CLOSED
			) {
				connectNoti(token)
			}
		} else {
			// Token null -> disconnect
			console.log('[NOTI] Token is null, disconnecting WebSocket')
			disconnectSocket()
		}

		return () => {
			// Cleanup khi component unmount
			disconnectSocket()
		}
	}, [token])

	// Cung cấp giá trị cho context
	const contextValue: NotiContextType = {
		noti,
		setNoti,
		isConnected,
		reconnect
	}

	return (
		<NotiContext.Provider value={contextValue}>{children}</NotiContext.Provider>
	)
}

// Custom hook để sử dụng context
export const useNoti = () => {
	const context = useContext(NotiContext)
	if (!context) {
		throw new Error('useNoti phải được sử dụng trong NotiProvider')
	}
	return context
}
