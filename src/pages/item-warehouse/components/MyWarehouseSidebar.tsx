import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Package, Plus, X } from 'lucide-react'
import React, { useMemo, useState } from 'react'

import DefaultImage from '@/assets/images/default_img.webp'
import Loading from '@/components/common/Loading'
import { IItemWarehouse } from '@/models/interfaces'

interface MyWarehouseSidebarProps {
	isOpen: boolean
	onClose: () => void
	selectedItems: IItemWarehouse[]
	claimRequests: IItemWarehouse[]
	isCreateLoading?: boolean
	onUpdateQuantity: (itemID: number, newQuantity: number) => void
	onRemoveItem: (itemID: number) => void
	onConfirmReceive: () => void
	onUpdateClaimQuantity: (itemID: number, newQuantity: number) => void
	onRemoveClaimItem: (itemID: number) => void
	onUpdateClaimItem: (itemID: number, newQuantity: number) => void
	isItemUpdating: (itemID: number) => boolean
	isItemDeleting: (itemID: number) => boolean
}

type TabType = 'register' | 'submitted'

const MyWarehouseSidebar: React.FC<MyWarehouseSidebarProps> = ({
	isOpen,
	onClose,
	selectedItems,
	claimRequests,
	isCreateLoading = false,
	onUpdateQuantity,
	onRemoveItem,
	onConfirmReceive,
	onUpdateClaimQuantity,
	onRemoveClaimItem,
	onUpdateClaimItem,
	isItemUpdating,
	isItemDeleting
}) => {
	const [activeTab, setActiveTab] = useState<TabType>('register')
	const claimRequestStables = useMemo(() => {
		return claimRequests
	}, [claimRequests])

	const handleQuantityChange = (
		itemID: number,
		newQuantity: number,
		isClaimRequest = false
	) => {
		if (newQuantity <= 0) return
		if (isClaimRequest) {
			onUpdateClaimQuantity(itemID, newQuantity)
		} else {
			onUpdateQuantity(itemID, newQuantity)
		}
	}

	const incrementQuantity = (
		itemID: number,
		currentQuantity: number,
		maxQuantity?: number,
		isClaimRequest = false
	) => {
		const newQuantity = currentQuantity + 1
		if (maxQuantity && newQuantity > maxQuantity) return
		handleQuantityChange(itemID, newQuantity, isClaimRequest)
	}

	const decrementQuantity = (
		itemID: number,
		currentQuantity: number,
		isClaimRequest = false
	) => {
		if (currentQuantity > 1) {
			handleQuantityChange(itemID, currentQuantity - 1, isClaimRequest)
		}
	}

	const handleRemoveItem = (itemID: number, isClaimRequest = false) => {
		if (isClaimRequest) {
			onRemoveClaimItem(itemID)
		} else {
			onRemoveItem(itemID)
		}
	}

	const handleConfirmReceive = () => {
		onConfirmReceive()
	}

	const handleUpdateClaimItem = (itemID: number, newQuantity: number) => {
		onUpdateClaimItem(itemID, newQuantity)
	}

	const renderItemList = (items: IItemWarehouse[], isClaimRequest = false) => {
		if (items.length === 0) {
			return (
				<div className='text-muted-foreground py-12 text-center'>
					<Package className='mx-auto mb-4 h-12 w-12 opacity-50' />
					<p>{isClaimRequest ? 'Chưa có yêu cầu nào' : 'Chưa có món đồ nào'}</p>
					<p className='mt-2 text-sm'>
						{isClaimRequest
							? 'Các yêu cầu đã gửi sẽ hiển thị ở đây'
							: 'Hãy chọn món đồ để thêm vào kho'}
					</p>
				</div>
			)
		}

		return (
			<div className='space-y-4'>
				<div className='mb-4 flex items-center justify-between'>
					<div className='text-muted-foreground text-sm'>
						{isClaimRequest ? 'Yêu cầu đã gửi' : 'Món đồ đã chọn'}:{' '}
						{items.length}
					</div>
					<button
						className='text-muted-foreground hover:text-foreground text-sm transition-colors'
						onClick={() => handleRemoveItem(0, isClaimRequest)}
					>
						Xóa tất cả
					</button>
				</div>

				{items.map(item => {
					const isUpdating = isItemUpdating(item.itemID)
					const isDeleting = isItemDeleting(item.itemID)

					return (
						<div
							key={item.itemID}
							className={clsx(
								'bg-muted space-y-3 rounded-lg border p-4',
								activeTab === 'submitted'
									? 'border-success/80'
									: 'border-border'
							)}
						>
							{/* Header với hình ảnh và thông tin cơ bản */}
							<div className='flex items-start gap-3'>
								<div className='bg-muted h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg'>
									<img
										src={item.itemImage}
										alt={item.itemName}
										className='h-full w-full object-cover'
										onError={e => {
											const target = e.target as HTMLImageElement
											target.src = DefaultImage
										}}
									/>
								</div>
								<div className='min-w-0 flex-1 space-y-1'>
									<h3 className='line-clamp-1 font-medium'>{item.itemName}</h3>
									<p className='text-muted-foreground text-xs'>
										Phân loại: {item.categoryName}
									</p>
									{item.currentQuantity && (
										<div className='text-muted-foreground text-xs'>
											Có sẵn: {item.currentQuantity}
										</div>
									)}
								</div>
								<button
									disabled={isDeleting}
									onClick={() => handleRemoveItem(item.itemID, isClaimRequest)}
									className='hover:bg-background text-error/90 hover:text-error flex-shrink-0 rounded p-1 transition-colors'
								>
									{isDeleting ? (
										<Loading size='sm' />
									) : (
										<X className='h-4 w-4' />
									)}
								</button>
							</div>

							{/* Điều chỉnh số lượng */}
							<div className='flex items-center justify-between'>
								<span className='text-sm font-medium'>Số lượng:</span>
								<div className='flex items-center gap-2'>
									<button
										onClick={() =>
											decrementQuantity(
												item.itemID,
												item.quantity,
												isClaimRequest
											)
										}
										disabled={item.quantity <= 1}
										className='bg-background hover:bg-background/80 flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50'
									>
										<Minus className='h-4 w-4' />
									</button>
									<span className='bg-background w-12 rounded px-2 py-1 text-center font-medium'>
										{item.quantity}
									</span>
									<button
										onClick={() =>
											incrementQuantity(
												item.itemID,
												item.quantity,
												Math.min(item.currentQuantity || 0, item.maxClaim),
												isClaimRequest
											)
										}
										disabled={
											Math.min(item.currentQuantity || 0, item.maxClaim)
												? item.quantity >=
													Math.min(item.currentQuantity || 0, item.maxClaim)
												: false
										}
										className='bg-background hover:bg-background/80 flex h-8 w-8 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-50'
									>
										<Plus className='h-4 w-4' />
									</button>
								</div>
							</div>

							{activeTab === 'submitted' && (
								<button
									disabled={isUpdating}
									className='bg-success/80 text-primary-foreground hover:bg-success/90 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
									onClick={() =>
										handleUpdateClaimItem(item.itemID, item.quantity)
									}
								>
									{isUpdating ? (
										<>
											<Loading
												size='sm'
												color='white'
											/>
											Đang cập nhật...
										</>
									) : (
										'Cập nhật số lượng'
									)}
								</button>
							)}
						</div>
					)
				})}

				{!isClaimRequest && (
					<button
						onClick={handleConfirmReceive}
						disabled={isCreateLoading}
						className='bg-primary text-primary-foreground hover:bg-primary/90 flex w-full items-center justify-center gap-2 rounded-lg py-3 font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50'
					>
						{isCreateLoading ? (
							<>
								<Loading size='sm' />
								Đang xử lý...
							</>
						) : (
							<>
								<Package className='h-4 w-4' />
								{claimRequestStables && claimRequestStables.length > 0
									? 'Xác nhận thêm đồ'
									: 'Xác nhận đăng ký nhận đồ'}
							</>
						)}
					</button>
				)}
			</div>
		)
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className='fixed inset-0 z-50 bg-black/50'
					onClick={onClose}
				>
					<motion.div
						initial={{ x: '100%' }}
						animate={{ x: 0 }}
						exit={{ x: '100%' }}
						transition={{ type: 'spring', damping: 25, stiffness: 200 }}
						className='bg-background absolute top-0 right-0 h-full w-96 overflow-y-auto border-l shadow-xl'
						onClick={e => e.stopPropagation()}
					>
						<div className='p-6'>
							<div className='mb-6 flex items-center justify-between'>
								<h2 className='text-xl font-bold'>Kho của tôi</h2>
								<button
									onClick={onClose}
									className='hover:bg-muted rounded-lg p-2 transition-colors'
								>
									<X className='h-5 w-5' />
								</button>
							</div>

							{/* Tabs */}
							<div className='bg-muted mb-6 flex rounded-lg p-1'>
								<button
									onClick={() => setActiveTab('register')}
									className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
										activeTab === 'register'
											? 'bg-background text-foreground shadow-sm'
											: 'text-muted-foreground hover:text-foreground'
									}`}
								>
									Đăng ký
									{selectedItems.length > 0 && (
										<span className='bg-primary text-primary-foreground ml-2 rounded-full px-2 py-0.5 text-xs'>
											{selectedItems.length}
										</span>
									)}
								</button>
								<button
									onClick={() => setActiveTab('submitted')}
									className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
										activeTab === 'submitted'
											? 'bg-background text-foreground shadow-sm'
											: 'text-muted-foreground hover:text-foreground'
									}`}
								>
									Yêu cầu đã gửi
									{claimRequestStables.length > 0 && (
										<span className='bg-success/70 ml-2 rounded-full px-2 py-0.5 text-xs text-white'>
											{claimRequestStables.length}
										</span>
									)}
								</button>
							</div>

							{/* Tab Content */}
							<div className='tab-content'>
								{activeTab === 'register' &&
									renderItemList(selectedItems, false)}
								{activeTab === 'submitted' &&
									renderItemList(claimRequestStables, true)}
							</div>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default MyWarehouseSidebar
