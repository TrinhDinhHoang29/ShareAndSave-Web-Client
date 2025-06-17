import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import AppRouter from '@/routes/index.route'

import { getAccessToken } from './lib/token'
import useAuthStore from './stores/authStore'

function App() {
	const { login, logout, setAuthLoading, syncAuthState } = useAuthStore()
	const navigate = useNavigate()

	useEffect(() => {
		let isMounted = true // Flag để tránh setState sau khi unmount

		const initializeAuth = async () => {
			setAuthLoading(true)
			try {
				// Chỉ gọi syncAuthState nếu có token
				const accessToken = getAccessToken()
				if (accessToken) {
					await syncAuthState()
				} else {
					useAuthStore.setState({ user: null, isAuthenticated: false }) // Sử dụng setState từ store
				}
			} catch (error) {
				console.error('Auth initialization failed:', error)
				logout() // Đăng xuất nếu đồng bộ thất bại
				navigate('/')
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
