import axios from 'axios'

import {
	clearAccessToken,
	clearRefreshToken,
	getAccessToken,
	getRefreshToken,
	setAccessToken,
	setRefreshToken
} from '@/lib/token'

import authApi from '../modules/auth.api'

// Tạo instance axios
const axiosPrivate = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 1000000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		'ngrok-skip-browser-warning': 'true'
	}
})

// Request Interceptor: Thêm Access Token vào header
axiosPrivate.interceptors.request.use(
	config => {
		const token = getAccessToken() // Sử dụng hàm từ module của bạn
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

// Response Interceptor: Xử lý authentication và authorization
axiosPrivate.interceptors.response.use(
	response => response.data, // Thành công
	async error => {
		const originalRequest = error.config

		// Xử lý lỗi Authentication (401 Unauthorized)
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true // Đánh dấu request đã retry để tránh vòng lặp vô hạn

			try {
				const refreshToken = getRefreshToken() // Lấy refresh token
				if (!refreshToken) {
					throw new Error('No refresh token available')
				}

				// Gọi API refresh token
				const response = await authApi.refreshToken({ refreshToken })

				const jwt = response.data.jwt
				setAccessToken(jwt) // Lưu access token mới
				setRefreshToken(jwt) // Giả sử API trả về refresh token mới trong jwt, nếu không thì bỏ dòng này

				// Cập nhật header của request gốc với token mới
				originalRequest.headers.Authorization = `Bearer ${jwt}`

				// Thực hiện lại request gốc
				return axiosPrivate(originalRequest)
			} catch (refreshError) {
				console.error('Refresh token failed:', refreshError)
				clearAccessToken() // Xóa access token
				clearRefreshToken() // Xóa refresh token
				return Promise.reject(refreshError)
			}
		}

		// Các lỗi khác
		console.error('Response error:', error)
		return Promise.reject(error)
	}
)

export default axiosPrivate
