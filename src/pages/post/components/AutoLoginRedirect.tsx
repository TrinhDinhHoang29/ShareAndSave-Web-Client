import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/auth-context'
import { IPostResponse } from '@/models/interfaces'

interface AutoLoginRedirectProps {
	info: IPostResponse
}

const AutoLoginRedirect: React.FC<AutoLoginRedirectProps> = ({ info }) => {
	const navigate = useNavigate()
	const { login } = useAuth()
	const timeRedirect = 5000 // Thời gian đếm ngược (5 giây)

	const [timeLeft, setTimeLeft] = useState<number>(timeRedirect / 1000) // Thời gian còn lại (tính bằng giây)

	useEffect(() => {
		// Cập nhật thời gian đếm ngược
		const timer = setInterval(() => {
			setTimeLeft(prevTime => {
				if (prevTime <= 1) {
					clearInterval(timer) // Dừng timer khi thời gian hết
					return 0
				}
				return prevTime - 1
			})
		}, 1000) // Giảm 1 giây mỗi lần

		// Thực hiện đăng nhập khi thời gian hết
		const autoLogin = async () => {
			try {
				if (info.JWT) {
					await new Promise(resolve => setTimeout(resolve, timeRedirect)) // Đợi đủ timeRedirect
					login(info.JWT, info.user)
					navigate('/') // Chuyển hướng sau khi đăng nhập
				} else {
					throw new Error('No token found')
				}
			} catch (error) {
				console.error('Auto login failed:', error)
			}
		}

		autoLogin()

		// Dọn dẹp timer khi component unmount
		return () => clearInterval(timer)
	}, [navigate, login, info])

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className='flex min-h-[400px] flex-col items-center justify-center px-6 text-center'
		>
			<motion.div
				initial={{ rotate: 0 }}
				animate={{ rotate: 360 }}
				transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
				className='mb-6'
			>
				<Loader2
					size={60}
					className='text-primary'
				/>
			</motion.div>

			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
				className='text-foreground mb-4 text-2xl font-bold'
			>
				Đang tự động đăng nhập sau {timeLeft} giây...
			</motion.h2>

			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className='text-muted-foreground max-w-md text-center text-sm'
			>
				<span>
					Chúng tôi đang đăng nhập và chuyển bạn đến trang lịch sử bài đăng
				</span>
				<br />
				<span>Vui lòng giữ nguyên và chờ trong giây lát</span>
			</motion.p>
		</motion.div>
	)
}

export default AutoLoginRedirect
