import { ReactNode, useEffect, useRef } from 'react'

import { useAuthDialog } from '@/context/auth-dialog-context'
import useAuthStore from '@/stores/authStore'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated } = useAuthStore()
	const { openDialog } = useAuthDialog()
	const hasOpenedDialog = useRef(false) // Flag để kiểm soát việc mở dialog

	useEffect(() => {
		if (!isAuthenticated && !hasOpenedDialog.current) {
			console.log('Opening dialog for authentication')
			openDialog({}) // Mở dialog chỉ khi chưa mở trước đó
			hasOpenedDialog.current = true // Đánh dấu đã mở
		}
	}, [isAuthenticated, openDialog]) // Dependency array đầy đủ

	if (isAuthenticated) return children
	return null // Hoặc một placeholder nếu cần
}

export default PrivateRoute
