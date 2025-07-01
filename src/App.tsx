import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import AppRouter from '@/routes/index.route'

import authApi from './apis/modules/auth.api'
import { useScreenSize } from './hooks/useScreenSize' // Import hook
import {
	clearAccessToken,
	clearRefreshToken,
	getAccessToken,
	getRefreshToken,
	setAccessToken
} from './lib/token'
import Dowload from './pages/dowload'
import useAuthStore from './stores/authStore'
import { useSettingsStore } from './stores/settingStore'

function App() {
	const { login, logout, setAuthLoading, syncAuthState } = useAuthStore()
	const navigate = useNavigate()
	const { fetchSettings } = useSettingsStore()
	const { isDesktop } = useScreenSize() // Sử dụng hook

	useEffect(() => {
		fetchSettings()
	}, [fetchSettings])

	useEffect(() => {
		let isMounted = true

		const initializeAuth = async () => {
			setAuthLoading(true)
			try {
				const accessToken = getAccessToken()
				const refreshToken = getRefreshToken()
				if (accessToken) {
					await syncAuthState()
				} else if (refreshToken) {
					const response = await authApi.refreshToken({ refreshToken })
					const jwt = response.data.jwt
					setAccessToken(jwt)
					await syncAuthState()
				} else {
					useAuthStore.setState({ user: null, isAuthenticated: false })
				}
			} catch (error) {
				console.error('Auth initialization failed:', error)
				useAuthStore.setState({ user: null, isAuthenticated: false })
				clearAccessToken()
				clearRefreshToken()
				navigate('/')
			} finally {
				if (isMounted) {
					setAuthLoading(false)
				}
			}
		}

		initializeAuth()

		return () => {
			isMounted = false
		}
	}, [login, logout, setAuthLoading, syncAuthState])

	// 🎯 Điều kiện hiển thị
	if (!isDesktop) {
		return <Dowload />
	}

	return <AppRouter />
}

export default App
