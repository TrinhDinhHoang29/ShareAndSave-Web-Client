import { LucideIcon } from 'lucide-react'

import {
	EAppointmentStatus,
	EDateRangeStatus,
	EGoodDeedType,
	EMessageStatus,
	ENotiTargetType,
	ENotiType,
	EPostSTatus,
	EPostType,
	ERequestStatus,
	ERequestType,
	ESettingKey,
	ESortOrder,
	ETransactionStatus
} from './enums'
import { PersonalInfo, PostInfo, PostType } from './types'

export interface IListPostParams {
	page?: number
	limit?: number
	search?: string
	type?: EPostType
	status?: EPostSTatus
	sort?: string
	order?: ESortOrder
}

export interface IPostActionInfoFormData {
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

export interface IItemSuggestion {
	id: number
	categoryID: number
	name: string
	description: string
	image: string
}

export interface IItem {
	id: number
	categoryID: number
	name: string
	description: string
	image: string
	alternativeImage: string
	itemID?: number
	categoryName?: string
	quantity?: number
	currentQuantity?: number
}

export interface INewItem {
	name: string
	quantity: number
	categoryID?: number | undefined
	categoryName?: string
	id?: string
	image?: string
	itemID?: number | undefined
	alternativeImage?: string
}

export interface IOldItem {
	itemID?: number | undefined
	quantity: number
	categoryID?: number | undefined
	categoryName?: string
	id?: string
	name?: string
	image?: string
	alternativeImage?: string
}

export interface IPostActionRequest {
	description: string
	fullName?: string
	email?: string
	phoneNumber?: string
	author_id?: number
	info: string
	type: number
	images: string[]
	title: string
	newItems?: INewItem[]
	oldItems?: IOldItem[]
}

export interface IPostAction {
	authorName: string
	content: string
	id: number
	slug: string
	status: number // Consider defining an enum for status values
	title: string
	type: number // Consider defining an enum for type values
}

export interface IUser {
	address?: string
	avatar?: string
	email?: string
	fullName: string
	goodPoint?: number
	id?: number
	major?: string
	phoneNumber?: string
	roleID?: number // Consider defining an enum for roleID values
	roleName?: string
	status?: number // Consider defining an enum for status values
}

export interface IPostActionResponse {
	JWT: string
	post: IPostAction
	user: IUser
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

export interface ICategory {
	id: number
	name: string
}

export interface Interest {
	id: number
	name: string
	date: string
	status: 'active' | 'completed'
}

export interface IUserInterest {
	id: number
	postID: number
	status: number
	userAvatar: string
	userID: number
	userName: string
	createdAt: string
	updatedAt: string
	unreadMessageCount?: number
	messageFromID?: number
	newMessage?: string
	newMessageIsRead?: number
	transactionStatus?: ETransactionStatus
	method?: string
}

export interface IPostInterest {
	id: number
	title: string
	authorID: number
	authorName: string
	authorAvatar: string
	description: string
	slug: string
	type: EPostType
	updatedAt: string
	createdAt: string
	interests: IUserInterest[]
	items: IItem[]
	unreadMessageCount: number
}

export interface ILoginRequest {
	device: 'web' | 'mobile'
	email: string
	password: string
}

export interface ILoginResponse {
	jwt: string
	refreshToken: string
	user: IUser
}

export interface IPost {
	authorID: number
	authorName: string
	content: string
	createdAt: string
	description: string
	id: number
	images: string[]
	info: string
	interestCount: number
	itemCount: number
	slug: string
	status: number
	tags: string[]
	title: string
	type: number
	currentItemCount: number
	authorAvatar?: string
}

export interface IPostResponse {
	posts: IPost[]
	totalPage: number
}

export interface IPostDetail {
	authorID: number
	authorName: string
	content: string
	createdAt: string
	description: string
	id: number
	images: string[]
	info: string
	interests: IUserInterest[]
	items: IItem[]
	slug: string
	status: number
	tags: string[]
	title: string
	type: number
}

export interface IListTypeParams<T> {
	page?: number
	limit?: number
	sort?: string
	order?: ESortOrder
	type?: T
	search?: string
	status?: number
}

export interface IPostInterestResponse {
	interests: IPostInterest[]
	totalPage: number
	unreadMessageCount: number
}

export interface IReceiver {
	id: number
	name: string
	avatar: string
}

export interface ITransactionItem {
	itemID: number
	itemName: string
	itemImage: string
	postItemID: number
	quantity: number
	currentQuantity: number
}

export interface ITransactionParams {
	postID: number
	searchBy: 'interestID'
	searchValue: string
	sort?: 'createdAt'
	order?: ESortOrder
	limit?: number
	page?: number
}

export interface ITransaction {
	id: number
	interestID: number
	senderID: number
	receiverID: number
	senderName: string
	receiverName: string
	status: ETransactionStatus
	items: ITransactionItem[]
	createdAt: string
	updatedAt: string
	method?: string
}

export interface ITransactionRequest {
	interestID?: number
	items?: {
		postItemID: number
		quantity: number
	}[]
	method?: string
	status?: number
}

export interface IMajor {
	id: number
	name: string
}

export interface ITransactionResponse {
	transactions: ITransaction[]
	totalPage: number
}

export interface IIdChatInfoParams {
	interestID: string
	postID: number
}

export interface IMessage {
	id: number
	receiver: string
	message: string
	time: string
	status: EMessageStatus
	retry?: () => void
}

export interface IMessageResponse {
	createdAt: string
	id: number
	interestID: number
	isRead: number
	message: string
	receiverID: number
	senderID: number
}

export interface IListMessageParams {
	interestID: number
	page?: number
	limit?: number
	search?: string
}

export interface ISocketMessageResponse {
	senderID: number
	message: string
	timestamp: string
}

export interface IChatMessagesPanel {
	socket: WebSocket | null
	socketInfo: {
		isOwner: boolean
		interestID: number
		userID: number
		senderID: number
	}
	socketMessageResponse: {
		data?: ISocketMessageResponse
		status: 'success' | 'error'
	}
	connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'reconnecting'
	onReconnect: () => void
}

export interface IOption {
	value: string | number
	label: string
}

export interface IItemWarehouse {
	categoryName: string
	claimItemRequests?: number
	description?: string
	itemID: number
	itemImage: string
	itemName: string
	quantity: number
	currentQuantity?: number
	meQuantity?: number
	maxClaim: number
}

export interface IItemWarehouseParams {
	sort?: 'quantity'
	order?: ESortOrder
	limit?: number
	page?: number
	categoryID?: number
	search?: string
}

export interface IItemWarehouseResponse {
	itemOldStocks: IItemWarehouse[]
	totalPage: number
}

export interface ICampaign {
	id: number
	title: string
	description: string
	image: string
	startDate: string
	endDate: string
	location: string
	organizer: string
	targetItems: number
	collectedItems: number
	participants: number
	status: 'active' | 'upcoming' | 'completed'
	categories: string[]
}

export interface IMyPostRequest {
	description?: string
	images?: string
	isRepost?: boolean
	status?: number
	title?: string
}

export interface IItemWarehouseRequest {
	itemID: number
	quantity?: number
	newQuantity?: number
}

export interface IItemRequest {
	itemID: number
	name: string
	categoryID: number
	categoryName: string
	quantity: number
	image?: string
	alternativeImage?: string
}

export interface IAppointmentItem {
	id: number
	appointmentID: number
	itemID: number
	itemName: string
	itemImage: string
	categoryName: string
	actualQuantity: number
	missingQuantity: number
}

export interface IAppointment {
	id: number
	userID: number
	userName: string
	startTime: string
	endTime: string
	status: number
	appointmentItems: IAppointmentItem[]
}

export interface IAppointmentResponse {
	appointments: IAppointment[]
	totalPage: number
}

export interface IAppointmentRequest {
	endTime?: string
	startTime?: string
	status: EAppointmentStatus
}

export interface ICaoThangLink {
	title: string
	description: string
	url: string
	Icon: LucideIcon
	imageUrl: string
}

export interface IGoodDeed {
	goodDeedCount: number
	goodDeedType: number
}

export interface IUserRank {
	goodDeeds: IGoodDeed[]
	goodPoint: number
	major: string
	userAvatar: string
	userID: number
	userName: string
}

export interface IItemGoodDeed {
	itemID: number
	itemImage: string
	itemName: string
	postItemID: number
	quantity: number
}

export interface IDetailGoodDeed {
	createdAt: string
	goodDeedType: EGoodDeedType
	goodPoint: number
	id: number
	items: IItemGoodDeed[]
	transactionID: number
	userID: number
	userName: string
}

export interface IUserRankResponse {
	userRanks: IUserRank[]
	totalPage: number
	yourInfo: IUserRank
	yourRank: number
}

export interface ISetting {
	id: number
	key: ESettingKey
	value: string
}

export interface ISettingResponse {
	name: string
	setting: ISetting
}

export interface IVerifySignupError {
	field: string
	message: string
}

// Interface cho kết quả trả về
export interface IDateRangeResult {
	isInRange: boolean
	status: EDateRangeStatus
	message: string
	currentTime: Date
	startTime: Date
	endTime: Date
	timeUntilStart?: number // milliseconds
	timeUntilEnd?: number // milliseconds
}

export interface INoti {
	id: number
	senderID: number
	receiverID: number
	type: ENotiType
	targetType: ENotiTargetType
	targetID: number
	content: string
	isRead: boolean
	createdAt: string
	senderName: string
	receiverName: string
}

export interface INotiResponse {
	totalPage: number
	unreadCount: number
	notifications: INoti[]
}
