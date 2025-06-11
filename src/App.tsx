import { useEffect } from 'react'

import AppRouter from '@/routes/index.route'

import { getAccessToken } from './lib/token'
import useAuthStore from './stores/authStore'

function App() {
	const { login, logout, setAuthLoading, syncAuthState } = useAuthStore()

	useEffect(() => {
		let isMounted = true // Flag để tránh setState sau khi unmount

		const initializeAuth = async () => {
			setAuthLoading(true)
			try {
				// Chỉ gọi syncAuthState nếu có token
				const accessToken = getAccessToken() // Giả sử token được lưu trong localStorage
				if (accessToken) {
					await syncAuthState()
				} else {
					console.log('chay vao day')
					useAuthStore.setState({ user: null, isAuthenticated: false }) // Sử dụng setState từ store
				}
			} catch (error) {
				console.error('Auth initialization failed:', error)
				logout() // Đăng xuất nếu đồng bộ thất bại
			} finally {
				if (isMounted) {
					setAuthLoading(false)
				}
			}
		}

		initializeAuth()

		// Cleanup
		return () => {
			isMounted = false
		}
	}, [login, logout, setAuthLoading, syncAuthState])

	return <AppRouter />
}

export default App
