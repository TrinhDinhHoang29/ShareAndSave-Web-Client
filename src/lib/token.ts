import Cookies from 'js-cookie'

import authApi from '@/apis/modules/auth.api'

export const getAccessToken = () => Cookies.get('access_token')
export const setAccessToken = (token: string) =>
	Cookies.set('access_token', token, {
		expires: 4 / 24, // 4 giờ = 4/24 ngày
		path: '/', // Có hiệu lực trên toàn bộ domain
		secure: true, // Chỉ truyền qua HTTPS
		sameSite: 'strict' // Bảo vệ khỏi CSRF
	})
export const clearAccessToken = () => Cookies.remove('access_token')

export const getRefreshToken = () => Cookies.get('refresh_token')
export const setRefreshToken = (token: string) =>
	Cookies.set('refresh_token', token, {
		expires: 30, // 4 giờ = 4/24 ngày
		path: '/', // Có hiệu lực trên toàn bộ domain
		secure: true, // Chỉ truyền qua HTTPS
		sameSite: 'strict' // Bảo vệ khỏi CSRF
	})
export const clearRefreshToken = () => Cookies.remove('refresh_token')

export const getValidToken = async (): Promise<string | null> => {
	const accessToken = getAccessToken()

	// Nếu có access token, return luôn
	if (accessToken) {
		return accessToken
	}

	// Nếu không có access token, thử refresh
	const refreshToken = getRefreshToken()
	if (!refreshToken) {
		return null
	}

	try {
		console.log('WebSocket: Refreshing token...')
		const response = await authApi.refreshToken({ refreshToken })
		const newToken = response.data.jwt
		setAccessToken(newToken)
		return newToken
	} catch (error) {
		console.error('WebSocket: Failed to refresh token:', error)
		return null
	}
}
