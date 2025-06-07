// App.tsx
import { useEffect } from 'react'

import AppRouter from '@/routes/index.route'

import useAuthStore from './stores/authStore'

function App() {
	const {
		isAuthenticated,
		user,
		login,
		logout,
		setAuthLoading,
		syncAuthState
	} = useAuthStore()

	useEffect(() => {
		const initializeAuth = async () => {
			setAuthLoading(true)
			try {
				await syncAuthState() // Đồng bộ trạng thái auth với token
			} catch (error) {
				console.error('Auth initialization failed:', error)
				logout() // Đăng xuất nếu đồng bộ thất bại
			} finally {
				setAuthLoading(false)
			}
		}

		initializeAuth()
	}, [login, logout, setAuthLoading, syncAuthState])

	return <AppRouter />
}

export default App
