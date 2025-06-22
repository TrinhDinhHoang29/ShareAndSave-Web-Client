import clsx from 'clsx'
import { motion } from 'framer-motion'
import React, { useState } from 'react'

import { IItemWarehouse } from '@/models/interfaces'

interface ItemWarehouseCardProps {
	item: IItemWarehouse
	onClick?: (item: IItemWarehouse) => void
	className?: string
}

const ItemWarehouseCard: React.FC<ItemWarehouseCardProps> = ({
	item,
	onClick,
	className
}) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const [imageError, setImageError] = useState(false)

	const handleToggleDescription = (e: React.MouseEvent) => {
		e.stopPropagation()
		setIsExpanded(!isExpanded)
	}

	const handleCardClick = () => {
		onClick?.(item)
	}

	const truncateText = (text: string, maxLength: number = 100) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			whileHover={{ y: -4, transition: { duration: 0.2 } }}
			className={clsx(
				'bg-card border-border group cursor-pointer overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md',
				className
			)}
			onClick={handleCardClick}
		>
			{/* Image Section */}
			<div className='bg-muted relative h-48 overflow-hidden'>
				{!imageError ? (
					<img
						src={item.item_image}
						alt={item.item_name}
						className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
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

				{/* Category Badge */}
				<div className='absolute top-3 left-3'>
					<span className='bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-medium'>
						{item.category_name}
					</span>
				</div>

				{/* Quantity Badge */}
				<div className='absolute top-3 right-3'>
					<span className='bg-card/90 text-card-foreground border-border rounded-full border px-2 py-1 text-xs font-medium backdrop-blur-sm'>
						SL: {item.quantity}
					</span>
				</div>
			</div>

			{/* Content Section */}
			<div className='space-y-3 p-4'>
				{/* Item Name */}
				<h3 className='text-card-foreground group-hover:text-primary line-clamp-2 text-lg font-semibold transition-colors'>
					{item.item_name}
				</h3>

				{/* Stats */}
				<div className='text-muted-foreground flex items-center justify-between text-sm'>
					<div className='flex items-center gap-1'>
						<svg
							className='h-4 w-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={1.5}
								d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
							/>
						</svg>
						<span>{item.claim_item_requests} yêu cầu</span>
					</div>
				</div>

				{/* Description */}
				<div className='space-y-2'>
					<motion.p
						className={`text-muted-foreground text-sm leading-relaxed ${
							!isExpanded ? 'line-clamp-2' : ''
						}`}
						initial={false}
						animate={{ height: 'auto' }}
					>
						{isExpanded ? item.description : truncateText(item.description)}
					</motion.p>

					{item.description.length > 100 && (
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

// // Demo Component
// const IItemWarehouseDemo = () => {
//   const sampleItems: IItemWarehouse[] = [
//     {
//       item_id: 1,
//       item_name: "Laptop Dell Inspiron 15 3000",
//       category_name: "Máy tính",
//       quantity: 5,
//       claim_item_requests: 12,
//       description: "Laptop Dell Inspiron 15 3000 với bộ vi xử lý Intel Core i5, RAM 8GB, ổ cứng SSD 256GB. Máy còn hoạt động tốt, phù hợp cho công việc văn phòng và học tập. Đã qua sử dụng nhưng vẫn trong tình trạng khá tốt.",
//       item_image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop"
//     },
//     {
//       item_id: 2,
//       item_name: "Bàn làm việc gỗ",
//       category_name: "Nội thất",
//       quantity: 3,
//       claim_item_requests: 8,
//       description: "Bàn làm việc bằng gỗ tự nhiên, kích thước 120x60cm, có ngăn kéo tiện lợi.",
//       item_image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop"
//     },
//     {
//       item_id: 3,
//       item_name: "Máy in Canon LBP6030",
//       category_name: "Thiết bị",
//       quantity: 2,
//       claim_item_requests: 15,
//       description: "Máy in laser Canon LBP6030, in đen trắng, tốc độ in nhanh, tiết kiệm mực. Phù hợp cho văn phòng nhỏ hoặc sử dụng cá nhân. Máy đã qua sử dụng nhưng vẫn hoạt động ổn định và in được chất lượng tốt.",
//       item_image: "broken-image-url"
//     }
//   ];

//   const handleItemClick = (item: IItemWarehouse) => {
//     console.log('Clicked item:', item.item_name);
//   };

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="container mx-auto">
//         <h1 className="text-3xl font-bold text-foreground mb-8">Kho hàng cũ</h1>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {sampleItems.map((item) => (
//             <ItemWarehouseCard
//               key={item.item_id}
//               item={item}
//               onClick={handleItemClick}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default IItemWarehouseDemo;
