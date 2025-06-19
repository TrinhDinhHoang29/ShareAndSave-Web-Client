import { useCallback, useRef, useState } from 'react'

export const useInfiniteScroll = (fetchNextPage: () => void) => {
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
