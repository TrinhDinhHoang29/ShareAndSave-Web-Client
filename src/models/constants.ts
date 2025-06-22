import {
	Check,
	CheckCircle,
	Clock,
	FileText,
	Gift,
	HelpCircle,
	Lock,
	Search,
	ShieldX,
	XCircle
} from 'lucide-react'

import { EPostSTatus, EPostType, ETransactionStatus } from './enums'

export const getTypeInfo = (type: EPostType) => {
	switch (type) {
		case EPostType.GIVE_AWAY_OLD_ITEM:
			return {
				label: 'Cho tặng đồ cũ',
				color:
					'bg-post-type-1 text-post-type-foreground-1 dark:bg-post-type-1/20 dark:text-post-type-foreground-1',
				Icon: Gift
			}
		case EPostType.FOUND_ITEM:
			return {
				label: 'Tìm thấy đồ',
				color:
					'bg-post-type-2 text-post-type-foreground-2 dark:bg-post-type-2/20 dark:text-post-type-foreground-2',
				Icon: Search
			}
		case EPostType.SEEK_LOSE_ITEM:
			return {
				label: 'Tìm đồ bị mất',
				color:
					'bg-post-type-3 text-post-type-foreground-3 dark:bg-post-type-3/20 dark:text-post-type-foreground-3',
				Icon: HelpCircle
			}
		case EPostType.OTHER:
			return {
				label: 'Khác',
				color:
					'bg-post-type-4 text-post-type-foreground-4 dark:bg-post-type-4/20 dark:text-post-type-foreground-4',
				Icon: FileText
			}
		default:
			return {
				label: 'Khác',
				color:
					'bg-post-type-4 text-post-type-foreground-4 dark:bg-post-type-4/20 dark:text-post-type-foreground-4',
				Icon: FileText
			}
	}
}

export const getStatusConfig = (status: number) => {
	switch (status.toString()) {
		case EPostSTatus.PENDING:
			return {
				label: 'Đang chờ duyệt',
				icon: Clock,
				bgColor: 'bg-warning/10',
				textColor: 'text-warning',
				iconColor: 'text-warning/80'
			}
		case EPostSTatus.REJECTED:
			return {
				label: 'Bị từ chối',
				icon: XCircle,
				bgColor: 'bg-error/10',
				textColor: 'text-error',
				iconColor: 'text-error/80'
			}
		case EPostSTatus.APPROVED:
			return {
				label: 'Đã duyệt',
				icon: CheckCircle,
				bgColor: 'bg-success/10 ',
				textColor: 'text-success ',
				iconColor: 'text-success/80'
			}
		case EPostSTatus.SEAL:
			return {
				label: 'Đã khóa',
				icon: Lock,
				bgColor: 'bg-secondary/10',
				textColor: 'text-secondary ',
				iconColor: 'text-secondary/80 '
			}
		default:
			return {
				label: 'Không xác định',
				icon: Clock,
				bgColor: 'bg-secondary/10',
				textColor: 'text-secondary ',
				iconColor: 'text-secondary/80 '
			}
	}
}

export const getTransactionStatusConfig = (
	isAuthor: boolean,
	status: ETransactionStatus
) => {
	const configs: Record<
		ETransactionStatus,
		{
			label: string
			Icon: React.ComponentType<{ className?: string }>
			background: string
			border: string
			textColor: string
		}
	> = {
		[ETransactionStatus.DEFAULT]: {
			label: 'Xác nhận',
			Icon: Check,
			background: 'bg-green-100 hover:bg-green-200',
			textColor: 'text-success',
			border: 'border-success border-solid border-2'
		},
		[ETransactionStatus.PENDING]: {
			label: 'Đang trong giao dịch',
			Icon: Clock,
			background: 'bg-yellow-100 hover:bg-yellow-200',
			textColor: 'text-warning',
			border: 'border-warning border-solid border-2'
		},
		[ETransactionStatus.SUCCESS]: {
			label: 'Hoàn tất',
			Icon: CheckCircle,
			background: 'bg-green-100 hover:bg-green-200',
			textColor: 'text-success',
			border: 'border-success border-solid border-2'
		},
		[ETransactionStatus.CANCELLED]: {
			label: isAuthor ? 'Đã từ chối' : 'Đã bị từ chối',
			Icon: XCircle,
			background: 'bg-red-100 hover:bg-red-200',
			textColor: 'text-error',
			border: 'border-error border-solid border-2'
		},
		[ETransactionStatus.REJECTED]: {
			label: isAuthor ? 'Hủy' : 'Đã hủy',
			Icon: ShieldX,
			background: 'bg-red-100 hover:bg-red-200',
			textColor: 'text-error',
			border: 'border-error border-solid border-2'
		}
	}
	return configs[status]
}

export const LIMIT_MESSAGE = 30
export const SCROLL_THRESHOLD = 100
export const SCROLL_TIMEOUT = 300
export const TIME_GAP_THRESHOLD = 30 * 60 * 1000 // 30 minutes in milliseconds

export const getConfirmContentTransactionStatus = (
	status: ETransactionStatus
) => {
	switch (status) {
		case ETransactionStatus.SUCCESS:
		default:
			return {
				message:
					'Hành động này không thể hoàn tác. Bạn cần cân nhắc trước khi xác nhận.',
				title: 'Xác nhận hoàn tất giao dịch?'
			}
		case ETransactionStatus.CANCELLED:
			return {
				message:
					'Hành động này không thể hoàn tác. Bạn cần cân nhắc trước khi xác nhận.',
				title: 'Xác nhận từ chối giao dịch?'
			}
		case ETransactionStatus.REJECTED:
			return {
				message:
					'Hành động này không thể hoàn tác. Số lượng yêu cầu sẽ được hoàn tác.',
				title: 'Xác nhận hủy giao dịch?'
			}
	}
}
