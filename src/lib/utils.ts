import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

import { TIME_GAP_THRESHOLD } from '@/models/constants'
import { IMessage } from '@/models/interfaces'

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

export const formatDateTimeVN = (dateString: string, isShowTime = true) => {
	try {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			weekday: isShowTime ? 'long' : undefined,
			year: 'numeric',
			month: 'long',
			day: '2-digit',
			hour: isShowTime ? 'numeric' : undefined,
			minute: isShowTime ? 'numeric' : undefined
		})
	} catch {
		return dateString
	}
}

export const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString('vi-VN', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	})
}

export const formatHoverTime = (dateString: string): string => {
	try {
		const now = new Date()
		const date = new Date(dateString)
		const diffMs = now.getTime() - date.getTime()
		const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

		// Same day: show hour:minute (e.g., 14:30)
		if (diffHours < 24 && diffDays === 0) {
			return date.toLocaleTimeString('vi-VN', {
				hour: '2-digit',
				minute: '2-digit'
			})
		}
		// Same week: show day of week and time (e.g., Thứ Hai, 14:30)
		else if (diffDays < 7) {
			return date.toLocaleString('vi-VN', {
				weekday: 'long',
				hour: '2-digit',
				minute: '2-digit'
			})
		}
		// Same year: show day, month, and time (e.g., 15/06, 14:30)
		else if (date.getFullYear() === now.getFullYear()) {
			return date.toLocaleString('vi-VN', {
				day: '2-digit',
				month: '2-digit',
				hour: '2-digit',
				minute: '2-digit'
			})
		}
		// Older: show full date (e.g., 15/06/2024)
		else {
			return date.toLocaleDateString('vi-VN', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
		}
	} catch {
		return dateString
	}
}

export const isOneMinuteDifference = (backendTime: string): boolean => {
	try {
		const givenTime = new Date(backendTime)
		const currentTime = new Date()

		// Kiểm tra xem thời gian backend có hợp lệ không
		if (isNaN(givenTime.getTime())) {
			return false
		}

		// Tính chênh lệch thời gian (theo giây)
		const diffInSeconds = Math.abs(
			(currentTime.getTime() - givenTime.getTime()) / 1000
		)

		// Kiểm tra xem chênh lệch có đúng 60 giây không
		return diffInSeconds > 60
	} catch (error) {
		return false
	}
}

export const shouldShowTimestamp = (
	currentMessage: IMessage,
	previousMessage?: IMessage
): boolean => {
	if (!previousMessage) return true // Always show timestamp for first message

	const currentTime = new Date(currentMessage.time).getTime()
	const previousTime = new Date(previousMessage.time).getTime()
	const timeDiff = Math.abs(currentTime - previousTime)

	return timeDiff >= TIME_GAP_THRESHOLD
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

export function generateRandomId(min = 100000, max = 999999) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}
