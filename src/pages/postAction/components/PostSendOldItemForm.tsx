import { AnimatePresence, motion } from 'framer-motion'
import { Package, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import ImageUpload from '@/components/common/ImageUpload'
import InputText from '@/components/common/InputText'
import { PostInfo } from '@/models/types'

import ItemDialog from './ItemDialog'
import ItemTable from './ItemTable'

interface PostSendOldItemFormProps {
	isTransitioning: boolean
}

interface Item {
	itemID: number
	name: string
	categoryID: number
	categoryName: string
	quantity: number
	image?: string
	althernativeImage?: string
}

const PostSendOldItemForm: React.FC<PostSendOldItemFormProps> = ({
	isTransitioning
}) => {
	const {
		control,
		register,
		formState: { errors },
		setValue,
		getValues
	} = useFormContext<PostInfo>()
	const [newItems, setNewItems] = useState<Item[]>([])
	const [oldItems, setOldItems] = useState<Item[]>([])
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const handleAddItem = (data: {
		itemID: number
		name: string
		categoryID: number
		categoryName: string
		quantity: number
		image?: string
		althernativeImage?: string
		isOldItem: boolean
	}) => {
		const {
			itemID,
			name,
			categoryID,
			categoryName,
			quantity,
			image,
			althernativeImage,
			isOldItem
		} = data

		if (isOldItem) {
			const existingOldItemIndex = oldItems.findIndex(
				oldItem => oldItem.itemID === itemID
			)
			if (existingOldItemIndex !== -1) {
				const updatedOldItems = [...oldItems]
				updatedOldItems[existingOldItemIndex] = {
					itemID,
					name,
					categoryID,
					categoryName,
					quantity,
					image,
					althernativeImage
				}
				setOldItems(updatedOldItems)
				setValue('oldItems', updatedOldItems)
			} else {
				const newOldItem: Item = {
					itemID,
					name,
					categoryID,
					categoryName,
					quantity,
					image,
					althernativeImage
				}
				setOldItems(prev => [...prev, newOldItem])
				setValue('oldItems', [...(getValues('oldItems') || []), newOldItem])
			}
		} else {
			const existingNewItemIndex = newItems.findIndex(
				newItem => newItem.itemID === itemID
			)
			if (existingNewItemIndex !== -1) {
				const updatedNewItems = [...newItems]
				updatedNewItems[existingNewItemIndex] = {
					itemID,
					name,
					categoryID,
					categoryName,
					quantity,
					image,
					althernativeImage
				}
				setNewItems(updatedNewItems)
				setValue('newItems', updatedNewItems)
			} else {
				const newItem: Item = {
					itemID,
					name,
					categoryID,
					categoryName,
					quantity,
					image,
					althernativeImage
				}
				setNewItems(prev => [...prev, newItem])
				setValue('newItems', [...(getValues('newItems') || []), newItem])
			}
		}
	}

	const handleDeleteItem = (itemID: number) => {
		const isNewItem = newItems.some(item => item.itemID === itemID)
		if (isNewItem) {
			const updatedItems = newItems.filter(item => item.itemID !== itemID)
			setNewItems(updatedItems)
			setValue('newItems', updatedItems)
		} else {
			const updatedItems = oldItems.filter(item => item.itemID !== itemID)
			setOldItems(updatedItems)
			setValue('oldItems', updatedItems)
		}
	}

	const allItems = [
		...newItems.map(item => ({
			itemID: item.itemID,
			name: item.name,
			categoryName: item.categoryName,
			quantity: item.quantity,
			image: item.image,
			althernativeImage: item.althernativeImage,
			categoryID: item.categoryID
		})),
		...oldItems.map(item => ({
			itemID: item.itemID,
			name: item.name,
			categoryName: item.categoryName,
			quantity: item.quantity,
			image: item.image,
			althernativeImage: item.althernativeImage,
			categoryID: item.categoryID
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
				<h3 className='font-manrope text-foreground mb-2 text-2xl font-semibold'>
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
						Ví dụ: "Tặng áo thun cũ còn mới"
					</p>
				</div>
				<div className='space-y-2'>
					<div className='flex items-center justify-between'>
						<label className='text-foreground block text-sm font-medium'>
							Món đồ
						</label>
						<button
							onClick={() => setIsDialogOpen(true)}
							className='bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-2 py-1 transition-colors duration-200'
						>
							<Plus />
						</button>
					</div>
					<AnimatePresence>
						{allItems.length > 0 && (
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								transition={{ duration: 0.3 }}
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
						transition={{ duration: 0.3, delay: 0.1 }}
						className='text-muted-foreground mt-1 text-sm'
					>
						Bấm vào dấu "+" để thêm món đồ
					</motion.p>
				</div>
				<div className='space-y-2'>
					<Controller
						name='images'
						control={control}
						render={({ field }) => (
							<ImageUpload
								name='images'
								label='Hình ảnh'
								field={field}
								error={
									Array.isArray(errors.images)
										? errors.images[0]
										: errors.images
								}
								type='multiple'
								animationDelay={0.4}
							/>
						)}
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
						Ví dụ: "Áo thun màu xanh, size M, đã qua sử dụng nhưng còn mới 80%"
					</p>
				</div>
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
