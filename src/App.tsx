import { useEffect } from 'react'

import AppRouter from '@/routes/index.route'

import { useScreenSize } from './hooks/useScreenSize'
import { getAccessToken, getRefreshToken } from './lib/token'
import Dowload from './pages/dowload'
import useAuthStore from './stores/authStore'
import { useSettingsStore } from './stores/settingStore'

function App() {
	const { fetchSettings } = useSettingsStore()
	const { isDesktop } = useScreenSize()

	useEffect(() => {
		fetchSettings()
	}, [fetchSettings])

	// Chỉ check nếu có token trong localStorage để restore UI state
	useEffect(() => {
		const accessToken = getAccessToken()
		const refreshToken = getRefreshToken()

		if (accessToken || refreshToken) {
			useAuthStore.setState({
				isAuthenticated: true
			})
		} else {
			useAuthStore.setState({
				user: null,
				isAuthenticated: false
			})
		}
	}, [])

	if (!isDesktop) {
		return <Dowload />
	}

	return <AppRouter />
}

export default App
