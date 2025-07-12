import { AnimatePresence, motion } from 'framer-motion'
import { Frown } from 'lucide-react'
import { useMemo, useState } from 'react'

import CustomSelect from '@/components/common/CustomSelect'
import Pagination from '@/components/common/Pagination'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { useUpdateAppointmentMutation } from '@/hooks/mutations/use-appointment.mutation'
import { useListAppointmentQuery } from '@/hooks/queries/use-appointment.query'
import { EAppointmentStatus } from '@/models/enums'
import { IAppointment } from '@/models/interfaces'
import { appointmentStatusOptions } from '@/models/options'
import useAuthStore from '@/stores/authStore'

import Heading from '../home/components/Heading'
import { AppointmentDialog } from './components/AppointmentDialog'
import AppointmentItem from './components/AppointmentItem'
import AppointmentItemSkeleton from './components/AppointmentItemSkeleton'

// Kiểu hợp nhất với '' cho "Tất cả"
const limit = 9

const Appointment = () => {
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedAppointment, setSelectedAppointment] =
		useState<IAppointment | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const { showConfirm } = useAlertModalContext()
	// const [search, setSearch] = useState('')
	const [appointmentStatus, setAppointmentStatus] =
		useState<EAppointmentStatus>(EAppointmentStatus.ALL) // Mặc định là mới nhất

	const params: {
		searchBy: 'status'
		searchValue: EAppointmentStatus
	} = useMemo(
		() => ({
			searchBy: 'status',
			searchValue: appointmentStatus
		}),
		[appointmentStatus, currentPage]
	)
	const userId = useAuthStore.getState().user?.id

	const { data, isPending, refetch } = useListAppointmentQuery(
		userId || 0,
		params
	)
	const { mutate } = useUpdateAppointmentMutation({
		onSuccess: () => {
			refetch()
		}
	})
	const appointments = useMemo(() => {
		return data?.appointments || []
	}, [data])
	const totalPage = data?.totalPage || 1

	const handleViewDetails = (appointment: IAppointment) => {
		setSelectedAppointment(appointment)
		setIsDialogOpen(true)
	}

	const handleUpdateStatus = (appointmentID: number) => {
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage: 'Hành động này không thể hoàn tác',
			confirmTitle: 'Từ chối cuộc hẹn?',
			cancelButtonText: 'Hủy',
			onConfirm: () => {
				mutate({
					appointmentID,
					data: {
						status: EAppointmentStatus.REJECTED
					}
				})
			}
		})
	}

	const handleCloseDialog = () => {
		setIsDialogOpen(false)
		setSelectedAppointment(null)
	}

	return (
		<div className='container mx-auto space-y-6 py-12'>
			<div className='flex items-center justify-between'>
				<Heading title='Lịch hẹn' />
				<CustomSelect
					value={appointmentStatus}
					onChange={value => setAppointmentStatus(value as EAppointmentStatus)}
					options={appointmentStatusOptions}
				/>
			</div>

			<div className='relative space-y-6'>
				<AnimatePresence mode='wait'>
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						transition={{ duration: 0.2 }}
						className='space-y-6'
					>
						<div className='grid grid-cols-3 gap-6'>
							{isPending ? (
								<AppointmentItemSkeleton quantity={limit} />
							) : appointments.length > 0 ? (
								appointments.map(appointment => (
									<AppointmentItem
										key={appointment.id}
										appointment={appointment}
										onViewDetails={handleViewDetails}
										onUpdateStatus={handleUpdateStatus}
									/>
								))
							) : (
								<div className='border-border bg-card/50 col-span-4 rounded-2xl border-2 border-dashed p-12 text-center backdrop-blur-sm'>
									<div className='bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
										<Frown className='text-muted-foreground h-8 w-8' />
									</div>
									<p className='text-muted-foreground text-lg'>
										Không tìm thấy kết quả
									</p>
								</div>
							)}
						</div>
					</motion.div>
				</AnimatePresence>
				{totalPage > 1 && (
					<Pagination
						currentPage={currentPage}
						totalPages={totalPage}
						setCurrentPage={setCurrentPage}
					/>
				)}
				<AppointmentDialog
					appointment={selectedAppointment}
					isOpen={isDialogOpen}
					onClose={handleCloseDialog}
				/>
			</div>
		</div>
	)
}

export default Appointment
