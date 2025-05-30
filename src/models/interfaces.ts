import { LucideIcon } from 'lucide-react'

import { ERequestStatus, ERequestType } from './enums'
import { PersonalInfo, PostInfo, PostType } from './types'

export interface IPostInfoFormData {
	personalInfo: PersonalInfo
	postInfo: PostInfo
	postType: PostType
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

export interface IPostRequest {
	fullName: string
	email: string
	phoneNumber: string
	description: string
	images: string[]
	type: string
	lostDate?: string
	lostLocation?: string
	foundLocation?: string
	foundDate?: string
	category?: string
	condition?: string
	reward?: string
	title: string
}

export interface IRequest {
	id: number
	type: ERequestType
	item: string
	status: ERequestStatus
	date: string
	location: string
	description?: string
	imageUrl?: string
}

export interface IRequestResponse {
	data: IRequest[]
	totalPages: number
}

export interface IPagination {
	currentPage: number
	totalPages: number
	totalItems: number
	itemsPerPage: number
	onPageChange: (page: number) => void
}
