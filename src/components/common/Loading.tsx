import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import React from 'react'

interface LoadingProps {
	size?: 'sm' | 'md' | 'lg' | 'xl'
	color?: 'primary' | 'secondary' | 'accent' | 'white'
	text?: string
	fullScreen?: boolean
	position?: 'in' | 'out'
	overlay?: boolean // Thêm prop overlay
}

const Loading: React.FC<LoadingProps> = ({
	size = 'md',
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

	// Container classes
	const containerClasses = fullScreen
		? 'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center'
		: position === 'in'
			? `h-full rounded-md absolute inset-0 z-50 flex items-center justify-center ${overlay ? 'bg-background/80 backdrop-blur-sm' : ''}` // Thêm overlay khi position='in' và overlay=true
			: 'flex items-center justify-center'

	return (
		<div className={containerClasses}>
			<div className='flex flex-col items-center space-y-4'>
				<Loader2
					className={`${currentSize.container} ${currentColor} animate-spin`}
				/>
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

export default React.memo(Loading)
