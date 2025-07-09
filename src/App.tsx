import { useEffect } from 'react'

import AppRouter from '@/routes/index.route'

import { useScreenSize } from './hooks/useScreenSize'
import Dowload from './pages/dowload'
import useAuthStore from './stores/authStore'
import { useSettingsStore } from './stores/settingStore'

function App() {
	const { fetchSettings } = useSettingsStore()
	const { initializeAuth } = useAuthStore()
	const { isDesktop } = useScreenSize()

	useEffect(() => {
		fetchSettings()
	}, [fetchSettings])

	// Initialize auth state on app start
	useEffect(() => {
		initializeAuth()
	}, [initializeAuth])

	if (!isDesktop) {
		return <Dowload />
	}

	return <AppRouter />
}

export default App
