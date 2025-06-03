import { useEffect } from 'react'

import AppRouter from '@/routes/index.route'

import { AlertModalProvider } from './context/alert-modal-context'
import useAuthStore from './stores/authStore'

function App() {
	const { isAuthenticated, user, login, logout, setAuthLoading } =
		useAuthStore()

	useEffect(() => {
		const fetchUser = async () => {
			if (isAuthenticated && !user) {
				try {
					// const me = await getMe()
					// login({ user: me, jwt: getAccessToken()!, refreshToken: '' }) // hoặc bỏ refreshToken nếu không dùng
				} catch {
					logout()
				}
			}
			setAuthLoading(false)
		}

		fetchUser()
	}, [])

	return (
		<AlertModalProvider>
			<AppRouter />
		</AlertModalProvider>
	)
}

export default App
