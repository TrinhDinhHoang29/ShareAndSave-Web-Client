import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import React from 'react'

import Loading from '@/components/common/Loading'

interface SelectionSummaryProps {
	selectedCount: number
	onAddToWarehouse: () => void
	isVisible: boolean
	isLoading?: boolean
}

const SelectionSummary: React.FC<SelectionSummaryProps> = ({
	selectedCount,
	onAddToWarehouse,
	isVisible,
	isLoading = false
}) => {
	if (!isVisible || selectedCount === 0) return null

	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 50 }}
			className='bg-primary text-primary-foreground fixed right-6 bottom-6 z-40 rounded-lg p-4 shadow-lg'
		>
			<div className='flex items-center gap-4'>
				<span className='font-medium'>Đã chọn: {selectedCount} món đồ</span>
				<button
					onClick={onAddToWarehouse}
					disabled={isLoading}
					className='text-primary flex items-center gap-2 rounded-lg bg-white px-4 py-2 font-medium transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50'
				>
					{isLoading ? (
						<>
							<Loading size='sm' />
							Đang thêm...
						</>
					) : (
						<>
							<Package className='h-4 w-4' />
							Thêm vào kho của tôi
						</>
					)}
				</button>
			</div>
		</motion.div>
	)
}

export default SelectionSummary
