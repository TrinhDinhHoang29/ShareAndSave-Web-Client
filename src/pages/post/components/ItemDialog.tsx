import { Dialog, Transition } from '@headlessui/react'
import { Loader } from 'lucide-react'
import React, { Fragment, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useCategoriesQuery } from '@/hooks/queries/use-category-query'
import { useItemSuggestionsQuery } from '@/hooks/queries/use-item-query'
import useDebounce from '@/hooks/use-debounce'
import { ICategory, IItemSuggestion } from '@/models/interfaces'

interface ItemDialogProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (item: {
		itemID: number
		name: string
		categoryID: number
		categoryName: string
		quantity: number
		isOldItem: boolean
	}) => void
	existingItems: {
		itemID: number
		name: string
		categoryID?: number
		categoryName: string
		quantity: number
	}[]
}

const ItemDialog: React.FC<ItemDialogProps> = ({
	isOpen,
	onClose,
	onAdd,
	existingItems
}) => {
	const [name, setName] = useState('')
	const [categoryID, setCategoryID] = useState<number | null>(null)
	const [quantity, setQuantity] = useState(1)
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
	const { data: categories, isLoading: isCategoriesLoading } =
		useCategoriesQuery()

	const debouncedName = useDebounce(name, 300)
	const { data: suggestions = [], isLoading: isSuggestionsLoading } =
		useItemSuggestionsQuery({
			searchBy: 'name',
			searchValue: debouncedName
		})

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setName(value)
		setSelectedItemId(null)
		setCategoryID(null)
	}

	const handleSelectSuggestion = (item: IItemSuggestion) => {
		setName(item.name)
		setSelectedItemId(item.id)
		setCategoryID(item.categoryID)
	}

	const handleAdd = () => {
		if (name && categoryID && quantity >= 1) {
			const categoryName =
				categories?.find((c: ICategory) => c.id === categoryID)?.name ||
				'Không xác định'
			const isOldItem = !!selectedItemId
			const itemID = selectedItemId || Math.floor(Math.random() * 1000000) // Tạo itemID ngẫu nhiên cho newItem

			const item = {
				itemID,
				name,
				categoryID,
				categoryName,
				quantity,
				isOldItem
			}

			const existingItem = existingItems.find(
				existing => existing.itemID === itemID
			)

			if (existingItem) {
				const newQuantity = existingItem.quantity + quantity
				onAdd({ ...item, quantity: newQuantity })
			} else {
				onAdd(item)
			}

			setName('')
			setCategoryID(null)
			setQuantity(1)
			setSelectedItemId(null)
			onClose()
		}
	}

	return (
		<Transition
			appear
			show={isOpen}
			as={Fragment}
		>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={onClose}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='bg-opacity-25 fixed inset-0 bg-black/50' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4 text-center'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-100 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-100 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='bg-card w-full max-w-md transform overflow-hidden rounded-lg p-6 text-left align-middle shadow-xl transition-all'>
								<Dialog.Title
									as='h3'
									className='font-manrope text-foreground text-lg font-semibold'
								>
									Thêm Món Đồ
								</Dialog.Title>
								<div className='mt-4 space-y-4'>
									<div>
										<label className='text-foreground block text-sm font-medium'>
											Tên món đồ *
										</label>
										<input
											type='text'
											value={name}
											onChange={handleNameChange}
											className='border-border focus:ring-primary mt-1 w-full rounded-md border p-2 focus:ring-2 focus:outline-none'
											placeholder='Nhập tên món đồ'
										/>
										{(isSuggestionsLoading || suggestions.length > 0) && (
											<ul className='border-border bg-card mt-1 max-h-40 overflow-y-auto rounded-md border shadow-sm'>
												{isSuggestionsLoading ? (
													<li className='px-3 py-2'>
														<Loader className='h-5 w-5 animate-spin' />
													</li>
												) : (
													suggestions.map((suggestion: IItemSuggestion) => (
														<li
															key={suggestion.id}
															onClick={() => handleSelectSuggestion(suggestion)}
															className='text-foreground hover:bg-muted cursor-pointer px-3 py-2'
														>
															{suggestion.name}
														</li>
													))
												)}
											</ul>
										)}
									</div>
									<div>
										<label className='text-foreground block text-sm font-medium'>
											Danh mục *
										</label>
										<select
											value={categoryID || ''}
											onChange={e =>
												!selectedItemId &&
												setCategoryID(parseInt(e.target.value))
											}
											disabled={!!selectedItemId}
											className='border-border focus:ring-primary disabled:bg-muted disabled:text-muted-foreground mt-1 w-full rounded-md border p-2 focus:ring-2 focus:outline-none'
										>
											<option
												value=''
												disabled
											>
												Chọn danh mục
											</option>
											{isCategoriesLoading ? (
												<option disabled>
													<Loader className='h-5 w-5 animate-spin' />
												</option>
											) : (
												categories &&
												categories.map((category: ICategory) => (
													<option
														key={category.id}
														value={category.id}
													>
														{category.name}
													</option>
												))
											)}
										</select>
									</div>
									<div>
										<label className='text-foreground block text-sm font-medium'>
											Số lượng *
										</label>
										<input
											type='number'
											value={quantity}
											onChange={e =>
												setQuantity(Math.max(1, parseInt(e.target.value) || 1))
											}
											className='border-border focus:ring-primary mt-1 w-full rounded-md border p-2 focus:ring-2 focus:outline-none'
											min='1'
										/>
									</div>
								</div>
								<div className='mt-6 flex justify-end gap-2'>
									<button
										onClick={onClose}
										className='border-border text-muted-foreground hover:bg-muted rounded-md border px-4 py-2 transition-colors'
									>
										Hủy
									</button>
									<button
										onClick={handleAdd}
										disabled={!name || !categoryID || quantity < 1}
										className='rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-400'
									>
										Xác nhận
									</button>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default ItemDialog
