import clsx from 'clsx'
import React from 'react'

interface HeadingProps {
	title?: string
	subtitle?: string
	size?: 'sm' | 'md' | 'lg' | 'xl'
	className?: string
	children?: React.ReactNode
}

const Heading: React.FC<HeadingProps> = ({
	title,
	subtitle,
	size = 'lg',
	className = '',
	children
}) => {
	const sizeClasses = {
		sm: 'text-xl',
		md: 'text-2xl',
		lg: 'text-3xl',
		xl: 'text-4xl'
	}

	const subtitleSizeClasses = {
		sm: 'text-sm',
		md: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl'
	}

	return (
		<div
			className={clsx(
				className,
				children && 'flex items-center justify-between'
			)}
		>
			<div>
				{title && (
					<>
						<h2 className={`${sizeClasses[size]} text-foreground font-bold`}>
							{title}
						</h2>
						<div className='text-primary bg-primary h-0.5 w-12'></div>
					</>
				)}
				{subtitle && (
					<p className={`${subtitleSizeClasses[size]} text-secondary mt-3`}>
						{subtitle}
					</p>
				)}
			</div>
			{children}
		</div>
	)
}

export default Heading
