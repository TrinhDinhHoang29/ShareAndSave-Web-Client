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
	ALL = '0',
	GIVE_AWAY_OLD_ITEM = '1',
	FOUND_ITEM = '2',
	SEEK_LOSE_ITEM = '3',
	WANT_OLD_ITEM = '4',
	CAMPAIGN = '5',
	OTHER = '6'
}

export enum EPostSTatus {
	PENDING = '1',
	REJECTED = '2',
	APPROVED = '3',
	SEAL = '4'
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

export enum EAppointmentStatus {
	APPROVED = 1,
	REJECTED = 2
}

export enum EGoodDeedType {
	GOOD_DEED_TYPE_GIVE_OLD_ITEM = 1,
	GOOD_DEED_TYPE_GIVE_LOSE_ITEM = 2,
	GOOD_DEED_TYPE_CAMPAGIN = 3
}

export enum EGoodPOINTTYPE {
	GOOD_POINT_GIVE_OLD_ITEM = 'goodPointGiveOldItem',
	GOOD_POINT_GIVE_LOSE_ITEM = 'goodPointGiveLoseItem',
	GOOD_POINT_JOIN_CAMPAIGN = 'goodPointJoinCampaign'
}

export enum EPurposeOTP {
	ACTIVE_ACCOUNT = 'activeAccount',
	RESET_PASSWORD = 'resetPassword'
}

export enum ESettingKey {
	NUM_PER_HOUR = 'numPerHour',
	START_MORNING_TIME = 'startMorningTime',
	END_MORNING_TIME = 'endMorningTime',
	START_AFTERNOON_TIME = 'startAfternoonTime',
	END_AFTERNOON_TIME = 'endAfternoonTime',
	DOMAIN = 'domain',
	GOOD_POINT_GIVE_OLD_ITEM = 'goodPointGiveOldItem',
	GOOD_POINT_GIVE_LOSE_ITEM = 'goodPointGiveLoseItem',
	GOOD_POINT_JOIN_CAMPAIGN = 'goodPointJoinCampaign',
	EMAIL = 'email',
	PHONE_NUMBER = 'phoneNumber',
	LOCATION = 'location',
	DESCRIPTION = 'description',
	WORK_DAY = 'workDay'
}

// Enum để định nghĩa các trạng thái thời gian
export enum EDateRangeStatus {
	BEFORE_START = 'BEFORE_START',
	IN_RANGE = 'IN_RANGE',
	AFTER_END = 'AFTER_END',
	INVALID_RANGE = 'INVALID_RANGE'
}

export enum ENotiType {
	NORMAL = 'normal',
	SYSTEM = 'system'
}

export enum ENotiTargetType {
	INTEREST = 'interest',
	APPOINTMENT = 'appointment'
}
