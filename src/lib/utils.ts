import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formatNearlyDateTimeVN = (dateString: string): string => {
	try {
		const now = new Date()
		const date = new Date(dateString)
		const diffMs = now.getTime() - date.getTime()
		const diffSeconds = Math.floor(diffMs / 1000)
		const diffMinutes = Math.floor(diffSeconds / 60)
		const diffHours = Math.floor(diffMinutes / 60)
		const diffDays = Math.floor(diffHours / 24)
		const diffWeeks = Math.floor(diffDays / 7)
		const diffMonths = Math.floor(diffDays / 30) // Approximate

		if (diffSeconds < 60) {
			return `${diffSeconds} giây trước`
		} else if (diffMinutes < 60) {
			const minutes = diffMinutes === 1 ? 'phút' : 'phút'
			return `${diffMinutes} ${minutes} trước`
		} else if (diffHours < 24) {
			const hours = diffHours === 1 ? 'giờ' : 'giờ'
			return `${diffHours} ${hours} trước`
		} else if (diffDays < 7) {
			const days = diffDays === 1 ? 'ngày' : 'ngày'
			return `${diffDays} ${days} trước`
		} else if (diffWeeks < 4) {
			const weeks = diffWeeks === 1 ? 'tuần' : 'tuần'
			return `${diffWeeks} ${weeks} trước`
		} else if (diffMonths < 12) {
			const months = diffMonths === 1 ? 'tháng' : 'tháng'
			return `${diffMonths} ${months} trước`
		} else {
			return date.toLocaleDateString('vi-VN', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})
		}
	} catch {
		return dateString
	}
}

export const formatDateTimeVN = (dateString: string) => {
	try {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric'
		})
	} catch {
		return dateString
	}
}

export function getDeviceType() {
	const ua = navigator.userAgent
	if (/mobile/i.test(ua)) return 'mobile'
	if (/tablet/i.test(ua)) return 'tablet'
	return 'desktop'
}

export function getDeviceId() {
	let deviceId = localStorage.getItem('deviceId')
	if (!deviceId) {
		deviceId = uuidv4() // Tạo UUID mới
		localStorage.setItem('deviceId', deviceId)
	}
	return deviceId // Ví dụ: 'abc-123-xyz'
}

export const getInitials = (name: string) => {
	return name
		.split(' ')
		.map(word => word.charAt(0))
		.join('')
		.toUpperCase()
		.slice(0, 2)
}
