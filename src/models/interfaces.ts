import { LucideIcon } from 'lucide-react'

import { Appointment, ItemInfo, PersonalInfo } from './types'

export interface SendItemFormData {
	personalInfo?: PersonalInfo
	itemInfo?: ItemInfo
	appointment?: Appointment
}

export interface Step {
	title: string
	icon: LucideIcon
}
