import clsx from 'clsx'
import { motion } from 'framer-motion'
import { Box, Check, File, Minus, Plus } from 'lucide-react'
import React, { useState } from 'react'

import { IItemWarehouse } from '@/models/interfaces'

interface ItemWarehouseCardProps {
	item: IItemWarehouse
	onSelect?: (itemId: number, quantity: number) => void
	onDeselect?: (itemId: number) => void
	selectedQuantity?: number
	isSelected?: boolean
	className?: string
	selectionMode?: boolean
}

const ItemWarehouseCard: React.FC<ItemWarehouseCardProps> = ({
	item,
	onSelect,
	onDeselect,
	selectedQuantity = 0,
	isSelected = false,
	className,
	selectionMode = false
}) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [imageError, setImageError] = useState(false)
	const [localQuantity, setLocalQuantity] = useState(selectedQuantity || 1)

	const handleToggleDescription = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsExpanded(!isExpanded)
	}

	const handleCardClick = () => {
		if (!selectionMode || item.meQuantity) return

		if (isSelected) {
			onDeselect?.(item.itemID)
		} else {
			onSelect?.(item.itemID, localQuantity)
		}
	}

	const handleQuantityChange = (newQuantity: number, e: React.MouseEvent) => {
		e.stopPropagation()
		if (newQuantity < 1 || newQuantity > item.quantity) return

		setLocalQuantity(newQuantity)
		if (isSelected) {
			onSelect?.(item.itemID, newQuantity)
		}
	}

	const truncateText = (text: string, maxLength: number = 100) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: selectionMode ? -2 : -4, transition: { duration: 0.2 } }}
			className={clsx(
				'bg-card group relative overflow-hidden rounded-lg border shadow-sm transition-all duration-300',
				selectionMode && 'cursor-pointer hover:shadow-md',
				isSelected && 'ring-primary border-primary ring-2',
				selectionMode && item.meQuantity ? 'border-error/80' : 'border-border',
				className
			)}
			onClick={handleCardClick}
		>
			{/* Selection Indicator */}
			{selectionMode && !item.meQuantity && (
				<div className='absolute top-3 left-3 z-20'>
					<div
						className={clsx(
							'flex h-6 w-6 items-center justify-center rounded-full border-2 shadow-sm transition-all duration-200',
							isSelected
								? 'bg-primary border-primary text-primary-foreground shadow-primary/25'
								: 'bg-card border-muted-foreground/30 group-hover:border-primary group-hover:bg-primary/10'
						)}
					>
						{isSelected && <Check className='h-3 w-3 stroke-[3]' />}
					</div>
				</div>
			)}

			{/* Image Section */}
			<div className='bg-muted relative h-48 overflow-hidden'>
				{!imageError ? (
					<img
						src={item.itemImage}
						alt={item.itemName}
						className='bg-muted h-full w-full object-contain transition-transform duration-300 group-hover:scale-105'
						onError={() => setImageError(true)}
					/>
				) : (
					<div className='bg-muted flex h-full w-full items-center justify-center'>
						<div className='text-muted-foreground text-center'>
							<div className='bg-border mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-lg'>
								<svg
									className='h-8 w-8'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1.5}
										d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
									/>
								</svg>
							</div>
							<p className='text-sm'>Không có hình ảnh</p>
						</div>
					</div>
				)}

				{item.meQuantity && (
					<div className='absolute top-3 left-3 z-10'>
						<span className='bg-error/80 text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
							Đã gửi yêu cầu
						</span>
					</div>
				)}
				{/* Category Badge */}
				<div className='absolute top-3 right-3 z-10'>
					<span className='bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
						{item.categoryName}
					</span>
				</div>

				{/* Available Quantity Badge */}
				<div className='absolute right-3 bottom-3 z-10'>
					<span className='bg-card/90 text-card-foreground border-border rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm'>
						Còn: {item.quantity}
					</span>
				</div>
			</div>

			{/* Content Section */}
			<div className='space-y-3 p-4'>
				{/* Item Name */}
				<h3 className='text-card-foreground group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors'>
					{item.itemName}
				</h3>

				{/* Stats */}
				<div className='text-muted-foreground flex items-center justify-between text-sm'>
					<div className='flex items-center gap-1'>
						<File className='h-4 w-4' />
						<span>{item.claimItemRequests} yêu cầu</span>
					</div>
					{item.meQuantity && (
						<div className='flex items-center gap-1'>
							<span>Bạn đã yêu cầu: {item.meQuantity}</span>
							<Box className='h-4 w-4' />
						</div>
					)}
				</div>

				{/* Quantity Selector - Only show when selected and in selection mode */}
				{selectionMode && isSelected && (
					<div className='bg-muted flex items-center justify-between rounded-lg p-2'>
						<span className='text-sm font-medium'>Số lượng:</span>
						<div className='flex items-center gap-2'>
							<button
								onClick={e => handleQuantityChange(localQuantity - 1, e)}
								disabled={localQuantity <= 1}
								className='bg-background border-border hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50'
							>
								<Minus className='h-4 w-4' />
							</button>
							<span className='w-8 text-center font-medium'>
								{localQuantity}
							</span>
							<button
								onClick={e => handleQuantityChange(localQuantity + 1, e)}
								disabled={localQuantity >= item.quantity}
								className='bg-background border-border hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-50'
							>
								<Plus className='h-4 w-4' />
							</button>
						</div>
					</div>
				)}

				{/* Description */}
				<div className='space-y-2'>
					<motion.p
						className={`text-muted-foreground text-sm leading-relaxed ${
							!isExpanded ? 'line-clamp-2' : ''
						}`}
						initial={false}
						animate={{ height: 'auto' }}
					>
						{isExpanded
							? item.description
							: truncateText(item.description || '')}
					</motion.p>

					{item.description && item.description.length > 100 && (
						<button
							onClick={handleToggleDescription}
							className='text-primary hover:text-primary/80 text-xs font-medium transition-colors'
						>
							{isExpanded ? 'Thu gọn' : 'Xem thêm'}
						</button>
					)}
				</div>
			</div>
		</motion.div>
	)
}

export default ItemWarehouseCard
