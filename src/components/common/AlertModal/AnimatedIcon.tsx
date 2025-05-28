import clsx from 'clsx'
import React from 'react'

interface AnimatedIconProps {
	children: React.ReactNode
	className?: string
	type?: 'glow' | 'shake' | 'pulse' | 'float'
	delay?: number
}

const AnimatedIcon: React.FC<AnimatedIconProps> = ({
	children,
	className = '',
	type = 'glow',
	delay = 0
}) => {
	const getAnimationClass = () => {
		switch (type) {
			case 'shake':
				return 'icon-shake'
			case 'pulse':
				return 'icon-pulse'
			case 'float':
				return 'float'
			default:
				return 'icon-glow'
		}
	}

	return (
		<div
			className={clsx(className, getAnimationClass())}
			style={{ animationDelay: `${delay}s` }}
		>
			{children}
		</div>
	)
}

export default AnimatedIcon
