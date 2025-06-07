// stores/authStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import authApi from '@/apis/modules/auth.api'
import {
	clearAccessToken,
	clearRefreshToken,
	getAccessToken,
	getRefreshToken,
	setAccessToken,
	setRefreshToken
} from '@/lib/token'
import { ILoginResponse, IUser } from '@/models/interfaces'

interface AuthState {
	user: IUser | null
	isAuthenticated: boolean
	isAuthLoading: boolean
	login: (data: ILoginResponse) => void
	logout: () => void
	setAuthLoading: (loading: boolean) => void
	syncAuthState: () => Promise<void> // Thêm phương thức đồng bộ trạng thái
}

const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			user: null,
			isAuthenticated: false, // Không dựa vào getAccessToken() ban đầu
			isAuthLoading: true,
			login: data => {
				setAccessToken(data.jwt)
				setRefreshToken(data.refreshToken)
				set({
					user: data.user,
					isAuthenticated: true
				})
			},
			logout: async () => {
				await authApi.logout()
				clearAccessToken()
				clearRefreshToken()
				set({
					user: null,
					isAuthenticated: false
				})
			},
			setAuthLoading: loading => set({ isAuthLoading: loading }),
			syncAuthState: async () => {
				const accessToken = getAccessToken()
				const refreshToken = getRefreshToken()
				if (!accessToken && !refreshToken) {
					set({ user: null, isAuthenticated: false })
					return
				}
				try {
					const response = await authApi.getMe() // Kiểm tra token bằng API
					set({
						user: response.data.user,
						isAuthenticated: true
					})
				} catch (error) {
					console.error('Sync auth failed:', error)
					clearAccessToken()
					clearRefreshToken()
					set({ user: null, isAuthenticated: false })
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
