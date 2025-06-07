import { EPostType } from './enums'

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
