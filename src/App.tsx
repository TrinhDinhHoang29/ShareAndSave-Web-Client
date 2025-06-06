// App.tsx
import { useEffect } from 'react'

import authApi from '@/apis/modules/auth.api'
import { getAccessToken, getRefreshToken } from '@/lib/token'
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
					// Gọi API getMe để lấy thông tin user
					const response = await authApi.getMe() // Response: { user: IUser }
					const user = response.data.user
					login({
						user,
						jwt: getAccessToken()!, // Lấy access token từ cookies
						refreshToken: getRefreshToken() || '' // Lấy refresh token từ cookies, mặc định '' nếu không có
					})
				} catch (error) {
					console.error('Failed to fetch user:', error)
					logout() // Đăng xuất nếu lấy thông tin user thất bại
				}
			}
			setAuthLoading(false) // Tắt loading sau khi hoàn tất
		}

		fetchUser()
	}, [isAuthenticated, user, login, logout, setAuthLoading])

	return (
		<AlertModalProvider>
			<AppRouter />
		</AlertModalProvider>
	)
}

export default App
