import Cookies from 'js-cookie'

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
