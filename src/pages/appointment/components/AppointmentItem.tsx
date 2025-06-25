import {
	Calendar,
	CheckCircle,
	Clock,
	PackageCheck,
	PackageX,
	User,
	X
} from 'lucide-react'
import React from 'react'

import { formatDateTime } from '@/lib/utils'
import { EAppointmentStatus } from '@/models/enums'
import { IAppointment } from '@/models/interfaces'
// Status mapping
const getStatusInfo = (status: number) => {
	const statusMap = {
		1: {
			label: 'Đã xác nhận',
			color: 'bg-info/10 text-info border-info/20',
			icon: CheckCircle
		},
		2: {
			label: 'Đã từ chối',
			color: 'bg-error/10 text-error border-error/20',
			icon: X
		}
	}
	return statusMap[status as keyof typeof statusMap] || statusMap[1]
}

// AppointmentItem Component
interface AppointmentItemProps {
	appointment: IAppointment
	onViewDetails: (appointment: IAppointment) => void
	onUpdateStatus: (appointmentID: number) => void
}

const AppointmentItem: React.FC<AppointmentItemProps> = ({
	appointment,
	onViewDetails,
	onUpdateStatus
}) => {
	const statusInfo = getStatusInfo(appointment.status)
	const startDateTime = formatDateTime(appointment.startTime)
	const endDateTime = formatDateTime(appointment.endTime)
	const StatusIcon = statusInfo.icon

	const totalItems = appointment.appointmentItems.reduce(
		(sum, item) => sum + item.actualQuantity,
		0
	)
	const missingItems = appointment.appointmentItems.reduce(
		(sum, item) => sum + item.missingQuantity,
		0
	)

	return (
		<div className='bg-card border-border glass space-y-4 rounded-xl border p-6 shadow-sm transition-all duration-300 hover:shadow-lg'>
			<div className='flex items-start justify-between'>
				<div className='flex items-center space-x-3'>
					<div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
						<User className='text-primary h-6 w-6' />
					</div>
					<div>
						<h3 className='text-foreground text-lg font-semibold'>
							{appointment.userName}
						</h3>
						<p className='text-muted-foreground text-sm'>
							Số: #{appointment.id}
						</p>
					</div>
				</div>

				<div className='flex items-center space-x-2'>
					<span
						className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}
					>
						<StatusIcon className='mr-1 h-3 w-3' />
						{statusInfo.label}
					</span>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
				<div className='text-muted-foreground flex space-x-2'>
					<Calendar className='h-4 w-4' />
					<span className='text-sm'>{startDateTime.date}</span>
				</div>
				<div className='text-muted-foreground flex space-x-2'>
					<Clock className='h-4 w-4' />
					<span className='text-sm'>
						{startDateTime.time} - {endDateTime.time}
					</span>
				</div>
			</div>
			<div className='flex items-center justify-between gap-2'>
				<div className='flex space-x-2'>
					<PackageCheck className='text-muted-foreground h-4 w-4' />
					<span className='text-muted-foreground text-sm'>
						{totalItems} món đồ
					</span>
				</div>

				{missingItems > 0 && (
					<div className='flex items-center space-x-2'>
						<PackageX className='text-error h-4 w-4' />
						<span className='text-error text-sm font-medium'>
							còn thiếu {missingItems} món đồ
						</span>
					</div>
				)}
			</div>
			<div className='flex items-center justify-end gap-2'>
				<button
					onClick={() => onViewDetails(appointment)}
					className='bg-primary text-primary-foreground hover:bg-primary/90 button-ripple rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors'
				>
					<span>Xem chi tiết</span>
				</button>
				{appointment.status === EAppointmentStatus.APPROVED && (
					<button
						onClick={() => onUpdateStatus(appointment.id)}
						className='bg-error text-primary-foreground hover:bg-error/90 button-ripple rounded-lg px-4 py-2 text-sm font-medium shadow-sm transition-colors'
					>
						<span>Từ chối</span>
					</button>
				)}
			</div>
		</div>
	)
}

export default AppointmentItem
