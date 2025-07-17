import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import authApi from '@/apis/modules/auth.api'
import { ILoginResponse, IUser } from '@/models/interfaces'

interface AuthState {
	user: IUser | null
	isAuthenticated: boolean
	accessToken: string | null
	refreshToken: string | null

	// Actions
	login: (data: ILoginResponse) => void
	logout: () => void
	setTokens: (accessToken: string, refreshToken?: string) => void
	clearTokens: () => void
	fetchUserProfile: () => Promise<void>
	initializeAuth: () => Promise<void>
}

const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			user: null,
			isAuthenticated: false,
			accessToken: null,
			refreshToken: null,

			login: data => {
				set({
					user: data.user,
					isAuthenticated: true,
					accessToken: data.jwt,
					refreshToken: data.refreshToken
				})
			},

			logout: async () => {
				try {
					await authApi.logout()
				} catch (error) {
					console.error('Logout API failed:', error)
				}

				set({
					user: null,
					isAuthenticated: false,
					accessToken: null,
					refreshToken: null
				})
			},

			setTokens: (accessToken, refreshToken) => {
				set(state => ({
					accessToken,
					refreshToken: refreshToken || state.refreshToken
				}))
			},

			clearTokens: () => {
				set({
					user: null,
					isAuthenticated: false,
					accessToken: null,
					refreshToken: null
				})
			},

			fetchUserProfile: async () => {
				const { accessToken } = get()
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
					set({
						user: null,
						isAuthenticated: false,
						accessToken: null,
						refreshToken: null
					})
					throw error
				}
			},

			// Initialize auth state on app start
			initializeAuth: async () => {
				const accessToken = get().accessToken

				if (accessToken) {
					set({ isAuthenticated: true })
					// Optionally fetch user profile
					try {
						await get().fetchUserProfile()
					} catch (error) {
						console.error(
							'Failed to fetch user profile during initialization:',
							error
						)
					}
				} else {
					set({
						user: null,
						isAuthenticated: false,
						accessToken: null,
						refreshToken: null
					})
				}
			}
		}),
		{
			name: 'auth-store',
			partialize: state => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated,
				accessToken: state.accessToken,
				refreshToken: state.refreshToken
			})
		}
	)
)

export default useAuthStore
