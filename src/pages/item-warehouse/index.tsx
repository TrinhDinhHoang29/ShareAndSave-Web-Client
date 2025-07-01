import clsx from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { CircleAlert, Frown, Package } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import CustomSelect from '@/components/common/CustomSelect'
import Pagination from '@/components/common/Pagination'
import { useAlertModalContext } from '@/context/alert-modal-context'
import {
	useCreateItemWarehouseMutation,
	useDeleteItemWarehouseMutation,
	useUpdateItemWarehouseMutation
} from '@/hooks/mutations/use-item-warehouse.mutation'
import { useCategoriesQuery } from '@/hooks/queries/use-category-query'
import {
	useListItemWarehouseQuery,
	useMyItemWarehouseQuery
} from '@/hooks/queries/use-item-warehouse-query'
import useDebounce from '@/hooks/use-debounce'
import { ESortOrder } from '@/models/enums'
import {
	IItemWarehouse,
	IItemWarehouseParams,
	IItemWarehouseRequest,
	IOption
} from '@/models/interfaces'
import { sortQuantityOptions } from '@/models/options'
import useAuthStore from '@/stores/authStore'

import Heading from '../home/components/Heading'
import ItemWarehouseCard from './components/ITemWarehouseCard'
import ItemWarehouseCardSkeleton from './components/ItemWarehouseSkeletonCard'
import MyWarehouseSidebar from './components/MyWarehouseSidebar'
import NoticeDialog from './components/NoticeDialog'
import SelectionSummary from './components/SelectionSummary'

