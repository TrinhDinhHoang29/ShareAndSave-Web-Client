import { createContext, useContext, useEffect, useState } from 'react'

import { clearAccessToken, getAccessToken, setAccessToken } from '@/lib/token'
import { IUser } from '@/models/interfaces'

// Update context type to include login and user
interface AuthContextType {
	isAuthenticated: boolean
	isAuthLoading: boolean
	logout: () => void
	login: (token: string, userData: IUser) => void
	user: IUser | null
}

const AuthContext = createContext<AuthContextType>({
	isAuthenticated: false,
	isAuthLoading: true,
	logout: () => {},
	login: () => {},
	user: null
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken())
	const [isAuthLoading, setIsAuthLoading] = useState(true)
	const [user, setUser] = useState<IUser | null>(null)

	const login = (JWT: string, userData: IUser) => {
		setAccessToken(JWT)
		setUser(userData)
		setIsAuthenticated(true)
	}

	const logout = () => {
		clearAccessToken()
		setUser(null)
		setIsAuthenticated(false)
	}

	useEffect(() => {
		const token = getAccessToken()
		// You might want to add logic to fetch user data if token exists
		// For example, make an API call to get user profile
		setIsAuthenticated(!!token)
		setIsAuthLoading(false)
	}, [])

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated,
				isAuthLoading,
				logout,
				login,
				user
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => {
	const authContext = useContext(AuthContext)

	if (!authContext) {
		throw new Error('useAuth has to be used within <AuthContext.Provider>')
	}

	return authContext
}
