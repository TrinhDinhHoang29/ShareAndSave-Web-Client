import { AnimatePresence, motion } from 'framer-motion'
import { Frown } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import CustomSelect from '@/components/common/CustomSelect'
import Pagination from '@/components/common/Pagination'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { useUpdateAppointmentMutation } from '@/hooks/mutations/use-appointment.mutation'
import { useListAppointmentQuery } from '@/hooks/queries/use-appointment.query'
import useDebounce from '@/hooks/use-debounce'
import { EAppointmentStatus, EPostType, ESortOrder } from '@/models/enums'
import { IAppointment } from '@/models/interfaces'
import { sortOptions } from '@/models/options'

import Heading from '../home/components/Heading'
import { AppointmentDialog } from './components/AppointmentDialog'
import AppointmentItem from './components/AppointmentItem'
import AppointmentItemSkeleton from './components/AppointmentItemSkeleton'

// Kiểu hợp nhất với '' cho "Tất cả"
type PostTypeSelection = '' | EPostType
const limit = 9

const Appointment = () => {
	const [search, setSearch] = useState('')
	const [currentPage, setCurrentPage] = useState(1)
	const [order, setOrder] = useState<ESortOrder>(ESortOrder.DESC) // Mặc định là mới nhất
	const [selectedAppointment, setSelectedAppointment] =
		useState<IAppointment | null>(null)
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const { showConfirm } = useAlertModalContext()

	const debouncedSearch = useDebounce(search, 500)

	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedSearch])

	// const params: IListTypeParams<EPostType> = useMemo(
	// 	() => ({
	// 		page: currentPage,
	// 		limit, // Giới hạn 6 item mỗi trang
	// 		sort: 'createdAt', // Sắp xếp theo createdAt
	// 		order, // ASC hoặc DESC
	// 		search: debouncedSearch || undefined // Chỉ gửi search nếu có giá trị
	// 	}),
	// 	[selectedType, currentPage, order, debouncedSearch]
	// )

	const params = {}

	const { data, isPending, refetch } = useListAppointmentQuery(params)
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
			<Heading title='Lịch hẹn' />
			<div className='flex items-center justify-between gap-2'>
				<div className='w-2/3'>
					<label
						htmlFor='searchInput'
						className='text-secondary mb-1 block text-sm font-medium'
					>
						Tìm kiếm
					</label>
					<input
						id='searchInput'
						type='text'
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder='Tìm kiếm bài đăng, tiêu đề...'
						className='bg-card text-foreground focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:outline-none'
					/>
				</div>
				<div className='flex-1'>
					<label className='text-secondary mb-1 block text-sm font-medium'>
						Sắp xếp
					</label>
					<CustomSelect
						value={order}
						onChange={value => setOrder(value as ESortOrder)}
						options={sortOptions}
						className='flex-1'
					/>
				</div>
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
