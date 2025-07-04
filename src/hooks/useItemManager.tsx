import { useCallback, useState } from 'react'
import { useFormContext } from 'react-hook-form'

import { IItemRequest } from '@/models/interfaces'

interface ItemData {
	itemID: number
	name: string
	categoryID: number
	categoryName: string
	quantity: number
	image?: string
	alternativeImage?: string
	isOldItem: boolean
}

interface UseItemManagerProps {
	newItemsFieldName?: string
	oldItemsFieldName?: string
}

export const useItemManager = ({
	newItemsFieldName = 'newItems',
	oldItemsFieldName = 'oldItems'
}: UseItemManagerProps = {}) => {
	const { setValue } = useFormContext()
	const [newItems, setNewItems] = useState<IItemRequest[]>([])
	const [oldItems, setOldItems] = useState<IItemRequest[]>([])
	const [isDialogOpen, setIsDialogOpen] = useState(false)

	const handleAddItem = useCallback(
		(data: ItemData) => {
			const {
				itemID,
				name,
				categoryID,
				categoryName,
				quantity,
				image,
				alternativeImage,
				isOldItem
			} = data

			const itemToAdd: IItemRequest = {
				itemID,
				name,
				categoryID,
				categoryName,
				quantity,
				image,
				alternativeImage
			}

			if (isOldItem) {
				setOldItems(prev => {
					const existingIndex = prev.findIndex(item => item.itemID === itemID)
					let updatedItems: IItemRequest[]

					if (existingIndex !== -1) {
						updatedItems = [...prev]
						updatedItems[existingIndex] = itemToAdd
					} else {
						updatedItems = [...prev, itemToAdd]
					}

					setValue(oldItemsFieldName, updatedItems)
					return updatedItems
				})
			} else {
				setNewItems(prev => {
					const existingIndex = prev.findIndex(item => item.itemID === itemID)
					let updatedItems: IItemRequest[]

					if (existingIndex !== -1) {
						updatedItems = [...prev]
						updatedItems[existingIndex] = itemToAdd
					} else {
						updatedItems = [...prev, itemToAdd]
					}

					setValue(newItemsFieldName, updatedItems)
					return updatedItems
				})
			}
		},
		[setValue, newItemsFieldName, oldItemsFieldName]
	)

	const handleDeleteItem = useCallback(
		(itemID: number) => {
			const isNewItem = newItems.some(item => item.itemID === itemID)

			if (isNewItem) {
				setNewItems(prev => {
					const updatedItems = prev.filter(item => item.itemID !== itemID)
					setValue(newItemsFieldName, updatedItems)
					return updatedItems
				})
			} else {
				setOldItems(prev => {
					const updatedItems = prev.filter(item => item.itemID !== itemID)
					setValue(oldItemsFieldName, updatedItems)
					return updatedItems
				})
			}
		},
		[newItems, setValue, newItemsFieldName, oldItemsFieldName]
	)

	const allItems = [
		...newItems.map(item => ({
			itemID: item.itemID,
			name: item.name,
			categoryName: item.categoryName,
			quantity: item.quantity,
			image: item.image,
			alternativeImage: item.alternativeImage,
			categoryID: item.categoryID
		})),
		...oldItems.map(item => ({
			itemID: item.itemID,
			name: item.name,
			categoryName: item.categoryName,
			quantity: item.quantity,
			image: item.image,
			alternativeImage: item.alternativeImage,
			categoryID: item.categoryID
		}))
	]

	const openDialog = useCallback(() => setIsDialogOpen(true), [])
	const closeDialog = useCallback(() => setIsDialogOpen(false), [])

	// Reset functions
	const resetItems = useCallback(() => {
		setNewItems([])
		setOldItems([])
		setValue(newItemsFieldName, [])
		setValue(oldItemsFieldName, [])
	}, [setValue, newItemsFieldName, oldItemsFieldName])

	return {
		// State
		newItems,
		oldItems,
		allItems,
		isDialogOpen,

		// Actions
		handleAddItem,
		handleDeleteItem,
		openDialog,
		closeDialog,
		resetItems,

		// Setters for advanced usage
		setNewItems,
		setOldItems
	}
}
