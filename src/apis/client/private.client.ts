// axiosPrivate.ts
import axios from 'axios'

import {
	clearAccessToken,
	clearRefreshToken,
	getAccessToken,
	getRefreshToken,
	setAccessToken
} from '@/lib/token'
import useAuthStore from '@/stores/authStore'

import authApi from '../modules/auth.api'

const axiosPrivate = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 1000000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'ngrok-skip-browser-warning': 'true'
	}
})

// Request Interceptor
axiosPrivate.interceptors.request.use(
	config => {
		const token = getAccessToken()
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => {
		console.error('Request error:', error)
		return Promise.reject(error)
	}
)

// Response Interceptor
axiosPrivate.interceptors.response.use(
	response => response.data,
	async error => {
		const originalRequest = error.config
		const { setAuthLoading, logout } = useAuthStore.getState()

		if (error.response?.status === 401 && !originalRequest._retry) {
			const isDuplicate =
				error.response.data.message ===
				'Có ai đó đã đăng nhập trên cùng loại thiết bị, hoặc đổi mật khẩu'
			if (isDuplicate) {
				clearAccessToken()
				clearRefreshToken()
				window.location.href = '/phien-dang-nhap'
				return Promise.reject(error)
			}

			originalRequest._retry = true

			try {
				setAuthLoading(true)
				const refreshToken = getRefreshToken()
				if (!refreshToken) {
					throw new Error('No refresh token available')
				}

				const response = await authApi.refreshToken({ refreshToken })
				const jwt = response.data.jwt
				console.log('new jwt', jwt)
				setAccessToken(jwt)

				originalRequest.headers.Authorization = `Bearer ${jwt}`
				return axiosPrivate(originalRequest)
			} catch (refreshError) {
				console.error('Refresh token failed:', refreshError)
				logout() // Cập nhật trạng thái auth khi refresh thất bại
				return Promise.reject(refreshError)
			} finally {
				setAuthLoading(false)
			}
		}

		console.error(
			'Response error:',
			error.response?.data?.message || error.message
		)
		return Promise.reject(error)
	}
)

export default axiosPrivate
