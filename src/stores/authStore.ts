import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'access_token'

interface AuthUser {
	id: string
	email: string
	role: string[]
}

interface AuthState {
	user: AuthUser | null
	accessToken: string | null
	setUser: (user: AuthUser | null) => void
	setAccessToken: (token: string | null) => void
	reset: () => void
}

export const useAuthStore = create<AuthState>(set => ({
	user: null,
	accessToken: Cookies.get(ACCESS_TOKEN) || null,
	setUser: user => set({ user }),
	setAccessToken: token => {
		if (token) {
			Cookies.set(ACCESS_TOKEN, token)
		} else {
			Cookies.remove(ACCESS_TOKEN)
		}
		set({ accessToken: token })
	},
	reset: () => {
		Cookies.remove(ACCESS_TOKEN)
		set({ user: null, accessToken: null })
	}
}))
