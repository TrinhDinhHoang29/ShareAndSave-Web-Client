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
	SEND_OLD = '0',
	SEND_LOST = '1',
	FIND = '2',
	FREE = '3'
}
