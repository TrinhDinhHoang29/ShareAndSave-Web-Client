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
