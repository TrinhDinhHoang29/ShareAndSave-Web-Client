import { type ClassValue, clsx } from 'clsx'
import {
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	differenceInMonths,
	differenceInSeconds,
	differenceInWeeks,
	format,
	isSameWeek,
	isSameYear,
	isToday,
	isValid,
	parseISO
} from 'date-fns'
import { vi } from 'date-fns/locale'
import { twMerge } from 'tailwind-merge'
import { v4 as uuidv4 } from 'uuid'

import { TIME_GAP_THRESHOLD } from '@/models/constants'
import { IGoodDeed, IMessage } from '@/models/interfaces'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formatNearlyDateTimeVN = (dateString: string): string => {
	try {
		const now = new Date()
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return dateString
		}

		const diffSeconds = differenceInSeconds(now, date)
		const diffMinutes = differenceInMinutes(now, date)
		const diffHours = differenceInHours(now, date)
		const diffDays = differenceInDays(now, date)
		const diffWeeks = differenceInWeeks(now, date)
		const diffMonths = differenceInMonths(now, date)

		if (diffSeconds < 60) {
			return `${diffSeconds} giây trước`
		} else if (diffMinutes < 60) {
			return `${diffMinutes} phút trước`
		} else if (diffHours < 24) {
			return `${diffHours} giờ trước`
		} else if (diffDays < 7) {
			return `${diffDays} ngày trước`
		} else if (diffWeeks < 4) {
			return `${diffWeeks} tuần trước`
		} else if (diffMonths < 12) {
			return `${diffMonths} tháng trước`
		} else {
			return format(date, 'd MMMM yyyy', { locale: vi })
		}
	} catch {
		return dateString
	}
}

export const formatDateTimeVN = (
	dateString: string,
	isShowTime = true
): string => {
	try {
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return dateString
		}

		if (isShowTime) {
			return format(date, 'EEEE, dd MMMM yyyy, HH:mm', { locale: vi })
		} else {
			return format(date, 'dd MMMM yyyy', { locale: vi })
		}
	} catch {
		return dateString
	}
}

export const formatDate = (dateString: string): string => {
	try {
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return dateString
		}

		return format(date, 'dd/MM/yyyy, HH:mm', { locale: vi })
	} catch {
		return dateString
	}
}

// Format date time - returns separate date and time
export const formatDateTime = (dateString: string) => {
	try {
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return {
				date: dateString,
				time: ''
			}
		}

		return {
			date: format(date, 'dd/MM/yyyy', { locale: vi }),
			time: format(date, 'HH:mm', { locale: vi })
		}
	} catch {
		return {
			date: dateString,
			time: ''
		}
	}
}

export const formatHoverTime = (dateString: string): string => {
	try {
		const now = new Date()
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return dateString
		}

		// Same day: show hour:minute (e.g., 14:30)
		if (isToday(date)) {
			return format(date, 'HH:mm', { locale: vi })
		}
		// Same week: show day of week and time (e.g., Thứ Hai, 14:30)
		else if (isSameWeek(date, now, { weekStartsOn: 1 })) {
			return format(date, 'EEEE, HH:mm', { locale: vi })
		}
		// Same year: show day, month, and time (e.g., 15/06, 14:30)
		else if (isSameYear(date, now)) {
			return format(date, 'dd/MM, HH:mm', { locale: vi })
		}
		// Older: show full date (e.g., 15/06/2024)
		else {
			return format(date, 'dd/MM/yyyy', { locale: vi })
		}
	} catch {
		return dateString
	}
}

// Additional utility functions for better date handling

export const formatRelativeTime = (dateString: string): string => {
	try {
		const now = new Date()
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return dateString
		}

		const diffSeconds = differenceInSeconds(now, date)

		// Handle future dates
		if (diffSeconds < 0) {
			const absDiffSeconds = Math.abs(diffSeconds)
			const absDiffMinutes = differenceInMinutes(date, now)
			const absDiffHours = differenceInHours(date, now)
			const absDiffDays = differenceInDays(date, now)

			if (absDiffSeconds < 60) {
				return `sau ${absDiffSeconds} giây`
			} else if (absDiffMinutes < 60) {
				return `sau ${absDiffMinutes} phút`
			} else if (absDiffHours < 24) {
				return `sau ${absDiffHours} giờ`
			} else {
				return `sau ${absDiffDays} ngày`
			}
		}

		return formatNearlyDateTimeVN(dateString)
	} catch {
		return dateString
	}
}

export const formatShortDate = (dateString: string): string => {
	try {
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return dateString
		}

		return format(date, 'dd/MM/yy', { locale: vi })
	} catch {
		return dateString
	}
}

