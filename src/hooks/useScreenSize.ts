// hooks/useScreenSize.js
import { useEffect, useState } from 'react'

export const useScreenSize = () => {
	const [isMobile, setIsMobile] = useState(false)
	const [isTablet, setIsTablet] = useState(false)

	useEffect(() => {
		const checkScreenSize = () => {
			const width = window.innerWidth
			setIsMobile(width < 640) // Mobile: < 640px
			setIsTablet(width >= 640 && width < 1024) // Tablet: 640px - 1024px
		}

		checkScreenSize()
		window.addEventListener('resize', checkScreenSize)
		return () => window.removeEventListener('resize', checkScreenSize)
	}, [])

	return { isMobile, isTablet, isDesktop: !isMobile && !isTablet }
}
