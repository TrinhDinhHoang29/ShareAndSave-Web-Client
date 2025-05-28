import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'UTC'
	}
	return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}

export function formatDateToISO(date: Date | string): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'UTC'
	}
	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
		new Date(date)
	)
	return formattedDate.replace(
		/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/,
		'$3-$1-$2T$4:$5:00Z'
	)
}

export function formatDateToISOWithTimeZone(
	date: Date | string,
	timeZone: string
): string {
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone
	}
	const formattedDate = new Intl.DateTimeFormat('en-US', options).format(
		new Date(date)
	)
	return formattedDate.replace(
		/(\d{2})\/(\d{2})\/(\d{4}), (\d{2}):(\d{2})/,
		'$3-$1-$2T$4:$5:00Z'
	)
}
