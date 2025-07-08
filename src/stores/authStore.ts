import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import authApi from '@/apis/modules/auth.api'
import {
	clearAccessToken,
	clearRefreshToken,
	getAccessToken,
	setAccessToken,
	setRefreshToken
} from '@/lib/token'
import { ILoginResponse, IUser } from '@/models/interfaces'

interface AuthState {
	user: IUser | null
	isAuthenticated: boolean
	login: (data: ILoginResponse) => void
	logout: () => void
	// Chỉ call khi cần thiết (ví dụ sau khi login thành công)
	fetchUserProfile: () => Promise<void>
}

const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			user: null,
			isAuthenticated: false,

			login: data => {
				setAccessToken(data.jwt)
				setRefreshToken(data.refreshToken)
				set({
					user: data.user,
					isAuthenticated: true
				})
			},

			logout: async () => {
				try {
					await authApi.logout()
				} catch (error) {
					console.error('Logout API failed:', error)
				}
				clearAccessToken()
				clearRefreshToken()
				set({
					user: null,
					isAuthenticated: false
				})
			},

			// Chỉ call khi cần thiết
			fetchUserProfile: async () => {
				const accessToken = getAccessToken()
				if (!accessToken) {
					set({ user: null, isAuthenticated: false })
					return
				}

				try {
					const response = await authApi.getMe()
					set({
						user: response.data.user,
						isAuthenticated: true
					})
				} catch (error) {
					console.error('Fetch user profile failed:', error)
					clearAccessToken()
					clearRefreshToken()
					set({ user: null, isAuthenticated: false })
					throw error
				}
			}
		}),
		{
			name: 'auth-store',
			partialize: state => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated
			})
		}
	)
)

export default useAuthStore