export const formatLongDate = (dateString: string): string => {
	try {
		const date = parseISO(dateString)

		if (!isValid(date)) {
			return dateString
		}

		return format(date, 'EEEE, dd MMMM yyyy', { locale: vi })
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

export const getTotalGoodDeeds = (goodDeeds: IGoodDeed[]) => {
	return goodDeeds.reduce((total, deed) => total + deed.goodDeedCount, 0)
}

// Hàm chuyển file ảnh thành base64
export const imageToBase64 = (file: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			resolve(reader.result as string)
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

// Hàm resize và nén ảnh base64
export const processImageBase64 = (
	inputBase64: string,
	width: number,
	height: number,
	quality: number = 80
): Promise<string> => {
	return new Promise((resolve, reject) => {
		// Nếu đã resize thì bỏ qua
		if (inputBase64.includes(';resized;')) {
			resolve(inputBase64)
			return
		}

		// Tách prefix và kiểm tra định dạng
		const commaIndex = inputBase64.indexOf(',')
		if (commaIndex === -1) {
			reject(new Error('Invalid base64 image data'))
			return
		}

		const prefix = inputBase64.substring(0, commaIndex + 1)

		let mimeType = ''
		if (prefix.includes('image/jpeg') || prefix.includes('image/jpg')) {
			mimeType = 'jpeg'
		} else if (prefix.includes('image/png')) {
			mimeType = 'png'
		} else {
			reject(new Error('Unsupported image format'))
			return
		}

		// Tạo image element để load ảnh
		const img = new Image()
		img.onload = () => {
			try {
				// Tạo canvas để resize
				const canvas = document.createElement('canvas')
				const ctx = canvas.getContext('2d')

				if (!ctx) {
					reject(new Error('Cannot get canvas context'))
					return
				}

				// Tính toán kích thước mới (giữ tỷ lệ nếu chỉ có width hoặc height)
				let newWidth = width
				let newHeight = height

				if (width === 0 && height > 0) {
					newWidth = (img.width * height) / img.height
				} else if (height === 0 && width > 0) {
					newHeight = (img.height * width) / img.width
				} else if (width === 0 && height === 0) {
					newWidth = img.width
					newHeight = img.height
				}

				canvas.width = newWidth
				canvas.height = newHeight

				// Enable high quality resizing
				ctx.imageSmoothingEnabled = true
				ctx.imageSmoothingQuality = 'high'

				// Vẽ ảnh lên canvas với kích thước mới
				ctx.drawImage(img, 0, 0, newWidth, newHeight)

				// Convert canvas về base64
				let outputMimeType = 'image/jpeg'
				if (mimeType === 'png') {
					outputMimeType = 'image/png'
				}

				const resizedBase64 = canvas.toDataURL(outputMimeType, quality / 100)

				// Thêm dấu hiệu đã resize vào prefix
				const newPrefix = prefix.replace('base64,', 'resized;base64,')
				const finalResult = newPrefix + resizedBase64.split(',')[1]

				resolve(finalResult)
			} catch (error) {
				reject(error)
			}
		}

		img.onerror = () => {
			reject(new Error('Failed to load image'))
		}

		img.src = inputBase64
	})
}

// Hàm xử lý mảng ảnh
export const processImagesArray = async (
	images: string[],
	width: number = 800,
	height: number = 600,
	quality: number = 80
): Promise<string[]> => {
	const processedImages: string[] = []

	for (const image of images) {
		try {
			const processed = await processImageBase64(image, width, height, quality)
			processedImages.push(processed)
		} catch (error) {
			console.error('Error processing image:', error)
			// Giữ nguyên ảnh gốc nếu không thể xử lý
			processedImages.push(image)
		}
	}

	return processedImages
}

// Hàm xử lý ảnh cho items (newItems và oldItems)
export const processItemImages = async (
	items: any[],
	imageField: string = 'image',
	width: number = 400,
	height: number = 400,
	quality: number = 85
): Promise<any[]> => {
	const processedItems = []

	for (const item of items) {
		if (item[imageField]) {
			try {
				const processedImage = await processImageBase64(
					item[imageField],
					width,
					height,
					quality
				)
				processedItems.push({
					...item,
					[imageField]: processedImage
				})
			} catch (error) {
				console.error('Error processing item image:', error)
				// Giữ nguyên item gốc nếu không thể xử lý ảnh
				processedItems.push(item)
			}
		} else {
			processedItems.push(item)
		}
	}

	return processedItems
}
