import { Package, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { FieldError, useFormContext } from 'react-hook-form'

import ImageUpload from '@/components/common/ImageUpload'
import InputText from '@/components/common/InputText'
import { PostInfo } from '@/models/types'

import ItemDialog from './ItemDialog'

// Hàm tạo UUID đơn giản (thay bằng import { v4 as uuidv4 } từ 'uuid' nếu dùng thư viện)
function generateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

interface PostSendOldItemFormProps {
	isTransitioning: boolean
}

const PostSendOldItemForm: React.FC<PostSendOldItemFormProps> = ({
	isTransitioning
}) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue,
		getValues
	} = useFormContext<PostInfo>()
	const [newItems, setNewItems] = useState<any[]>([])
	const [oldItems, setOldItems] = useState<any[]>([])
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const handleAddItem = (
		item: {
			name: string
			categoryID: number
			quantity: number
			itemID?: number
		},
		isOldItem: boolean
	) => {
		const uuid = generateUUID()
		if (isOldItem) {
			const existingOldItemIndex = oldItems.findIndex(
				oldItem => oldItem.itemID === item.itemID
			)
			if (existingOldItemIndex !== -1) {
				// Nếu item đã tồn tại, cập nhật quantity
				const updatedOldItems = [...oldItems]
				updatedOldItems[existingOldItemIndex].quantity = item.quantity
				setOldItems(updatedOldItems)
				setValue('oldItems', updatedOldItems)
			} else {
				// Nếu item chưa tồn tại, thêm mới
				const newOldItem = {
					itemID: item.itemID!,
					quantity: item.quantity,
					categoryID: item.categoryID,
					id: uuid
				}
				setOldItems(prev => [...prev, newOldItem])
				setValue('oldItems', [...(getValues('oldItems') || []), newOldItem])
			}
		} else {
			const existingNewItemIndex = newItems.findIndex(
				newItem =>
					newItem.name === item.name && newItem.categoryID === item.categoryID
			)
			if (existingNewItemIndex !== -1) {
				// Nếu item đã tồn tại, cập nhật quantity
				const updatedNewItems = [...newItems]
				updatedNewItems[existingNewItemIndex].quantity = item.quantity
				setNewItems(updatedNewItems)
				setValue('newItems', updatedNewItems)
			} else {
				// Nếu item chưa tồn tại, thêm mới
				const newItem = {
					name: item.name,
					categoryID: item.categoryID,
					quantity: item.quantity,
					id: uuid
				}
				setNewItems(prev => [...prev, newItem])
				setValue('newItems', [...(getValues('newItems') || []), newItem])
			}
		}
	}

	const handleDeleteItem = (id: string) => {
		const isNewItem = newItems.some(item => item.id === id)
		if (isNewItem) {
			const updatedItems = newItems.filter(item => item.id !== id)
			setNewItems(updatedItems)
			setValue('newItems', updatedItems)
		} else {
			const updatedItems = oldItems.filter(item => item.id !== id)
			setOldItems(updatedItems)
			setValue('oldItems', updatedItems)
		}
	}

	// Hợp nhất newItems và oldItems để hiển thị trên bảng
	const allItems = [
		...newItems.map(item => ({
			id: item.id,
			name: item.name,
			categoryID: item.categoryID,
			quantity: item.quantity
		})),
		...oldItems.map(item => ({
			id: item.id,
			name: mockItems.find(mock => mock.id === item.itemID)?.name || 'Unknown',
			categoryID: item.categoryID,
			quantity: item.quantity,
			itemID: item.itemID
		}))
	]

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<Package className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground font-manrope mb-2 text-2xl font-semibold'>
					Gửi đồ cũ
				</h3>
				<p className='text-muted-foreground'>
					Nhập thông tin bài đăng cho đồ cũ
				</p>
			</div>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<InputText
						name='title'
						label='Tiêu đề *'
						placeholder='Nhập tiêu đề bài đăng'
						register={register}
						error={errors.title}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: 'Tặng áo thun cũ còn mới'
					</p>
				</div>
				{/* Items Section */}
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<label className='text-foreground mb-2 block text-sm font-medium'>
							Món đồ
						</label>
						<button
							onClick={() => setIsDialogOpen(true)}
							className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-1 transition-colors duration-200'
						>
							<Plus />
						</button>
					</div>

					{/* Unified Items Table */}
					{allItems.length > 0 && (
						<div className='mt-4 overflow-x-auto'>
							<table className='bg-card border-border min-w-full rounded-lg border'>
								<thead>
									<tr className='bg-muted text-foreground'>
										<th className='border-border border-b px-4 py-2 text-left'>
											Tên
										</th>
										<th className='border-border border-b px-4 py-2 text-left'>
											Danh mục
										</th>
										<th className='border-border border-b px-4 py-2 text-left'>
											Số lượng
										</th>
										<th className='border-border border-b px-4 py-2 text-left'>
											Hành động
										</th>
									</tr>
								</thead>
								<tbody>
									{allItems.map(item => (
										<tr
											key={item.id}
											className='hover:bg-muted/50 transition-colors'
										>
											<td className='border-border border-b px-4 py-2'>
												{item.name}
											</td>
											<td className='border-border border-b px-4 py-2'>
												{item.categoryID
													? mockCategories.find(c => c.id === item.categoryID)
															?.name || '-'
													: '-'}
											</td>
											<td className='border-border border-b px-4 py-2'>
												{item.quantity}
											</td>
											<td className='border-border border-b px-4 py-2'>
												<button
													onClick={() => handleDeleteItem(item.id)}
													className='text-destructive hover:text-destructive/80 transition-colors'
												>
													<Trash2 className='h-4 w-4' />
												</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					)}
					<p className='text-muted-foreground mt-1 text-sm'>
						Bấm vào dấu '+' để thêm món đồ
					</p>
				</div>

				<div className='space-y-2'>
					<ImageUpload
						name='images'
						label='Hình ảnh'
						watch={watch}
						setValue={setValue}
						error={errors.images as FieldError}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Tải lên hình ảnh của món đồ (nếu có)
					</p>
				</div>

				<div className='space-y-2'>
					<InputText
						name='description'
						label='Mô tả món đồ *'
						type='textarea'
						placeholder='Nhập mô tả món đồ'
						register={register}
						error={errors.description}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: 'Áo thun màu xanh, size M, đã qua sử dụng nhưng còn mới 80%'
					</p>
				</div>

				{/* <div>
					<InputText
						name="condition"
						label="Tình trạng đồ"
						placeholder="Nhập tình trạng đồ"
						register={register}
						error={errors.condition}
					/>
					<p className="text-muted-foreground mt-1 text-sm">
						Ví dụ: 'Còn mới 80%'
					</p>
				</div>
				<div>
					<InputText
						name="category"
						label="Danh mục đồ"
						placeholder="Nhập danh mục đồ"
						register={register}
						error={errors.category}
					/>
					<p className="text-muted-foreground mt-1 text-sm">Ví dụ: 'Quần áo'</p>
				</div> */}
			</div>

			<ItemDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onAdd={handleAddItem}
				existingItems={allItems}
			/>
		</div>
	)
}

export default PostSendOldItemForm

// Mock danh sách danh mục và items (để hiển thị tên danh mục và tên item trong bảng)
const mockCategories = [
	{ id: 1, name: 'Sách' },
	{ id: 2, name: 'Quần áo' },
	{ id: 3, name: 'Đồ điện tử' },
	{ id: 4, name: 'Đồ gia dụng' }
]

const mockItems = [
	{ id: 1, name: 'Sách điện tử', categoryID: 1 }, // Sách
	{ id: 2, name: 'Áo thun đen', categoryID: 2 }, // Quần áo
	{ id: 3, name: 'Ly nước levents', categoryID: 4 }, // Đồ gia dụng
	{ id: 4, name: 'Lót chuột logitech', categoryID: 3 } // Đồ điện tử
]
