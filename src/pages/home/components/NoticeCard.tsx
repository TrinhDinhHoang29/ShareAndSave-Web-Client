import { AnimatePresence, motion } from 'framer-motion'
import { TriangleAlert } from 'lucide-react'
import React, { useState } from 'react'

const NoticeCard: React.FC = () => {
	const [isVisible, setIsVisible] = useState(true)

	const handleClose = () => {
		setIsVisible(false)
	}

	const bannerVariants = {
		initial: { opacity: 0, y: -20 },
		animate: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.5, ease: 'easeOut' }
		},
		exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } }
	}

	const iconVariants = {
		animate: {
			scale: [1, 1.1, 1],
			transition: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
		}
	}

	return (
		<AnimatePresence>
			{isVisible && (
				<div className='container'>
					<motion.div
						className='from-primary/10 to-primary/20 text-primary/90 border-pr relative mb-4 flex rounded-lg border bg-gradient-to-r p-4 shadow-lg sm:p-5'
						id='noticeCardBanner'
						variants={bannerVariants}
						initial='initial'
						animate='animate'
						exit='exit'
					>
						<motion.span
							className='mr-3 text-xl select-none sm:text-2xl'
							variants={iconVariants}
							animate='animate'
						>
							<TriangleAlert className='text-primary' />
						</motion.span>
						<div className='flex-1 text-sm leading-relaxed font-medium sm:text-base'>
							<strong>Lưu ý:</strong> Hiện có đối tượng{' '}
							<span className='bg-secondary/10 rounded px-1.5 py-0.5 font-semibold'>
								lừa đảo mạo danh
							</span>{' '}
							sinh viên trường Cao Thắng để nhận giấy tờ. Hãy cẩn thận xác nhận
							thông tin để tránh hậu quả không mong muốn.
						</div>
						<button
							className='text-primary hover:bg-secondary/10 focus:ring-ring/50 ml-2 rounded bg-transparent p-1 text-lg transition-colors focus:ring-2 focus:outline-none sm:p-2 sm:text-xl'
							onClick={handleClose}
							title='Đóng thông báo'
							aria-label='Đóng thông báo'
						>
							×
						</button>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	)
}

export default NoticeCard
