import { useState } from 'react'

import InterestListDialog from '@/pages/post-detail/components/InterestListDialog'

export const useInterestListDialog = () => {
	const [isOpen, setIsOpen] = useState(false)

	const openDialog = () => setIsOpen(true)
	const closeDialog = () => setIsOpen(false)

	return {
		isOpen,
		openDialog,
		closeDialog,
		DialogComponent: InterestListDialog
	}
}
