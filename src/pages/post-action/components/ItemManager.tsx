import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import React, { useEffect } from 'react'

import { useItemManager } from '@/hooks/useItemManager'

import ItemDialog from './ItemDialog'
import ItemTable from './ItemTable'

interface ItemManagerProps {
	/** Tên field trong form để lưu newItems */
	newItemsFieldName?: string
	/** Tên field trong form để lưu oldItems */
	oldItemsFieldName?: string
	/** Label hiển thị */
	label?: string
	/** Text mô tả */
	description?: string
	/** Animation delay */
	animationDelay?: number
	/** Có hiển thị button thêm không */
	showAddButton?: boolean
	/** Custom className */
	className?: string
}

const ItemManager: React.FC<ItemManagerProps> = ({
	newItemsFieldName = 'newItems',
	oldItemsFieldName = 'oldItems',
	label = 'Món đồ',
	description = 'Bấm vào dấu "+" để thêm món đồ',
	animationDelay = 0,
	showAddButton = true,
	className = ''
}) => {
	const {
		allItems,
		isDialogOpen,
		handleAddItem,
		handleDeleteItem,
		openDialog,
		closeDialog,
		resetItems
	} = useItemManager({
		newItemsFieldName,
		oldItemsFieldName
	})

	useEffect(() => {
		resetItems()
	}, [])

	return (
		<div className={`space-y-2 ${className}`}>
			<div className='flex items-center justify-between'>
				<label className='text-foreground block text-sm font-medium'>
					{label}
				</label>
				{showAddButton && (
					<button
						type='button'
						onClick={openDialog}
						className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-1 transition-colors duration-200'
					>
						<Plus />
					</button>
				)}
			</div>

			<AnimatePresence>
				{allItems.length > 0 && (
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -20 }}
						transition={{ duration: 0.3, delay: animationDelay }}
					>
						<ItemTable
							allItems={allItems}
							onDelete={handleDeleteItem}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				transition={{ duration: 0.3, delay: animationDelay + 0.1 }}
				className='text-muted-foreground mt-1 text-sm'
			>
				{description}
			</motion.p>

			<ItemDialog
				isOpen={isDialogOpen}
				onClose={closeDialog}
				onAdd={handleAddItem}
				existingItems={allItems}
			/>
		</div>
	)
}

export default ItemManager
