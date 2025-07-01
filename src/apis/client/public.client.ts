import axios from 'axios'

import { getDeviceId, getDeviceType } from '@/lib/utils'

const axiosPublic = axios.create({
	baseURL: import.meta.env.VITE_API_URL, // Địa chỉ API public
	timeout: 1000000,
	headers: {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		charset: 'UTF-8',
		'Device-Type': getDeviceType(), // Lấy động Device-Type
		'Device-ID': getDeviceId() // Lấy động Device-ID
	}
})

// Thêm interceptor nếu cần (tùy chọn)
axiosPublic.interceptors.response.use(
	response => response.data, // Xử lý khi thành công
	error => {
		if (error.response) {
			// Lỗi từ server, có mã status
			console.error(`API error: ${error.response.status}`, error.response.data)
			return Promise.reject(error.response.data)
		} else if (error.request) {
			// Lỗi do không nhận được phản hồi
			console.error('No response received:', error.request)
			return Promise.reject(error.request)
		} else {
			// Lỗi trong quá trình cấu hình request
			console.error('Error in request setup:', error.message)
			return Promise.reject(error.message)
		}
	}
)

export default axiosPublic
