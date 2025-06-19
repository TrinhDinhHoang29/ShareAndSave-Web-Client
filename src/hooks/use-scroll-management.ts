import { useCallback, useEffect, useRef, useState } from 'react'

import { SCROLL_THRESHOLD, SCROLL_TIMEOUT } from '@/models/constants'

export const useScrollManagement = () => {
	const scrollContainerRef = useRef<HTMLDivElement | null>(null)
	const [isUserScrolling, setIsUserScrolling] = useState(false)
	const [showScrollToBottom, setShowScrollToBottom] = useState(false)
	const [unreadCount, setUnreadCount] = useState(0)
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
	const isNearBottomRef = useRef(true)

	const checkIsNearBottom = useCallback(() => {
		const container = scrollContainerRef.current
		if (!container) return false

		const { scrollTop, scrollHeight, clientHeight } = container
		const isNear = scrollTop + clientHeight >= scrollHeight - SCROLL_THRESHOLD
		isNearBottomRef.current = isNear
		setShowScrollToBottom(!isNear)
		if (isNear) {
			setUnreadCount(0)
		}
		return isNear
	}, [])

	const scrollToBottom = useCallback(
		(force = false, smooth = false) => {
			const container = scrollContainerRef.current
			if (!container) return

			if (force || (!isUserScrolling && isNearBottomRef.current)) {
				if (smooth) {
					container.scrollTo({
						top: container.scrollHeight,
						behavior: 'smooth'
					})
				} else {
					container.scrollTop = container.scrollHeight
				}
				setUnreadCount(0)
			}
		},
		[isUserScrolling]
	)

	const incrementUnreadCount = useCallback(() => {
		if (!isNearBottomRef.current) {
			setUnreadCount(prev => prev + 1)
		}
	}, [])

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
		handleScroll,
		incrementUnreadCount,
		unreadCount,
		showScrollToBottom
	}
}
