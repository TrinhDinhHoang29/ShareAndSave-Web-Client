import { motion } from 'framer-motion'
import { CheckCircle, RotateCcw } from 'lucide-react'
import React from 'react'

import PrimaryButton from '@/components/common/PrimaryButton'

interface MyThankProps {
	onReset: () => void
	email?: string
}

const MyThank: React.FC<MyThankProps> = ({ onReset, email }) => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: 'easeOut' }}
			className='flex min-h-[400px] flex-col items-center justify-center px-6 text-center'
		>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{
					delay: 0.2,
					duration: 0.5,
					type: 'spring',
					stiffness: 200
				}}
				className='mb-6'
			>
				<CheckCircle
					size={80}
					className='mx-auto text-green-500'
				/>
			</motion.div>

			<motion.h2
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4, duration: 0.5 }}
				className='text-foreground mb-4 text-2xl font-bold'
			>
				Cảm ơn bạn đã đăng bài!
			</motion.h2>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6, duration: 0.5 }}
				className='text-muted-foreground mb-6 max-w-md'
			>
				<p className='mb-2'>Bài đăng của bạn đã được gửi thành công.</p>
				{email && (
					<p className='text-sm'>
						Chúng tôi sẽ gửi thông báo cập nhật về bài đăng đến email{' '}
						<span className='text-primary font-medium'>{email}</span>
					</p>
				)}
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8, duration: 0.5 }}
				className='space-y-4'
			>
				<div className='bg-muted/50 text-muted-foreground rounded-lg p-4 text-sm'>
					<p>
						• Vui lòng kiểm tra email để nhận thông báo trong vòng 24 giờ tới
					</p>
					<p>• Kiểm tra trạng thái bài đăng trong mục "Bài đăng của tôi"</p>
					<p>• Liên hệ hotline nếu cần hỗ trợ thêm</p>
				</div>

				<div className='flex justify-center'>
					<PrimaryButton
						onClick={onReset}
						icon={<RotateCcw size={18} />}
						positionIcon='left'
						className='w-full sm:w-auto'
					>
						Đăng bài khác
					</PrimaryButton>
				</div>
			</motion.div>
		</motion.div>
	)
}

export default MyThank
