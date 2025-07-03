import { useCallback, useEffect, useRef, useState } from 'react'

import { useAlertModalContext } from '@/context/alert-modal-context'
import { getAccessToken } from '@/lib/token'

interface UseWebSocketConnectionProps {
	interestID: number
	onMessage?: (data: any) => void
	onTransactionResponse?: () => void
}

export const useWebSocketConnection = ({
	interestID,
	onMessage,
	onTransactionResponse
}: UseWebSocketConnectionProps) => {
	// Memoize callbacks to prevent unnecessary re-renders
	const memoizedOnMessage = useCallback(
		(data: any) => {
			onMessage?.(data)
		},
		[onMessage]
	)

	const memoizedOnTransactionResponse = useCallback(() => {
		onTransactionResponse?.()
	}, [onTransactionResponse])
	const { showInfo } = useAlertModalContext()

	const socketRef = useRef<WebSocket | null>(null)
	const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const pingIntervalRef = useRef<NodeJS.Timeout | null>(null)
	const reconnectAttemptsRef = useRef(0)
	const isReconnectingRef = useRef(false)
	const shouldReconnectRef = useRef(true)
	const isManualCloseRef = useRef(false)

	const maxReconnectAttempts = 5
	const reconnectDelayRef = useRef(1000)
	const connectionTimeout = 10000 // 10 seconds
	const pingInterval = 30000 // 30 seconds

	const [connectionStatus, setConnectionStatus] = useState<
		'connecting' | 'connected' | 'disconnected' | 'reconnecting'
	>('disconnected')

	const token = getAccessToken()

	// Clear all timeouts
	const clearAllTimeouts = useCallback(() => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current)
			reconnectTimeoutRef.current = null
		}
		if (connectionTimeoutRef.current) {
			clearTimeout(connectionTimeoutRef.current)
			connectionTimeoutRef.current = null
		}
		if (pingIntervalRef.current) {
			clearInterval(pingIntervalRef.current)
			pingIntervalRef.current = null
		}
	}, [])

	// Start ping interval
	const startPingInterval = useCallback(() => {
		if (pingIntervalRef.current) {
			clearInterval(pingIntervalRef.current)
		}

		pingIntervalRef.current = setInterval(() => {
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				try {
					socketRef.current.send(JSON.stringify({ event: 'ping' }))
				} catch (error) {
					console.error('❌ Ping failed:', error)
				}
			}
		}, pingInterval)
	}, [])

	// Join room function
	const joinRoom = useCallback(() => {
		if (socketRef.current?.readyState === WebSocket.OPEN && interestID) {
			const msg = {
				event: 'join_room',
				data: { interestID }
			}
			socketRef.current.send(JSON.stringify(msg))
		}
	}, [interestID])

	// Leave room function
	const leaveRoom = useCallback(() => {
		if (socketRef.current?.readyState === WebSocket.OPEN && interestID) {
			const msg = {
				event: 'left_room',
				data: { interestID }
			}
			socketRef.current.send(JSON.stringify(msg))
		}
	}, [interestID])

	// Send transaction
	const sendTransaction = useCallback(
		(receiverID: number) => {
			if (socketRef.current?.readyState === WebSocket.OPEN && interestID) {
				const msg = {
					event: 'send_transaction',
					data: { interestID, receiverID }
				}
				socketRef.current.send(JSON.stringify(msg))
			}
		},
		[interestID]
	)

	// Reset reconnect state
	const resetReconnectState = useCallback(() => {
		isReconnectingRef.current = false
		reconnectAttemptsRef.current = 0
		reconnectDelayRef.current = 1000
		clearAllTimeouts()
	}, [clearAllTimeouts])

	// WebSocket connection function
	const connectWebSocket = useCallback(() => {
		// Prevent multiple connections
		if (isReconnectingRef.current || !shouldReconnectRef.current) {
			return
		}

		// Don't create new connection if already connected or connecting
		if (
			socketRef.current?.readyState === WebSocket.OPEN ||
			socketRef.current?.readyState === WebSocket.CONNECTING
		) {
			return
		}

		// Set connecting status
		setConnectionStatus('connecting')

		// Set connection timeout
		connectionTimeoutRef.current = setTimeout(() => {
			if (socketRef.current?.readyState === WebSocket.CONNECTING) {
				console.warn('⚠️ Connection timeout')
				socketRef.current?.close()
				isReconnectingRef.current = false
				setConnectionStatus('disconnected')

				if (shouldReconnectRef.current) {
					attemptReconnect()
				}
			}
		}, connectionTimeout)

		const wsUrl =
			import.meta.env.VITE_SOCKET_CHAT || 'ws://34.142.168.171:8001/chat'

		try {
			socketRef.current = new WebSocket(wsUrl, [token ?? ''])

			socketRef.current.onopen = () => {
				console.log('✅ WebSocket connected')
				setConnectionStatus('connected')
				resetReconnectState()
				joinRoom()
				startPingInterval()

				// Clear connection timeout
				if (connectionTimeoutRef.current) {
					clearTimeout(connectionTimeoutRef.current)
					connectionTimeoutRef.current = null
				}
			}

			socketRef.current.onmessage = event => {
				try {
					const data = JSON.parse(event.data)

					// Handle pong response
					if (data.event === 'pong') {
						return
					}

					// Handle message response
					if (data.event === 'send_message_response') {
						memoizedOnMessage(data)
					}

					// Handle transaction response
					if (data.event === 'send_transaction_response') {
						memoizedOnTransactionResponse()
					}
				} catch (error) {
					console.error('❌ Parse error:', error)
				}
			}

			socketRef.current.onerror = error => {
				console.error('❌ WebSocket error:', error)
				isReconnectingRef.current = false

				if (connectionTimeoutRef.current) {
					clearTimeout(connectionTimeoutRef.current)
					connectionTimeoutRef.current = null
				}
			}

			socketRef.current.onclose = event => {
				console.warn(
					`⚠️ WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`
				)

				// Clear timeouts and intervals
				clearAllTimeouts()
				isReconnectingRef.current = false
				setConnectionStatus('disconnected')

				// Only attempt reconnect if it wasn't a manual close
				if (
					shouldReconnectRef.current &&
					!isManualCloseRef.current &&
					event.code !== 1000
				) {
					attemptReconnect()
				}

				// Reset manual close flag
				isManualCloseRef.current = false
			}
		} catch (error) {
			console.error('❌ WebSocket connection error:', error)
			isReconnectingRef.current = false
			setConnectionStatus('disconnected')

			if (connectionTimeoutRef.current) {
				clearTimeout(connectionTimeoutRef.current)
				connectionTimeoutRef.current = null
			}

			if (shouldReconnectRef.current) {
				attemptReconnect()
			}
		}
	}, [
		token,
		joinRoom,
		startPingInterval,
		resetReconnectState,
		memoizedOnMessage,
		memoizedOnTransactionResponse
	])

	// Reconnect function with exponential backoff
	const attemptReconnect = useCallback(() => {
		if (isReconnectingRef.current || !shouldReconnectRef.current) {
			return
		}

		if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
			console.error('❌ Max reconnection attempts reached')
			setConnectionStatus('disconnected')
			showInfo({
				infoTitle: 'Mất kết nối',
				infoMessage:
					'Không thể kết nối lại với server. Vui lòng tải lại trang.',
				infoButtonText: 'Đã hiểu'
			})
			return
		}

		isReconnectingRef.current = true
		setConnectionStatus('reconnecting')
		reconnectAttemptsRef.current += 1

		console.log(
			`🔄 Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`
		)

		reconnectTimeoutRef.current = setTimeout(() => {
			isReconnectingRef.current = false
			connectWebSocket()
			// Exponential backoff: double the delay each time, max 30 seconds
			reconnectDelayRef.current = Math.min(reconnectDelayRef.current * 2, 30000)
		}, reconnectDelayRef.current)
	}, [connectWebSocket, showInfo])

	// Manual reconnect function
	const manualReconnect = useCallback(() => {
		console.log('🔄 Manual reconnect initiated')

		// Set manual close flag
		isManualCloseRef.current = true

		// Close existing connection
		if (socketRef.current) {
			socketRef.current.close(1000, 'Manual reconnect')
		}

		// Reset all state
		resetReconnectState()
		shouldReconnectRef.current = true

		// Small delay before reconnecting
		setTimeout(() => {
			connectWebSocket()
		}, 100)
	}, [connectWebSocket, resetReconnectState])

	// Handle page visibility change - debounce to avoid too many reconnects
	useEffect(() => {
		let visibilityTimeout: NodeJS.Timeout

		const handleVisibilityChange = () => {
			if (visibilityTimeout) {
				clearTimeout(visibilityTimeout)
			}

			visibilityTimeout = setTimeout(() => {
				if (document.visibilityState === 'visible') {
					// Page became visible, check connection after a delay
					if (
						socketRef.current?.readyState !== WebSocket.OPEN &&
						shouldReconnectRef.current
					) {
						console.log('🔄 Page visible, checking connection...')
						manualReconnect()
					}
				}
			}, 1000) // 1 second delay
		}

		document.addEventListener('visibilitychange', handleVisibilityChange)
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange)
			if (visibilityTimeout) {
				clearTimeout(visibilityTimeout)
			}
		}
	}, []) // Empty dependency array

	// Initialize WebSocket connection - only depend on interestID
	useEffect(() => {
		shouldReconnectRef.current = true
		connectWebSocket()

		return () => {
			shouldReconnectRef.current = false
			isManualCloseRef.current = true
			clearAllTimeouts()

			if (socketRef.current?.readyState === WebSocket.OPEN) {
				leaveRoom()
				socketRef.current.close(1000, 'Component unmounting')
			}
		}
	}, [interestID]) // Only depend on interestID to prevent unnecessary reconnects

	// Cleanup on interestID change
	useEffect(() => {
		return () => {
			if (socketRef.current?.readyState === WebSocket.OPEN) {
				leaveRoom()
			}
		}
	}, [interestID, leaveRoom])

	return {
		socket: socketRef.current,
		connectionStatus,
		manualReconnect,
		sendTransaction,
		joinRoom,
		leaveRoom
	}
}
