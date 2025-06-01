import clsx from 'clsx'
import React, { ReactNode, useEffect, useRef, useState } from 'react'

interface DropdownProps {
	trigger: ReactNode
	children: ReactNode
	position?: 'left' | 'right'
	isOpen?: boolean // Controlled open state
	onOpenChange?: (open: boolean) => void // Callback for open state changes
}

const Dropdown: React.FC<DropdownProps> = ({
	trigger,
	children,
	position = 'right',
	isOpen: controlledIsOpen,
	onOpenChange
}) => {
	// Use internal state if not controlled
	const [internalIsOpen, setInternalIsOpen] = useState(false)
	const isControlled = controlledIsOpen !== undefined
	const isOpen = isControlled ? controlledIsOpen : internalIsOpen

	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown on outside click
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				if (isControlled) {
					onOpenChange?.(false)
				} else {
					setInternalIsOpen(false)
				}
			}
		}
		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [isControlled, onOpenChange])

	// Toggle dropdown
	const toggleDropdown = () => {
		const newIsOpen = !isOpen
		if (isControlled) {
			onOpenChange?.(newIsOpen)
		} else {
			setInternalIsOpen(newIsOpen)
		}
	}

	// Menu position styles
	const positionStyles: Record<string, string> = {
		left: 'left-0',
		right: 'right-0'
	}

	return (
		<div
			className='relative inline-block'
			ref={dropdownRef}
		>
			<div
				onClick={toggleDropdown}
				role='button'
				tabIndex={0}
				aria-expanded={isOpen}
				aria-haspopup='true'
				className='focus:ring-ring/50 rounded-lg focus:ring-2 focus:outline-none'
			>
				{trigger}
			</div>
			{isOpen && (
				<div
					className={clsx(
						'border-border/50 absolute z-20 mt-2 rounded-md border shadow-lg backdrop-blur-md',
						'animate-fadeIn min-w-[180px]',
						positionStyles[position]
					)}
					role='menu'
				>
					{children}
				</div>
			)}
		</div>
	)
}

export default Dropdown
