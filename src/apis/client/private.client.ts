import axios from 'axios'

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
		const token = useAuthStore.getState().accessToken
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

		// Chỉ handle 401 error
		if (error.response?.status === 401 && !originalRequest._retry) {
			const errorMessage = error.response.data?.message || ''

			// Check duplicate login
			const isDuplicate = errorMessage.includes(
				'Có ai đó đã đăng nhập trên cùng loại thiết bị'
			)

			const isRedisNull = errorMessage.includes(
				'Có lỗi khi kiểm tra version JWT: redis: nil'
			)

			if (isDuplicate) {
				useAuthStore.getState().clearTokens()
				window.location.href = '/phien-dang-nhap'
				return Promise.reject(error)
			}

			if (isRedisNull) {
				useAuthStore.getState().clearTokens()
				return Promise.reject(error)
			}

			originalRequest._retry = true

			try {
				const refreshToken = useAuthStore.getState().refreshToken
				if (!refreshToken) {
					useAuthStore.getState().clearTokens()
					throw new Error('No refresh token available')
				}

				// Refresh token
				const response = await authApi.refreshToken({ refreshToken })
				const jwt = response.data.jwt

				// Update tokens in store
				useAuthStore.getState().setTokens(jwt)

				// Retry original request
				originalRequest.headers.Authorization = `Bearer ${jwt}`
				return axiosPrivate(originalRequest)
			} catch (refreshError) {
				// Refresh failed - clear auth state
				console.error('Token refresh failed:', refreshError)
				useAuthStore.getState().clearTokens()
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error.response?.data || error)
	}
)

export default axiosPrivate
