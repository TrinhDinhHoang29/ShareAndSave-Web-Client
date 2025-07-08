import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, Shield } from 'lucide-react'
import { useState } from 'react'

import { useAuthDialog } from '@/context/auth-dialog-context'

const LoginSession = () => {
	const [isVisible] = useState(true)
	const { openDialog } = useAuthDialog()

	const containerVariants = {
		hidden: {
			opacity: 0,
			y: 20,
			scale: 0.95
		},
		visible: {
			opacity: 1,
			y: 0,
			scale: 1,
			transition: {
				duration: 0.4,
				ease: 'easeOut'
			}
		},
		exit: {
			opacity: 0,
			y: -20,
			scale: 0.95,
			transition: { duration: 0.3 }
		}
	}

	const iconVariants = {
		animate: {
			rotate: [0, 5, -5, 0],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: 'easeInOut'
			}
		}
	}

	if (!isVisible) return null

	return (
		<div className='bg-background'>
			<AnimatePresence>
				{isVisible && (
					<motion.div
						variants={containerVariants}
						initial='hidden'
						animate='visible'
						exit='exit'
						className='bg-card border-border rounded-xl border p-6 text-center shadow-lg'
					>
						{/* Icon */}
						<motion.div
							variants={iconVariants}
							animate='animate'
							className='mb-4 flex justify-center'
						>
							<div className='rounded-full border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20'>
								<Shield className='h-8 w-8 text-amber-500' />
							</div>
						</motion.div>

						{/* Main Message */}
						<h2 className='text-foreground mb-2 text-xl font-semibold'>
							Phiên đăng nhập bị gián đoạn
						</h2>

						<p className='text-muted-foreground mb-6 leading-relaxed'>
							Có ai đó đã đăng nhập trên cùng loại thiết bị hoặc đã thay đổi mật
							khẩu. Vui lòng đăng nhập lại để tiếp tục.
						</p>

						{/* Action Buttons */}
						<div className='space-y-3'>
							<div className='flex w-full items-center justify-center'>
								<motion.button
									onClick={() => openDialog({})}
									className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-medium transition-colors'
								>
									<RefreshCw className='h-4 w-4' />
									Đăng nhập lại
								</motion.button>
							</div>
						</div>

						{/* Additional Info */}
						<p className='text-muted-foreground mt-4 text-xs'>
							Để bảo mật tài khoản của bạn, chúng tôi yêu cầu xác thực lại
						</p>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default LoginSession
