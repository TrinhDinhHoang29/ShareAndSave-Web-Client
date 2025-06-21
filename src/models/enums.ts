export enum ERequestStatus {
	ALL = '', // Filter option for "Tất cả trạng thái"
	PENDING = 'pending',
	APPROVE = 'approve',
	REJECT = 'reject',
	WAITING_USER = 'waiting_user',
	FAIL = 'fail'
}

export enum ERequestType {
	ALL = '',
	SEND_OLD = 'send_old',
	RECEIVE_OLD = 'receive_old',
	RECEIVE_LOSE = 'receive_lose',
	SEND_LOSE = 'send_lose'
}

export enum EPostType {
	GIVE_AWAY_OLD_ITEM = '1',
	FOUND_ITEM = '2',
	SEEK_LOSE_ITEM = '3',
	OTHER = '4'
}

export enum EPostSTatus {
	PENDING = '1',
	REJECTED = '2',
	APPROVED = '3'
}

export enum ESortOrder {
	ASC = 'ASC',
	DESC = 'DESC'
}

export enum EInterestType {
	INTERESTED = 1,
	FOLLWED_BY = 2
}

export enum ETransactionStatus {
	DEFAULT = '0',
	PENDING = '1',
	SUCCESS = '2',
	CANCELLED = '3',
	REJECTED = '4'
}

export enum EMessageStatus {
	SENDING = 'sending',
	SENT = 'sent',
	ERROR = 'error',
	RECEIVED = 'received'
}

export enum ETypeNotification {
	FOLLOWED_BY = 'followedBy',
	FOLLOWING = 'following'
}

export enum EMethod {
	IN_PERSON = 'Gặp trực tiếp',
	SHIP = 'Giao hàng'
}
