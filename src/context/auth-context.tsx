import { createContext, useContext, useEffect, useState } from 'react'

import { clearAccessToken, getAccessToken } from '@/lib/token'

const AuthContext = createContext<{
	isAuthenticated: boolean
	logout: () => void
	isAuthLoading: boolean
}>({ isAuthenticated: false, isAuthLoading: true, logout: () => {} })

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(!!getAccessToken())
	const [isAuthLoading, setIsAuthLoading] = useState(true)

	const logout = () => {
		clearAccessToken()
		setIsAuthenticated(false)
	}

	useEffect(() => {
		const token = getAccessToken()
		setIsAuthenticated(!!token)
		setIsAuthLoading(false)
		setIsAuthenticated(!!getAccessToken())
	}, [])

	return (
		<AuthContext.Provider value={{ isAuthenticated, isAuthLoading, logout }}>
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
