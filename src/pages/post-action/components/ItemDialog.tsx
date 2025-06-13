import { Dialog, Transition } from '@headlessui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { Fragment, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

import ImageUpload from '@/components/common/ImageUpload'
import InputNumber from '@/components/common/InputNumber'
import InputSearchAutoComplete from '@/components/common/inputSearchAutoComplete'
import Selection from '@/components/common/Selection'
import { useCategoriesQuery } from '@/hooks/queries/use-category-query'
import { useItemSuggestionsQuery } from '@/hooks/queries/use-item-query'
import useDebounce from '@/hooks/use-debounce'
import { ICategory, IItemSuggestion } from '@/models/interfaces'

const itemSchema = z.object({
	name: z.string().min(1, 'Tên không được để trống'),
	categoryID: z.number().min(1, 'Vui lòng chọn danh mục'),
	quantity: z.number().min(1, 'Số lượng phải lớn hơn 0'),
	image: z
		.string()
		.optional()
		.refine(
			val => {
				if (!val) return true
				const isWebp = val.includes('image/webp') || val.endsWith('.webp')
				return !isWebp
			},
			{
				message: 'Không chấp nhận ảnh định dạng .webp'
			}
		)
})

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
		image?: string
	}) => void
	existingItems: {
		itemID: number
		name: string
		categoryID: number
		categoryName: string
		quantity: number
		image?: string
	}[]
}

interface FormData {
	name: string
	categoryID: number
	quantity: number
	image?: string
}

const ItemDialog: React.FC<ItemDialogProps> = ({
	isOpen,
	onClose,
	onAdd,
	existingItems
}) => {
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		reset,
		control,
		formState: { errors }
	} = useForm<FormData>({
		resolver: zodResolver(itemSchema),
		defaultValues: {
			name: '',
			categoryID: 0,
			quantity: 1,
			image: undefined
		}
	})

	const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
	const [selectedSuggestion, setSelectedSuggestion] =
		useState<IItemSuggestion | null>(null)
	const name = watch('name')
	const debouncedName = useDebounce(name, 300)

	const { data: categories, isLoading: isCategoriesLoading } =
		useCategoriesQuery()
	const { data: suggestions = [], isLoading: isSuggestionsLoading } =
		useItemSuggestionsQuery({
			searchBy: 'name',
			searchValue: debouncedName
		})

	const handleSelectSuggestion = (suggestion: IItemSuggestion | null) => {
		if (suggestion) {
			setValue('name', suggestion.name)
			setValue('categoryID', suggestion.categoryID)
			setSelectedItemId(suggestion.id)
			setSelectedSuggestion(suggestion)
		} else {
			setSelectedItemId(null)
			setSelectedSuggestion(null)
			setValue('categoryID', 0)
		}
	}

	const onSubmit = (data: FormData) => {
		const categoryName =
			categories?.find((c: ICategory) => c.id === data.categoryID)?.name || ''
		const isOldItem = !!selectedItemId
		const itemID = selectedItemId || Math.floor(Math.random() * 1000000)

		const item = {
			itemID,
			name: data.name,
			categoryID: data.categoryID,
			categoryName,
			quantity: data.quantity,
			isOldItem,
			image: data.image
		}

		const existingItem = existingItems.find(
			existing => existing.itemID === itemID
		)
		if (existingItem) {
			const newQuantity = existingItem.quantity + data.quantity
			onAdd({ ...item, quantity: newQuantity })
		} else {
			onAdd(item)
		}

		// Reset form and close dialog
		reset()
		setSelectedItemId(null)
		setSelectedSuggestion(null)
		onClose() // Đóng dialog ngay sau submit
	}

	// Reset form and state when dialog closes
	useEffect(() => {
		if (!isOpen) {
			reset()
			setSelectedItemId(null)
			setSelectedSuggestion(null)
		}
	}, [isOpen, reset])

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
								<form
									onSubmit={handleSubmit(onSubmit)}
									className='mt-4 space-y-4'
								>
									<InputSearchAutoComplete
										name='name'
										label='Tên món đồ *'
										placeholder='Nhập tên món đồ'
										register={register}
										setValue={setValue}
										error={errors.name}
										suggestions={suggestions}
										isSuggestionsLoading={isSuggestionsLoading}
										onSelectSuggestion={handleSelectSuggestion}
										animationDelay={0.1}
									/>
									<Selection
										name='categoryID'
										label='Danh mục *'
										options={categories || []}
										isLoading={isCategoriesLoading}
										register={register}
										error={errors.categoryID}
										disabled={!!selectedItemId}
										animationDelay={0.2}
										defaulTextOption='danh mục'
									/>
									<InputNumber
										name='quantity'
										label='Số lượng *'
										register={register}
										error={errors.quantity}
										min={1}
										animationDelay={0.3}
									/>
									<Controller
										name='image'
										control={control}
										render={({ field }) => (
											<ImageUpload
												name='image'
												label='Hình ảnh'
												field={field}
												error={errors.image}
												type='single'
												animationDelay={0.4}
											/>
										)}
									/>
									<div className='mt-6 flex justify-end gap-2'>
										<button
											type='button'
											onClick={onClose}
											className='border-border text-muted-foreground hover:bg-muted rounded-md border px-4 py-2 transition-colors'
										>
											Hủy
										</button>
										<button
											type='submit'
											disabled={isSuggestionsLoading || isCategoriesLoading}
											className='rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:bg-gray-800 disabled:text-gray-400'
										>
											Xác nhận
										</button>
									</div>
								</form>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}

export default ItemDialog
