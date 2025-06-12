import { Check, CheckCircle, Clock, XCircleIcon } from 'lucide-react'

import { EPostType, ETransactionStatus } from './enums'

export const getTypeInfo = (type: EPostType) => {
	switch (type) {
		case '1':
			return {
				label: 'Cho tặng đồ cũ',
				color:
					'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
				icon: '🎁'
			}
		case '2':
			return {
				label: 'Tìm thấy đồ',
				color:
					'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
				icon: '🔍'
			}
		case '3':
			return {
				label: 'Tìm đồ bị mất',
				color:
					'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
				icon: '❓'
			}
		case '4':
			return {
				label: 'Khác',
				color:
					'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
				icon: '📝'
			}
		default:
			return {
				label: 'Khác',
				color:
					'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
				icon: '📝'
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
			icon: React.ComponentType<{ className?: string }>
			background: string
			border: string
			textColor: string
		}
	> = {
		[ETransactionStatus.DEFAULT]: {
			label: 'Xác nhận',
			icon: Check,
			background: 'bg-chart-1/90 hover:bg-chart-1',
			textColor: 'text-white',
			border: ''
		},
		[ETransactionStatus.PENDING]: {
			label: 'Đang trong giao dịch',
			icon: Clock,
			background: 'bg-chart-2/90 hover:bg-chart-2',
			textColor: 'text-white',
			border: 'border-chart-2 border-solid border-2'
		},
		[ETransactionStatus.SUCCESS]: {
			label: 'Hoàn tất',
			icon: CheckCircle,
			background: 'bg-chart-1/90 hover:bg-chart-1',
			textColor: 'text-white',
			border: 'border-chart-1 border-solid border-2'
		},
		[ETransactionStatus.CANCELLED]: {
			label: isAuthor ? 'Đã từ chối' : 'Đã bị từ chối',
			icon: XCircleIcon,
			background: 'bg-chart-3/90 hover:bg-chart-3',
			textColor: 'text-white',
			border: 'border-chart-3 border-solid border-2'
		}
	}
	return configs[status]
}
