import { motion } from 'framer-motion'
import React from 'react'

interface LoadingProps {
	size?: 'sm' | 'md' | 'lg' | 'xl'
	variant?: 'spinner' | 'dots' | 'pulse' | 'bars' | 'orbit'
	color?: 'primary' | 'secondary' | 'accent' | 'white'
	text?: string
	fullScreen?: boolean
	position?: 'in' | 'out'
	overlay?: boolean // Thêm prop overlay
}

const Loading: React.FC<LoadingProps> = ({
	size = 'md',
	variant = 'spinner',
	color = 'primary',
	text,
	fullScreen = false,
	position = 'out',
	overlay = false // Mặc định là false
}) => {
	// Size configurations
	const sizeClasses = {
		sm: { container: 'w-4 h-4', text: 'text-sm' },
		md: { container: 'w-8 h-8', text: 'text-base' },
		lg: { container: 'w-12 h-12', text: 'text-lg' },
		xl: { container: 'w-16 h-16', text: 'text-xl' }
	}

	// Color configurations
	const colorClasses = {
		primary: 'text-primary',
		secondary: 'text-secondary',
		accent: 'text-accent-foreground',
		white: 'text-white'
	}

	const currentSize = sizeClasses[size]
	const currentColor = colorClasses[color]

	// Animation variants
	const spinnerVariants = {
		animate: {
			rotate: 360,
			transition: {
				duration: 1,
				repeat: Infinity,
				ease: 'linear'
			}
		}
	}

	const dotsVariants = {
		animate: {
			scale: [1, 1.2, 1],
			opacity: [0.7, 1, 0.7],
			transition: {
				duration: 1.2,
				repeat: Infinity,
				ease: 'easeInOut'
			}
		}
	}

	const pulseVariants = {
		animate: {
			scale: [1, 1.1, 1],
			opacity: [0.5, 1, 0.5],
			transition: {
				duration: 1.5,
				repeat: Infinity,
				ease: 'easeInOut'
			}
		}
	}

	const barsVariants = {
		animate: (i: number) => ({
			scaleY: [1, 2, 1],
			transition: {
				duration: 1,
				repeat: Infinity,
				delay: i * 0.1,
				ease: 'easeInOut'
			}
		})
	}

	const orbitVariants = {
		animate: {
			rotate: 360,
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: 'linear'
			}
		}
	}

	// Container classes
	const containerClasses = fullScreen
		? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
		: position === 'in'
			? `absolute inset-0 z-50 flex items-center justify-center ${overlay ? 'bg-background/80 backdrop-blur-sm' : ''}` // Thêm overlay khi position='in' và overlay=true
			: 'flex items-center justify-center'

	const renderLoadingVariant = () => {
		switch (variant) {
			case 'spinner':
				return (
					<motion.div
						className={`${currentSize.container} ${currentColor}`}
						variants={spinnerVariants}
						animate='animate'
					>
						<svg
							className='h-full w-full'
							viewBox='0 0 24 24'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<circle
								cx='12'
								cy='12'
								r='10'
								stroke='currentColor'
								strokeWidth='2'
								strokeLinecap='round'
								strokeDasharray='60 20'
								fill='none'
							/>
						</svg>
					</motion.div>
				)

			case 'dots':
				return (
					<div className='flex space-x-2'>
						{[0, 1, 2].map(i => (
							<motion.div
								key={i}
								className={`h-3 w-3 rounded-full ${currentColor} bg-current`}
								variants={dotsVariants}
								animate='animate'
								style={{ animationDelay: `${i * 0.2}s` }}
							/>
						))}
					</div>
				)

			case 'pulse':
				return (
					<motion.div
						className={`${currentSize.container} rounded-full ${currentColor} bg-current`}
						variants={pulseVariants}
						animate='animate'
					/>
				)

			case 'bars':
				return (
					<div className='flex items-end space-x-1'>
						{[0, 1, 2, 3, 4].map(i => (
							<motion.div
								key={i}
								className={`h-6 w-1 ${currentColor} rounded-full bg-current`}
								custom={i}
								variants={barsVariants}
								animate='animate'
							/>
						))}
					</div>
				)

			case 'orbit':
				return (
					<div className={`relative ${currentSize.container}`}>
						<motion.div
							className='absolute inset-0'
							variants={orbitVariants}
							animate='animate'
						>
							<div
								className={`h-2 w-2 ${currentColor} absolute top-0 left-1/2 -translate-x-1/2 transform rounded-full bg-current`}
							/>
							<div
								className={`h-1.5 w-1.5 ${currentColor} absolute bottom-0 left-1/2 -translate-x-1/2 transform rounded-full bg-current opacity-60`}
							/>
							<div
								className={`h-1 w-1 ${currentColor} absolute top-1/2 right-0 -translate-y-1/2 transform rounded-full bg-current opacity-40`}
							/>
							<div
								className={`h-1 w-1 ${currentColor} absolute top-1/2 left-0 -translate-y-1/2 transform rounded-full bg-current opacity-40`}
							/>
						</motion.div>
					</div>
				)

			default:
				return null
		}
	}

	return (
		<div className={containerClasses}>
			<div className='flex flex-col items-center space-y-4'>
				{renderLoadingVariant()}
				{text && (
					<motion.p
						className={`${currentSize.text} ${currentColor} font-medium`}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						{text}
					</motion.p>
				)}
			</div>
		</div>
	)
}

export default Loading
