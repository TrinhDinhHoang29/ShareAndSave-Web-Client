import { Calendar, EyeOff } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import DatePicker from '@/components/common/DatePicker'
import InputText from '@/components/common/InputText'
import { Appointment } from '@/models/types'

interface AppointmentFormProps {
	isTransitioning: boolean
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
	isTransitioning
}) => {
	const {
		register,
		formState: { errors }
	} = useFormContext<Appointment>()

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<Calendar className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground mb-2 text-2xl font-bold'>
					Lịch hẹn gặp mặt
				</h3>
				<p className='text-muted-foreground'>
					Chọn thời gian và địa điểm phù hợp
				</p>
			</div>

			<div className='space-y-4'>
				<DatePicker
					name='appointmentTime'
					label='Ngày và giờ hẹn *'
					register={register}
					error={errors.appointmentTime}
				/>
				<InputText
					name='appointmentLocation'
					label='Địa điểm hẹn *'
					placeholder='Nhập địa điểm hẹn'
					register={register}
					error={errors.appointmentLocation}
				/>

				<div className='bg-muted/50 border-border rounded-lg border p-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center'>
							<div className='bg-primary/10 mr-3 rounded-full p-2'>
								<EyeOff
									className='text-primary'
									size={18}
								/>
							</div>
							<div>
								<p className='text-foreground font-medium'>Gửi ẩn danh</p>
								<p className='text-muted-foreground text-sm'>
									Thông tin cá nhân sẽ được bảo mật
								</p>
							</div>
						</div>
						<label className='relative inline-flex cursor-pointer items-center'>
							<input
								type='checkbox'
								{...register('isAnonymous')}
								className='peer sr-only'
							/>
							<div className="bg-muted peer-focus:ring-primary peer peer-checked:bg-primary h-6 w-11 rounded-full peer-focus:ring-2 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
						</label>
					</div>
				</div>
			</div>
		</div>
	)
}

export default AppointmentForm
