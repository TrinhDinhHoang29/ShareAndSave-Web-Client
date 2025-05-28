import { LucideIcon } from 'lucide-react'

import { Appointment, ItemInfo, PersonalInfo } from './types'

export interface ISendItemFormData {
	personalInfo: PersonalInfo
	itemInfo: ItemInfo
	appointment: Appointment
}

export interface IStep {
	title: string
	icon: LucideIcon
}

export interface IApiResponse<T> {
	data: T
	code: number
	message: string
}

export interface IApiErrorResponse {
	code: number
	message: string
	error: string
}

export interface IRequestSendItemRequest {
	fullName: string
	email: string
	phoneNumber: string
	description: string
	appointmentTime: string
	appointmentLocation: string
	isAnonymous: boolean
}
