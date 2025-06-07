import { ReactNode, useEffect, useRef } from 'react'

import Loading from '@/components/common/Loading'
import { useAuthDialog } from '@/context/auth-dialog-context'
import useAuthStore from '@/stores/authStore'

const PrivateRoute = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated, isAuthLoading } = useAuthStore()
	const { openDialog } = useAuthDialog()
	const hasOpenedDialog = useRef(false) // Flag để kiểm soát việc mở dialog

	useEffect(() => {
		if (!isAuthLoading && !isAuthenticated && !hasOpenedDialog.current) {
			console.log('Opening dialog for authentication')
			openDialog({}) // Mở dialog chỉ khi chưa mở trước đó
			hasOpenedDialog.current = true // Đánh dấu đã mở
		}
	}, [isAuthLoading, isAuthenticated, openDialog]) // Dependency array đầy đủ

	if (isAuthLoading) {
		return (
			<div className='flex h-full w-full items-center justify-center'>
				<Loading />
			</div>
		)
	}

	if (isAuthenticated) return children
	return null // Hoặc một placeholder nếu cần
}

export default PrivateRoute
