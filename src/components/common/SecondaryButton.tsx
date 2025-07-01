import clsx from 'clsx'
import React, { MouseEvent, ReactNode } from 'react'
import { Link } from 'react-router-dom' // Import Link from react-router-dom

interface SecondaryButtonProps {
	onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
	children: ReactNode
	icon?: ReactNode
	title?: string
	size?: 'sm' | 'md' | 'lg'
	variant?: 'secondary' | 'primary' | 'outline'
	className?: string
	type?: 'button' | 'link' // 'button' or 'link' for Link component
	to?: string // Used for Link href
	[key: string]: any // For additional HTML button or Link attributes
	positionIcon?: 'left' | 'right' // Position of the icon relative to text
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
	onClick,
	children,
	icon,
	title,
	size = 'md',
	variant = 'secondary',
	className,
	type = 'button', // Default to button
	to,
	positionIcon = 'left', // Default position of the icon
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
		secondary: 'text-foreground bg-muted hover:bg-muted/80',
		primary: 'text-white bg-blue-600 hover:bg-blue-700',
		outline: 'text-foreground border border-muted hover:bg-muted/10'
	}

	// Common classes for both button and Link
	const commonClasses = clsx(
		'flex items-center rounded-lg transition-colors duration-200',
		sizeStyles[size],
		variantStyles[variant],
		className // Custom classes passed via props
	)

	if (type === 'link') {
		return (
			<Link
				to={to || '#'} // Fallback to '#' if to is undefined
				onClick={onClick}
				title={title} // Sets tooltip/accessible title
				className={commonClasses}
				{...props}
			>
				{icon && positionIcon === 'left' && (
					<span className={clsx('ml-1', { 'ml-2': size === 'lg' })}>
						{icon}
					</span>
				)}
				{children}
				{icon && positionIcon === 'right' && (
					<span className={clsx('mr-1', { 'mr-2': size === 'lg' })}>
						{icon}
					</span>
				)}
			</Link>
		)
	}

	return (
		<button
			onClick={onClick}
			title={title} // Sets tooltip/accessible title
			className={commonClasses}
			{...props}
		>
			{icon && positionIcon === 'left' && (
				<span className={clsx('mr-1', { 'mr-2': size === 'lg' })}>{icon}</span>
			)}
			{children}
			{icon && positionIcon === 'right' && (
				<span className={clsx('ml-1', { 'ml-2': size === 'lg' })}>{icon}</span>
			)}
		</button>
	)
}

export default SecondaryButton
