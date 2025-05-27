import { motion } from 'framer-motion'
import { Heart, Sparkles, Star } from 'lucide-react'

const SendItemBanner = () => {
	return (
		<div className='relative mb-12 text-center'>
			{/* Background decorative elements */}
			<div className='pointer-events-none absolute inset-0 overflow-hidden'>
				<motion.div
					className='absolute top-0 left-1/4 h-2 w-2 rounded-full bg-pink-400 opacity-30'
					animate={{
						y: [0, -20, 0],
						opacity: [0.3, 0.8, 0.3]
					}}
					transition={{
						duration: 3,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
				/>
				<motion.div
					className='absolute top-10 right-1/3 h-1 w-1 rounded-full bg-blue-400 opacity-40'
					animate={{
						y: [0, -15, 0],
						opacity: [0.4, 0.9, 0.4]
					}}
					transition={{
						duration: 2.5,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 1
					}}
				/>
				<motion.div
					className='absolute -top-5 right-1/4 h-1.5 w-1.5 rounded-full bg-purple-400 opacity-35'
					animate={{
						y: [0, -25, 0],
						opacity: [0.35, 0.7, 0.35]
					}}
					transition={{
						duration: 4,
						repeat: Infinity,
						ease: 'easeInOut',
						delay: 0.5
					}}
				/>
			</div>

			{/* Main icon container */}
			<motion.div
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{
					type: 'spring',
					stiffness: 200,
					damping: 15,
					delay: 0.2
				}}
				className='relative mx-auto mb-6'
			>
				<div className='mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 shadow-xl backdrop-blur-sm'>
					{/* Rotating background glow */}
					<motion.div
						className='absolute inset-0 rounded-full bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30'
						animate={{ rotate: 360 }}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: 'linear'
						}}
					/>

					{/* Main star icon */}
					<motion.div
						animate={{
							scale: [1, 1.1, 1],
							rotate: [0, 5, -5, 0]
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
						className='relative z-10'
					>
						<Star className='text-gradient h-12 w-12 bg-gradient-to-br from-pink-500 to-purple-600 bg-clip-text fill-current text-transparent' />
					</motion.div>

					{/* Floating mini hearts */}
					<motion.div
						className='absolute -top-2 -right-1'
						animate={{
							y: [0, -8, 0],
							opacity: [0.6, 1, 0.6]
						}}
						transition={{
							duration: 2,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					>
						<Heart className='h-4 w-4 fill-current text-pink-500' />
					</motion.div>

					<motion.div
						className='absolute -bottom-1 -left-2'
						animate={{
							y: [0, -6, 0],
							opacity: [0.5, 0.9, 0.5]
						}}
						transition={{
							duration: 2.5,
							repeat: Infinity,
							ease: 'easeInOut',
							delay: 0.8
						}}
					>
						<Sparkles className='h-3 w-3 text-blue-500' />
					</motion.div>
				</div>
			</motion.div>

			{/* Title with stagger animation */}
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.8,
					delay: 0.5,
					ease: 'easeOut'
				}}
			>
				<motion.h1
					className='mb-4 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 bg-clip-text text-4xl leading-tight font-bold text-transparent md:text-5xl dark:from-white dark:via-purple-100 dark:to-white'
					animate={{
						backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
					}}
					transition={{
						duration: 5,
						repeat: Infinity,
						ease: 'easeInOut'
					}}
					style={{
						backgroundSize: '200% 200%'
					}}
				>
					Gửi món đồ yêu thương
				</motion.h1>
			</motion.div>

			{/* Subtitle with delay */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.6,
					delay: 0.8,
					ease: 'easeOut'
				}}
			>
				<p className='text-muted-foreground/80 text-lg font-medium tracking-wide'>
					<motion.span
						animate={{
							opacity: [0.7, 1, 0.7]
						}}
						transition={{
							duration: 3,
							repeat: Infinity,
							ease: 'easeInOut'
						}}
					>
						Chia sẻ niềm vui, lan tỏa yêu thương
					</motion.span>
				</p>
			</motion.div>

			{/* Bottom decorative line */}
			<motion.div
				initial={{ scaleX: 0 }}
				animate={{ scaleX: 1 }}
				transition={{
					duration: 1.2,
					delay: 1.2,
					ease: 'easeInOut'
				}}
				className='mx-auto mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-60'
			/>
		</div>
	)
}

export default SendItemBanner
