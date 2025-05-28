import { UserCircle } from 'lucide-react'
import React, { useState } from 'react'

import Dropdown from '@/components/common/Dropdown'

import ProfileMenu from './ProfileMenu'

interface DropdownProfileMenuProps {
	className?: string
}

const DropdownProfileMenu: React.FC<DropdownProfileMenuProps> = () => {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<Dropdown
			isOpen={isOpen}
			onOpenChange={setIsOpen}
			trigger={
				<button
					className='border-muted-foreground text-secondary rounded-md border-2 border-solid p-2 shadow-md transition-colors hover:opacity-90'
					title='Hồ sơ'
				>
					<UserCircle size={24} />
				</button>
			}
		>
			<ProfileMenu onClickOutSide={() => setIsOpen(!isOpen)} />
		</Dropdown>
	)
}

export default DropdownProfileMenu
