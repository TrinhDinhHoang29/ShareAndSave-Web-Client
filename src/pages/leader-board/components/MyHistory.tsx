import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, ChevronDown, History, Package } from 'lucide-react'
import React, { useState } from 'react'

import Loading from '@/components/common/Loading'
import { useMyGoodDeedsQuery } from '@/hooks/queries/use-good-deed.query'
import { EGoodDeedType } from '@/models/enums'
import { IDetailGoodDeed } from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

interface GoodDeedItemProps {
	deed: IDetailGoodDeed // Replace with your actual good deed type
	index: number
}

const GoodDeedItem = ({ deed }: GoodDeedItemProps) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const handleToggle = () => {
		setIsExpanded(!isExpanded)
	}

	const getGoodDeedTypeName = (type: EGoodDeedType) => {
		switch (type) {
			case EGoodDeedType.GOOD_DEED_TYPE_GIVE_OLD_ITEM:
				return 'Tặng đồ cũ'
			case EGoodDeedType.GOOD_DEED_TYPE_GIVE_LOSE_ITEM:
				return 'Trả đồ thất lạc'
			case EGoodDeedType.GOOD_DEED_TYPE_CAMPAGIN:
				return 'Chiến dịch'
			default:
				return 'Hoạt động tốt'
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('vi-VN', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	return (
		<div className='border-border overflow-hidden rounded-lg border shadow-sm'>
			{/* Collapse Header */}
			<div
				onClick={handleToggle}
				className='hover:bg-muted focus:ring-primary/50 w-full cursor-pointer p-4 text-left transition-colors duration-200 focus:ring-2 focus:outline-none focus:ring-inset'
			>
				<div className='flex items-center justify-between'>
					<div className='min-w-0 flex-1'>
						{/* Good Deed Type */}
						<div className='text-foreground mb-1 text-sm font-medium'>
							{getGoodDeedTypeName(deed.goodDeedType)}
						</div>

						{/* Date and Items count */}
						<div className='text-muted-foreground flex items-center gap-3 text-sm'>
							<span className='flex items-center gap-1'>
								<Calendar className='h-3 w-3' />
								<span>{formatDate(deed.createdAt)}</span>
							</span>
							{deed.items.length > 0 && (
								<span className='flex items-center gap-1'>
									<Package className='h-3 w-3' />
									<span className='font-medium'>{deed.items.length}</span>
									<span>vật phẩm</span>
								</span>
							)}
						</div>
					</div>

					<div className='flex items-center gap-4'>
						{/* Good Points */}
						<div
							className={`flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
								deed.goodPoint > 0
									? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
									: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
							}`}
						>
							<span>
								{deed.goodPoint > 0 ? '+' : ''}
								{deed.goodPoint} điểm
							</span>
						</div>

						{/* Chevron */}
						<ChevronDown
							className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${
								isExpanded ? 'rotate-180' : ''
							}`}
						/>
					</div>
				</div>
			</div>

			{/* Collapse Content */}
			<AnimatePresence>
				{isExpanded && deed.items.length > 0 && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className='border-border border-t'
					>
						<div className='bg-muted/50 p-4'>
							<div className='mb-3'>
								<h4 className='text-foreground text-sm font-medium'>
									Vật phẩm liên quan
								</h4>
							</div>
							<div className='space-y-3'>
								{deed.items.map((item: any, itemIndex: number) => (
									<motion.div
										key={item.itemID || itemIndex}
										initial={{ opacity: 0, x: -10 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{
											duration: 0.2,
											delay: itemIndex * 0.05,
											ease: 'easeOut'
										}}
										className='bg-card border-border flex items-center gap-3 rounded-lg border p-3 shadow-sm'
									>
										{/* Item Image */}
										<div className='flex-shrink-0'>
											{item.itemImage ? (
												<img
													src={item.itemImage}
													alt={item.itemName}
													className='border-border h-12 w-12 rounded-lg border object-cover'
													onError={e => {
														const target = e.target as HTMLImageElement
														target.src =
															'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRkZGRkY2Ii8+CjxwYXRoIGQ9Ik0yMCAyOEMyNC40MTgzIDI4IDI4IDI0LjQxODMgMjggMjBDMjggMTUuNTgxNyAyNC40MTgzIDEyIDIwIDEyQzE1LjU4MTcgMTIgMTIgMTUuNTgxNyAxMiAyMEMxMiAyNC40MTgzIDE1LjU4MTcgMjggMjAgMjhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPgo='
													}}
												/>
											) : (
												<div className='border-border bg-muted flex h-12 w-12 items-center justify-center rounded-lg border'>
													<Package className='text-muted-foreground h-6 w-6' />
												</div>
											)}
										</div>

										{/* Item Info */}
										<div className='min-w-0 flex-1'>
											<h4 className='text-foreground truncate text-sm font-medium'>
												{item.itemName}
											</h4>
											{item.quantity > 1 && (
												<p className='text-muted-foreground mt-1 text-xs'>
													Số lượng:{' '}
													<span className='text-foreground font-medium'>
														{item.quantity}
													</span>
												</p>
											)}
										</div>
									</motion.div>
								))}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

const MyHistory: React.FC = () => {
	const userId = useAuthStore.getState().user?.id
	const { data, isPending } = useMyGoodDeedsQuery(userId || 0)

	if (isPending) {
		return <Loading text='Đang tải...' />
	}

	return data?.length === 0 ? (
		<div className='py-8 text-center'>
			<div className='bg-muted/30 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
				<History className='text-muted-foreground h-8 w-8' />
			</div>
			<p className='text-muted-foreground'>Chưa có hoạt động nào</p>
		</div>
	) : (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className='space-y-4'
		>
			{data &&
				data.map((deed, index) => (
					<motion.div
						key={deed.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.3,
							delay: index * 0.05,
							ease: 'easeOut'
						}}
					>
						<GoodDeedItem
							deed={deed}
							index={index}
						/>
					</motion.div>
				))}
		</motion.div>
	)
}

export default MyHistory
