import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState
} from 'react'

import { getAccessToken } from '@/lib/token'
import { INoti } from '@/models/interfaces'

// Định nghĩa kiểu dữ liệu cho WebSocket response
interface ChatNotificationResponse {
	event: string
	data: INoti
}

// Định nghĩa kiểu dữ liệu cho Context
interface NotiContextType {
	noti: INoti | null
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
	const [noti, setNoti] = useState<INoti | null>(null)
	const [isConnected, setIsConnected] = useState(false)
	const token = getAccessToken()

	// Hàm kết nối WebSocket
	const connectNoti = (token: string) => {
		// Chỉ kết nối khi có token
		if (!token) {
			console.log('[ℹ️] Không có token, bỏ qua kết nối socket')
			return
		}

		if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
			console.log(
				'[ℹ️] Socket đã kết nối hoặc đang kết nối, bỏ qua kết nối lại'
			)
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
				'[✅] Đã kết nối đến server notification. ReadyState:',
				newSocket.readyState
			)
			setIsConnected(true)
		}

		newSocket.onmessage = event => {
			try {
				const data = JSON.parse(event.data) as ChatNotificationResponse
				console.log('Thông báo nhận được:', data)

				// Xử lý khi nhận được notification
				if (data.event === 'receive_noti_response' && data.data) {
					console.log('Notification data:', data.data)
					// Cập nhật notification vào state để truyền ra context
					setNoti(data.data)
				}
			} catch (error) {
				console.log('[⚠️] Lỗi phân tích tin nhắn: ', error)
			}
		}

		newSocket.onclose = event => {
			console.log('[❌] Kết nối đóng. Mã:', event.code, 'Lý do:', event.reason)
			console.log('[ℹ️] Kết nối có được đóng sạch sẽ?', event.wasClean)
			setIsConnected(false)
			socketRef.current = null

			// Chỉ thử kết nối lại nếu vẫn có token và không phải đóng có chủ ý
			if (token && event.code !== 1000) {
				setTimeout(() => {
					console.log('[ℹ️] Đang thử kết nối lại...')
					connectNoti(token)
				}, 3000)
			}
		}

		newSocket.onerror = err => {
			console.error('[⚠️] Lỗi WebSocket:', err)
			setIsConnected(false)
		}

		socketRef.current = newSocket
	}

	// Hàm kết nối lại thủ công
	const reconnect = () => {
		const currentToken = getAccessToken()
		if (currentToken) {
			connectNoti(currentToken)
		}
	}

	// Tự động kết nối khi token thay đổi
	useEffect(() => {
		if (token) {
			// Chỉ kết nối nếu chưa có kết nối hoặc kết nối đã đóng
			if (
				!socketRef.current ||
				socketRef.current.readyState === WebSocket.CLOSED
			) {
				connectNoti(token)
			}
		} else {
			// Nếu không có token, đóng kết nối nếu đang mở
			if (
				socketRef.current &&
				socketRef.current.readyState === WebSocket.OPEN
			) {
				socketRef.current.close()
			}
			setIsConnected(false)
			setNoti(null) // Reset notification khi không có token
		}

		// Cleanup function
		return () => {
			if (
				socketRef.current &&
				(socketRef.current.readyState === WebSocket.OPEN ||
					socketRef.current.readyState === WebSocket.CONNECTING)
			) {
				socketRef.current.close()
			}
		}
	}, [token])

	// Cleanup khi component unmount
	useEffect(() => {
		return () => {
			if (socketRef.current) {
				socketRef.current.close()
			}
		}
	}, [])

	// Cung cấp giá trị cho context
	const contextValue: NotiContextType = {
		noti,
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
