import clsx from 'clsx'
import React, { MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface PrimaryButtonProps {
	onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
	children: ReactNode
	icon?: ReactNode
	title?: string
	size?: 'sm' | 'md' | 'lg'
	variant?: 'primary' | 'secondary' | 'outline'
	className?: string
	type?: 'button' | 'link'
	to?: string
	positionIcon?: 'left' | 'right' // Position of the icon relative to text
	[key: string]: any // For additional HTML button or Link attributes
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
	onClick,
	children,
	icon,
	positionIcon = 'left',
	title,
	size = 'md',
	variant = 'primary',
	className,
	type = 'button',
	to,
	...props
}) => {
	// Size-based class mappings
	const sizeStyles: Record<string, string> = {
		sm: 'px-3 py-1 text-sm',
		md: 'px-4 py-2 text-base',
		lg: 'px-6 py-3 text-lg'
	}

	// Variant-based class mappings
	const variantStyles: Record<string, string> = {
		primary:
			'bg-primary text-primary-foreground hover:bg-primary/90 font-medium',
		secondary: 'text-foreground bg-muted hover:bg-muted/80',
		outline: 'text-foreground border border-primary hover:bg-primary/10'
	}

	// Common classes for both button and Link
	const commonClasses = clsx(
		'flex items-center rounded-lg transition-colors duration-200',
		sizeStyles[size],
		variantStyles[variant],
		className
	)

	if (type === 'link') {
		return (
			<Link
				to={to || '#'}
				onClick={onClick}
				title={title}
				className={commonClasses}
				{...props}
			>
				{icon && positionIcon === 'left' && (
					<span className={clsx('mr-1', { 'mr-2': size === 'lg' })}>
						{icon}
					</span>
				)}
				{children}
				{icon && positionIcon === 'right' && (
					<span className={clsx('ml-1', { 'ml-2': size === 'lg' })}>
						{icon}
					</span>
				)}
			</Link>
		)
	}

	return (
		<button
			onClick={onClick}
			title={title}
			className={commonClasses}
			{...props}
		>
			{icon && positionIcon === 'left' && (
				<span className={clsx('ml-1', { 'ml-2': size === 'lg' })}>{icon}</span>
			)}
			{children}
			{icon && positionIcon === 'right' && (
				<span className={clsx('mr-1', { 'mr-2': size === 'lg' })}>{icon}</span>
			)}
		</button>
	)
}

export default PrimaryButton