const ItemWarehouse = () => {
	const [selectedCategoryID, setSelectedCategoryID] = useState<string>('')
	const [search, setSearch] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [order, setOrder] = useState<ESortOrder>(ESortOrder.DESC)
	const [selectionMode, setSelectionMode] = useState(false)
	const [selectedItems, setSelectedItems] = useState<IItemWarehouse[]>([])
	const [showMyWarehouse, setShowMyWarehouse] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isOpenDialog, setIsOpenDialog] = useState(false)
	const { isAuthenticated } = useAuthStore()
	const { showInfo } = useAlertModalContext()

	// 🆕 State riêng cho tab "Đăng ký" và "Yêu cầu đã gửi"
	const [registeredItems, setRegisteredItems] = useState<IItemWarehouse[]>([])
	const [submittedRequests, setSubmittedRequests] = useState<IItemWarehouse[]>(
		[]
	)

	const debouncedSearch = useDebounce(search, 500)

	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedSearch, selectedCategoryID])

	const params: IItemWarehouseParams = useMemo(
		() => ({
			page: currentPage,
			limit: 6,
			sort: 'quantity',
			order,
			search: debouncedSearch || undefined,
			categoryID: Number(selectedCategoryID)
		}),
		[currentPage, order, debouncedSearch, selectedCategoryID]
	)
	const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
	const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set())
	const { data, isPending } = useListItemWarehouseQuery(params)
	const { data: categories } = useCategoriesQuery()
	const {
		mutate: createItemWarehouseMutation,
		isPending: isCreateItemWarehousePending
	} = useCreateItemWarehouseMutation({
		onSuccess: () => {
			refetchClaimRequests()
			// Clear registered items after successful confirmation
			setRegisteredItems([])
			setShowMyWarehouse(false)
		}
	})
	const totalPage = data?.totalPage || 1
	const { data: claimRequests, refetch: refetchClaimRequests } =
		useMyItemWarehouseQuery(isAuthenticated)
	const updateItemMutation = useUpdateItemWarehouseMutation({
		onSuccess: () => {
			// Có thể refetch data nếu cần
		},
		onMutate: itemID => {
			setUpdatingItems(prev => new Set([...prev, itemID]))
		},
		onSettled: itemID => {
			setUpdatingItems(prev => {
				const newSet = new Set(prev)
				newSet.delete(itemID)
				return newSet
			})
		}
	})
	const deleteItemMutation = useDeleteItemWarehouseMutation({
		onSuccess: () => {
			refetchClaimRequests()
		},
		onMutate: itemID => {
			setDeletingItems(prev => new Set([...prev, itemID]))
		},
		onSettled: itemID => {
			setDeletingItems(prev => {
				const newSet = new Set(prev)
				newSet.delete(itemID)
				return newSet
			})
		}
	})

	const itemWarehouses = useMemo(() => {
		if (
			claimRequests &&
			claimRequests.length > 0 &&
			data &&
			data.itemOldStocks.length > 0
		) {
			return data.itemOldStocks.map(item => {
				const index = claimRequests.findIndex(i => i.itemID === item.itemID)
				if (index !== -1) {
					return {
						...item,
						meQuantity: claimRequests[index].quantity
					}
				}
				return item
			})
		}
		return data?.itemOldStocks || []
	}, [claimRequests, data])

	// 🔄 Cập nhật submittedRequests khi có dữ liệu từ API
	useEffect(() => {
		if (claimRequests) {
			setSubmittedRequests(claimRequests)
		}
	}, [claimRequests])

	const categoryOptions: IOption[] = useMemo(() => {
		if (categories && categories.length > 0) {
			const categoryOptions = categories.map(category => ({
				label: category.name,
				value: category.id
			}))
			return [{ value: '', label: 'Tất cả' }, ...categoryOptions]
		}
		return []
	}, [categories])

	const handleSelectionMode = () => {
		if (isAuthenticated) {
			setSelectionMode(!selectionMode)
			if (selectionMode) {
				setSelectedItems([])
			}
		} else {
			showInfo({
				infoButtonText: 'Đã rõ',
				infoMessage: 'Vui lòng đăng nhập để thực hiện thao tác',
				infoTitle: 'Thông báo'
			})
		}
	}

	const handleSelectItem = (itemID: number, quantity: number) => {
		const item = itemWarehouses.find(i => i.itemID === itemID)
		let newItem: IItemWarehouse | null = null

		if (item) {
			newItem = {
				...item,
				quantity: quantity,
				currentQuantity: item.quantity
			}
		}

		setSelectedItems(prev => {
			if (!newItem) return prev
			if (prev && prev.length > 0) {
				const existingIndex = prev.findIndex(item => item.itemID === itemID)
				if (existingIndex >= 0) {
					// Update existing item
					const updated = [...prev]
					updated[existingIndex] = newItem
					return updated
				} else {
					// Add new item
					return [...prev, newItem]
				}
			} else {
				return [newItem]
			}
		})
	}

	const handleDeselectItem = (itemID: number) => {
		setSelectedItems(prev => prev.filter(item => item.itemID !== itemID))
	}

	// 🔄 Xử lý cập nhật số lượng từ sidebar - Tab "Đăng ký"
	const handleUpdateRegisteredQuantity = (
		itemID: number,
		newQuantity: number
	) => {
		setRegisteredItems(prev => {
			return prev.map(item =>
				item.itemID === itemID ? { ...item, quantity: newQuantity } : item
			)
		})
	}

	// 🔄 Xử lý cập nhật số lượng từ sidebar - Tab "Yêu cầu đã gửi"
	const handleUpdateClaimQuantity = (itemID: number, newQuantity: number) => {
		setSubmittedRequests(prev => {
			return prev.map(item =>
				item.itemID === itemID ? { ...item, quantity: newQuantity } : item
			)
		})
	}

	// 🗑️ Xử lý xóa item từ sidebar - Tab "Đăng ký"
	const handleRemoveRegisteredItem = (itemID: number) => {
		if (itemID === 0) {
			setRegisteredItems([])
		} else {
			setRegisteredItems(prev => {
				return prev.filter(item => item.itemID !== itemID)
			})
		}
	}

	// 🗑️ Xử lý xóa item từ sidebar - Tab "Yêu cầu đã gửi"
	const handleRemoveClaimItem = (itemID: number) => {
		deleteItemMutation.mutate(itemID)
	}

	// 📦 Xử lý thêm vào kho (chuyển từ selectedItems sang registeredItems)
	const handleAddToWarehouse = async () => {
		if (selectedItems.length === 0) return
		setIsLoading(true)

		try {
			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 500))

			// 🔄 Chuyển selectedItems vào registeredItems
			setRegisteredItems(prev => {
				const newItems = [...prev]
				selectedItems.forEach(selectedItem => {
					const existingIndex = newItems.findIndex(
						item => item.itemID === selectedItem.itemID
					)
					if (existingIndex >= 0) {
						// Update existing item
						newItems[existingIndex] = selectedItem
					} else {
						// Add new item
						newItems.push(selectedItem)
					}
				})
				return newItems
			})

			// Reset selection state
			setSelectedItems([])
			setSelectionMode(false)
			setShowMyWarehouse(false)
		} catch (error) {
			console.error('Error adding to warehouse:', error)
			alert('Có lỗi xảy ra khi thêm vào kho!')
		} finally {
			setIsLoading(false)
		}
	}

	const handleUpdateClaimItem = async (itemID: number, newQuantity: number) => {
		updateItemMutation.mutate({ data: { itemID, newQuantity } })
	}

	const isItemUpdating = (itemID: number) =>
		updatingItems.has(itemID.toString())
	const isItemDeleting = (itemID: number) =>
		deletingItems.has(itemID.toString())

	// 📦 Xử lý xác nhận nhận đồ từ sidebar - Tab "Đăng ký"
	const handleConfirmReceiveItems = async () => {
		if (registeredItems.length === 0) return

		const data: IItemWarehouseRequest[] = registeredItems.map(item => ({
			itemID: item.itemID,
			quantity: item.quantity
		}))

		createItemWarehouseMutation({
			data
		})
	}

	const isItemSelected = (itemID: number) => {
		return selectedItems.some(item => item.itemID === itemID)
	}

	const getSelectedQuantity = (itemID: number) => {
		const item = selectedItems.find(item => item.itemID === itemID)
		return item?.quantity || 1
	}

	// 🔢 Tính tổng số items trong kho
	const totalWarehouseItems = registeredItems.length + submittedRequests.length

	return (
		<>
			<div className='container mx-auto space-y-6 py-12'>
				{/* Header with Selection Toggle */}
				<div className='flex items-center justify-between'>
					<Heading title='Kho đồ cũ' />
					<div className='flex items-center gap-4'>
						<button
							onClick={() => setIsOpenDialog(true)}
							className='bg-primary text-primary-foreground hover:bg-primary/90 relative flex items-center gap-2 rounded-lg px-4 py-2 transition-colors'
						>
							<CircleAlert className='h-5 w-5' />
							<span>Lưu ý</span>
						</button>
						<button
							onClick={() => setShowMyWarehouse(!showMyWarehouse)}
							className='bg-primary text-primary-foreground hover:bg-primary/90 relative flex items-center gap-2 rounded-lg px-4 py-2 transition-colors'
						>
							<Package className='h-5 w-5' />
							<span>Kho của tôi</span>
							{totalWarehouseItems > 0 && (
								<span className='absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
									{totalWarehouseItems}
								</span>
							)}
						</button>
						<button
							onClick={handleSelectionMode}
							className={clsx(
								'rounded-lg px-4 py-2 transition-colors',
								selectionMode
									? 'bg-red-500 text-white hover:bg-red-600'
									: 'bg-primary text-primary-foreground hover:bg-primary/90'
							)}
						>
							{selectionMode ? 'Hủy chọn' : 'Chọn sản phẩm'}
						</button>
					</div>
				</div>

				{/* My Warehouse Sidebar */}
				<MyWarehouseSidebar
					selectedItems={registeredItems}
					claimRequests={submittedRequests}
					isOpen={showMyWarehouse}
					onClose={() => setShowMyWarehouse(false)}
					isCreateLoading={isCreateItemWarehousePending}
					onUpdateQuantity={handleUpdateRegisteredQuantity}
					onRemoveItem={handleRemoveRegisteredItem}
					onConfirmReceive={handleConfirmReceiveItems}
					onUpdateClaimQuantity={handleUpdateClaimQuantity}
					onRemoveClaimItem={handleRemoveClaimItem}
					onUpdateClaimItem={handleUpdateClaimItem}
					isItemUpdating={isItemUpdating} // 🆕 Thêm prop này
					isItemDeleting={isItemDeleting}
				/>

				{/* Filters */}
				<div className='mb-6 flex items-center justify-between gap-2'>
					<div className='w-2/3'>
						<label
							htmlFor='searchInput'
							className='text-secondary mb-1 block text-sm font-medium'
						>
							Tìm kiếm
						</label>
						<input
							id='searchInput'
							type='text'
							value={search}
							onChange={e => setSearch(e.target.value)}
							placeholder='Tìm kiếm bài đăng, tiêu đề...'
							className='bg-card text-foreground focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
						/>
					</div>
					<div className='flex-1'>
						<label className='text-secondary mb-1 block text-sm font-medium'>
							Số lượng
						</label>
						<CustomSelect
							value={order}
							onChange={value => setOrder(value as ESortOrder)}
							options={sortQuantityOptions}
							className='flex-1'
						/>
					</div>
					<div className='flex-1'>
						<label className='text-secondary mb-1 block text-sm font-medium'>
							Phân loại
						</label>
						<CustomSelect
							value={selectedCategoryID}
							onChange={value => setSelectedCategoryID(value.toString())}
							options={categoryOptions}
							className='flex-1'
						/>
					</div>
				</div>

				{/* Items Grid */}
				<div className='relative space-y-6'>
					<AnimatePresence mode='wait'>
						<motion.div
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className='space-y-6'
						>
							<div className='grid grid-cols-3 gap-6'>
								{isPending ? (
									<ItemWarehouseCardSkeleton quantity={6} />
								) : itemWarehouses.length > 0 ? (
									itemWarehouses.map(item => (
										<ItemWarehouseCard
											key={item.itemID}
											item={item}
											selectionMode={selectionMode}
											isSelected={isItemSelected(item.itemID)}
											selectedQuantity={getSelectedQuantity(item.itemID)}
											onSelect={handleSelectItem}
											onDeselect={handleDeselectItem}
										/>
									))
								) : (
									<div className='border-border bg-card/50 col-span-3 rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm'>
										<div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
											<Frown className='text-muted-foreground h-8 w-8' />
										</div>
										<p className='text-muted-foreground text-lg'>
											Không tìm thấy kết quả
										</p>
									</div>
								)}
							</div>
						</motion.div>
					</AnimatePresence>

					{totalPage > 1 && (
						<Pagination
							currentPage={currentPage}
							totalPages={totalPage}
							setCurrentPage={setCurrentPage}
						/>
					)}
				</div>

				{/* Selection Summary */}
				<SelectionSummary
					selectedCount={selectedItems.length}
					onAddToWarehouse={handleAddToWarehouse}
					isVisible={selectionMode}
					isLoading={isLoading}
				/>
			</div>
			<NoticeDialog
				isOpen={isOpenDialog}
				onClose={() => setIsOpenDialog(false)}
			/>
		</>
	)
}

export default ItemWarehouse
