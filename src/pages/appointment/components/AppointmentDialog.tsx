import { Dialog, Transition } from '@headlessui/react'
import {
	AlertTriangle,
	Calendar,
	Clock,
	Package,
	PackageCheck,
	PackageX,
	User,
	X
} from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'

import { formatDateTime } from '@/lib/utils'
import { getStatusAppointment } from '@/models/constants'
import { IAppointment } from '@/models/interfaces'

interface AppointmentDialogProps {
	appointment: IAppointment | null
	isOpen: boolean
	onClose: () => void
}

export const AppointmentDialog: React.FC<AppointmentDialogProps> = ({
	appointment,
	isOpen,
	onClose
}) => {
	if (!appointment) return null

	const statusInfo = getStatusAppointment(appointment.status)
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
		<Transition
			appear
			show={isOpen}
			as={Fragment}
		>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={onClose}
			>
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-300'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<div className='modal-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm' />
				</Transition.Child>

				<div className='fixed inset-0 overflow-y-auto'>
					<div className='flex min-h-full items-center justify-center p-4'>
						<Transition.Child
							as={Fragment}
							enter='ease-out duration-300'
							enterFrom='opacity-0 scale-95'
							enterTo='opacity-1 scale-100'
							leave='ease-in duration-200'
							leaveFrom='opacity-1 scale-100'
							leaveTo='opacity-0 scale-95'
						>
							<Dialog.Panel className='bg-background modal-enter w-full max-w-4xl transform overflow-hidden rounded-2xl shadow-2xl transition-all'>
								<div className='p-6'>
									{/* Header */}
									<div className='mb-6 flex items-start justify-between'>
										<div>
											<Dialog.Title className='text-foreground mb-2 text-2xl font-bold'>
												Chi tiết cuộc hẹn #{appointment.id}
											</Dialog.Title>
											<div className='flex items-center space-x-4'>
												<div className='flex items-center space-x-2'>
													<User className='text-muted-foreground h-5 w-5' />
													<span className='text-foreground font-medium'>
														{appointment.userName}
													</span>
												</div>
												<span
													className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusInfo.color}`}
												>
													<StatusIcon className='mr-1 h-4 w-4' />
													{statusInfo.label}
												</span>
											</div>
										</div>

										<button
											onClick={onClose}
											className='hover:bg-muted rounded-full p-2 transition-colors'
										>
											<X className='text-muted-foreground h-6 w-6' />
										</button>
									</div>

									{/* Appointment Info */}
									<div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
										<div className='space-y-4'>
											<div className='bg-muted flex items-center space-x-3 rounded-lg p-4'>
												<Calendar className='text-primary h-5 w-5' />
												<div>
													<p className='text-muted-foreground text-sm'>
														Ngày hẹn
													</p>
													<p className='text-foreground font-medium'>
														{startDateTime.date}
													</p>
												</div>
											</div>

											<div className='bg-muted flex items-center space-x-3 rounded-lg p-4'>
												<Clock className='text-primary h-5 w-5' />
												<div>
													<p className='text-muted-foreground text-sm'>
														Thời gian
													</p>
													<p className='text-foreground font-medium'>
														{startDateTime.time} - {endDateTime.time}
													</p>
												</div>
											</div>
										</div>

										<div className='space-y-4'>
											<div className='bg-muted flex items-center space-x-3 rounded-lg p-4'>
												<PackageCheck className='text-primary h-5 w-5' />
												<div>
													<p className='text-muted-foreground text-sm'>
														Tổng số items
													</p>
													<p className='text-foreground font-medium'>
														{totalItems} items
													</p>
												</div>
											</div>

											{missingItems > 0 && (
												<div className='bg-warning/10 border-warning/20 flex items-center space-x-3 rounded-lg border p-4'>
													<PackageX className='text-warning h-5 w-5' />
													<div>
														<p className='text-muted-foreground text-sm'>
															Items thiếu
														</p>
														<p className='text-warning font-medium'>
															{missingItems} items
														</p>
													</div>
												</div>
											)}
										</div>
									</div>

									{/* Appointment Items */}
									<div>
										<h3 className='text-foreground mb-4 text-lg font-semibold'>
											Danh sách items ({appointment.appointmentItems.length})
										</h3>

										<div className='no-scrollbar grid max-h-96 grid-cols-2 gap-4 space-y-3 overflow-y-auto pr-2'>
											{appointment.appointmentItems.map(item => (
												<div
													key={item.id}
													className='bg-muted/20 border-border hover:border-primary/30 flex items-center space-x-4 rounded-lg border p-4 transition-all duration-200'
												>
													<div className='bg-muted border-border h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2'>
														<img
															src={item.itemImage}
															alt={item.itemName}
															className='h-full w-full object-cover'
															onError={e => {
																const target = e.target as HTMLImageElement
																target.src =
																	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCA2NCA2NCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzIgNTZjMTMuMjU1IDAgMjQtMTAuNzQ1IDI0LTI0UzQ1LjI1NSA4IDMyIDggOCAxOC43NDUgOCAzMnMxMC43NDUgMjQgMjQgMjR6IiBmaWxsPSIjZjFmNWY5Ii8+PHBhdGggZD0iTTMyIDQwYTggOCAwIDEgMCAwLTE2IDggOCAwIDAgMCAwIDE2eiIgZmlsbD0iIzk0YTNiOCIvPjwvc3ZnPg=='
															}}
														/>
													</div>

													<div className='min-w-0 flex-1'>
														<h4 className='text-foreground truncate text-base font-medium'>
															{item.itemName}
														</h4>
														<p className='text-muted-foreground mb-1 text-sm'>
															{item.categoryName}
														</p>
														<div className='mt-2 flex items-center space-x-4'>
															<div className='bg-primary/10 flex items-center space-x-1 rounded-md px-2 py-1'>
																<span className='text-muted-foreground text-xs'>
																	Thực tế:
																</span>
																<span className='text-primary text-sm font-medium'>
																	{item.actualQuantity}
																</span>
															</div>
															{item.missingQuantity > 0 && (
																<div className='bg-warning/10 flex items-center space-x-1 rounded-md px-2 py-1'>
																	<span className='text-muted-foreground text-xs'>
																		Thiếu:
																	</span>
																	<span className='text-warning text-sm font-medium'>
																		{item.missingQuantity}
																	</span>
																</div>
															)}
														</div>
													</div>

													{item.missingQuantity > 0 && (
														<div className='flex-shrink-0'>
															<div className='bg-warning/10 border-warning/20 flex h-8 w-8 items-center justify-center rounded-full border'>
																<AlertTriangle className='text-warning h-4 w-4' />
															</div>
														</div>
													)}
												</div>
											))}
										</div>
									</div>

									{/* Footer Actions */}
									<div className='border-border mt-8 border-t pt-6'>
										<div className='flex justify-end space-x-3'>
											<button
												onClick={onClose}
												className='text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg px-6 py-2 font-medium transition-colors'
											>
												Đóng
											</button>
										</div>
									</div>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	)
}
