import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, useState } from 'react'

interface ItemDialogProps {
	isOpen: boolean
	onClose: () => void
	onAdd: (
		item: {
			name: string
			categoryID: number
			quantity: number
			itemID?: number
		},
		isOldItem: boolean
	) => void
	existingItems: {
		id: string
		name: string
		categoryID: number
		quantity: number
		itemID?: number
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
	const [suggestions, setSuggestions] = useState<
		{ id: number; name: string; categoryID: number }[]
	>([])
	const [selectedItemId, setSelectedItemId] = useState<number | null>(null)

	// Mock danh sách gợi ý từ cơ sở dữ liệu
	const mockItems = [
		{ id: 1, name: 'Sách điện tử', categoryID: 1 }, // Sách
		{ id: 2, name: 'Áo thun đen', categoryID: 2 }, // Quần áo
		{ id: 3, name: 'Ly nước levents', categoryID: 4 }, // Đồ gia dụng
		{ id: 4, name: 'Lót chuột logitech', categoryID: 3 } // Đồ điện tử
	]

	// Mock danh sách danh mục
	const mockCategories = [
		{ id: 1, name: 'Sách' },
		{ id: 2, name: 'Quần áo' },
		{ id: 3, name: 'Đồ điện tử' },
		{ id: 4, name: 'Đồ gia dụng' }
	]

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setName(value)
		setSelectedItemId(null) // Reset lựa chọn khi người dùng nhập lại
		setCategoryID(null) // Reset categoryID khi nhập lại

		if (value) {
			const filtered = mockItems.filter(item =>
				item.name.toLowerCase().includes(value.toLowerCase())
			)
			setSuggestions(filtered)
		} else {
			setSuggestions([])
		}
	}

	const handleSelectSuggestion = (item: {
		id: number
		name: string
		categoryID: number
	}) => {
		setName(item.name)
		setSelectedItemId(item.id)
		setCategoryID(item.categoryID) // Đặt categoryID từ gợi ý và khóa nó
		setSuggestions([])
	}

	const handleAdd = () => {
		if (name && categoryID && quantity > 0) {
			const existingItem = existingItems.find(item => {
				if (selectedItemId) {
					// Kiểm tra trùng lặp dựa trên itemID cho oldItems
					return item.itemID === selectedItemId
				} else {
					// Kiểm tra trùng lặp dựa trên name và categoryID cho newItems
					return item.name === name && item.categoryID === categoryID
				}
			})

			if (existingItem) {
				// Nếu item đã tồn tại, cộng dồn quantity
				const newQuantity = existingItem.quantity + quantity
				if (selectedItemId) {
					onAdd(
						{ itemID: selectedItemId, quantity: newQuantity, categoryID, name },
						true
					)
				} else {
					onAdd({ name, categoryID, quantity: newQuantity }, false)
				}
			} else {
				// Nếu item chưa tồn tại, thêm mới
				if (selectedItemId) {
					onAdd({ itemID: selectedItemId, quantity, categoryID, name }, true)
				} else {
					onAdd({ name, categoryID, quantity }, false)
				}
			}

			// Reset form
			setName('')
			setCategoryID(null)
			setQuantity(1)
			setSuggestions([])
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
										{suggestions.length > 0 && (
											<ul className='border-border bg-card mt-1 max-h-40 overflow-y-auto rounded-md border shadow-sm'>
												{suggestions.map(suggestion => (
													<li
														key={suggestion.id}
														onClick={() => handleSelectSuggestion(suggestion)}
														className='hover:bg-muted text-foreground cursor-pointer px-3 py-2'
													>
														{suggestion.name}
													</li>
												))}
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
											} // Chỉ cho phép thay đổi nếu không chọn gợi ý
											disabled={!!selectedItemId} // Vô hiệu hóa khi chọn gợi ý
											className='border-border focus:ring-primary disabled:bg-muted disabled:text-muted-foreground mt-1 w-full rounded-md border p-2 focus:ring-2 focus:outline-none'
										>
											<option
												value=''
												disabled
											>
												Chọn danh mục
											</option>
											{mockCategories.map(category => (
												<option
													key={category.id}
													value={category.id}
												>
													{category.name}
												</option>
											))}
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
										className='border-border text-muted-foreground hover:bg-muted rounded-md border px-4 py-2 transition-colors duration-200'
									>
										Hủy
									</button>
									<button
										onClick={handleAdd}
										disabled={!name || !categoryID || quantity < 1}
										className='bg-primary text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground rounded-md px-4 py-2 transition-colors duration-200'
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
