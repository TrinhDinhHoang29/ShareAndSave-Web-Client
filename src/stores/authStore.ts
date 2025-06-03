// stores/authStore.ts
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
	isAuthLoading: boolean
	login: (data: ILoginResponse) => void
	logout: () => void
	setAuthLoading: (loading: boolean) => void
}

const useAuthStore = create<AuthState>()(
	persist(
		set => ({
			user: null,
			isAuthenticated: !!getAccessToken(),
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
			setAuthLoading: loading => set({ isAuthLoading: loading })
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
