import { zodResolver } from '@hookform/resolvers/zod'
import {
	ArrowRightIcon,
	BoxIcon,
	Calendar,
	CalendarIcon,
	ChevronLeft,
	ChevronRight,
	InfoIcon,
	Package,
	Send,
	User,
	UserIcon
} from 'lucide-react'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { SendItemFormData, Step } from '@/models/interfaces'
import {
	Appointment,
	appointmentSchema,
	ItemInfo,
	itemInfoSchema,
	PersonalInfo,
	personalInfoSchema
} from '@/models/types'

import AppointmentForm from './components/AppointmentForm'
import ItemInfoForm from './components/ItemInfoForm'
import PersonalInfoForm from './components/PersonalInfoForm'
import ProgressBar from './components/ProgressBar'

const SendItem: React.FC = () => {
	const [currentStep, setCurrentStep] = useState<number>(0)
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
	const [SendItemFormData, setSendItemFormData] = useState<SendItemFormData>({})

	const steps: Step[] = [
		{ title: 'Thông tin cá nhân', icon: User },
		{ title: 'Thông tin món đồ', icon: Package },
		{ title: 'Lịch hẹn', icon: Calendar }
	]

	const personalForm = useForm<PersonalInfo>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: SendItemFormData.personalInfo
	})

	const itemForm = useForm<ItemInfo>({
		resolver: zodResolver(itemInfoSchema),
		defaultValues: SendItemFormData.itemInfo || { image: [], description: '' }
	})

	const appointmentForm = useForm<Appointment>({
		resolver: zodResolver(appointmentSchema),
		defaultValues: SendItemFormData.appointment || { anonymous: false }
	})

	const handleNext = async () => {
		let isValid = false

		if (currentStep === 0) {
			isValid = await personalForm.trigger()
			if (isValid) {
				setSendItemFormData(prev => ({
					...prev,
					personalInfo: personalForm.getValues()
				}))
			}
		} else if (currentStep === 1) {
			isValid = await itemForm.trigger()
			if (isValid) {
				setSendItemFormData(prev => ({
					...prev,
					itemInfo: itemForm.getValues()
				}))
			}
		}

		if (isValid && currentStep < steps.length - 1) {
			setIsTransitioning(true)
			setTimeout(() => {
				setCurrentStep(currentStep + 1)
				setIsTransitioning(false)
			}, 200)
		}
	}

	const handleBack = () => {
		if (currentStep > 0) {
			setIsTransitioning(true)
			setTimeout(() => {
				setCurrentStep(currentStep - 1)
				setIsTransitioning(false)
			}, 200)
		}
	}

	const handleSubmit = async () => {
		const isValid = await appointmentForm.trigger()
		if (isValid) {
			const finalData: SendItemFormData = {
				...SendItemFormData,
				appointment: appointmentForm.getValues()
			}
			console.log('Dữ liệu cuối cùng:', finalData)
			alert('Yêu cầu đã được gửi thành công! ✨')
		}
	}

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || [])
		const newImages = files.map(file => {
			const reader = new FileReader()
			return new Promise<string>(resolve => {
				reader.onloadend = () => resolve(reader.result as string)
				reader.readAsDataURL(file)
			})
		})

		Promise.all(newImages).then(imageUrls => {
			const currentImages = itemForm.watch('image') || []
			itemForm.setValue('image', [...currentImages, ...imageUrls])
		})
	}

	const renderCurrentForm = () => {
		switch (currentStep) {
			case 0:
				return (
					<FormProvider {...personalForm}>
						<PersonalInfoForm isTransitioning={isTransitioning} />
					</FormProvider>
				)
			case 1:
				return (
					<FormProvider {...itemForm}>
						<ItemInfoForm
							isTransitioning={isTransitioning}
							handleImageUpload={handleImageUpload}
						/>
					</FormProvider>
				)
			case 2:
				return (
					<FormProvider {...appointmentForm}>
						<AppointmentForm isTransitioning={isTransitioning} />
					</FormProvider>
				)
			default:
				return null
		}
	}

	return (
		<div className='bg-background min-h-screen'>
			<div className='grid w-full grid-cols-1 gap-6 md:grid-cols-3'>
				<div className='col-span-1 md:col-span-2'>
					<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
						<ProgressBar currentStep={currentStep} />

						<div className='mb-8 min-h-[400px]'>{renderCurrentForm()}</div>

						<div className='border-border flex items-center justify-between border-t pt-6'>
							{currentStep > 0 ? (
								<button
									onClick={handleBack}
									className='text-muted-foreground bg-muted hover:bg-muted/80 flex items-center rounded-lg px-4 py-2 transition-colors duration-200'
								>
									<ChevronLeft
										size={18}
										className='mr-1'
									/>{' '}
									Quay lại
								</button>
							) : (
								<div />
							)}

							<div>
								{currentStep < steps.length - 1 ? (
									<button
										onClick={handleNext}
										className='bg-primary text-primary-foreground hover:bg-primary/90 flex items-center rounded-lg px-6 py-2 font-medium transition-colors duration-200'
									>
										Tiếp theo
										<ChevronRight
											size={18}
											className='ml-1'
										/>
									</button>
								) : (
									<button
										onClick={handleSubmit}
										className='bg-chart-1 hover:bg-chart-1/90 flex items-center rounded-lg px-6 py-2 font-medium text-white transition-colors duration-200'
									>
										<Send
											size={18}
											className='mr-2'
										/>{' '}
										Gửi yêu cầu
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
				<div className='sticky top-0 col-span-1 md:top-16'>
					<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
						<div className='p-4'>
							<div className='mb-4 flex items-center gap-2'>
								<InfoIcon className='h-5 w-5 text-gray-600' />
								<h2 className='text-lg font-medium'>Hướng dẫn gửi đồ</h2>
							</div>
							<div className='space-y-6'>
								<div className='flex gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300'>
										<UserIcon className='h-4 w-4 text-gray-600' />
									</div>
									<div>
										<h3 className='mb-1 font-medium text-gray-800'>
											Bước 1: Thông tin cá nhân
										</h3>
										<p className='text-sm text-gray-600'>
											Điền đầy đủ thông tin cá nhân để chúng tôi có thể liên hệ
											khi cần thiết.
										</p>
									</div>
								</div>
								<div className='flex gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300'>
										<BoxIcon className='h-4 w-4 text-gray-600' />
									</div>
									<div>
										<h3 className='mb-1 font-medium text-gray-800'>
											Bước 2: Thông tin đồ vật
										</h3>
										<p className='text-sm text-gray-600'>
											Cung cấp hình ảnh và mô tả chi tiết về đồ vật để dễ dàng
											xác nhận.
										</p>
									</div>
								</div>
								<div className='flex gap-3'>
									<div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-300'>
										<CalendarIcon className='h-4 w-4 text-gray-600' />
									</div>
									<div>
										<h3 className='mb-1 font-medium text-gray-800'>
											Bước 3: Đặt lịch hẹn
										</h3>
										<p className='text-sm text-gray-600'>
											Chọn thời gian và địa điểm thuận tiện để gửi đồ.
										</p>
									</div>
								</div>
								<div className='mt-6 border-t border-gray-200 pt-4'>
									<h3 className='mb-2 font-medium text-gray-800'>
										Lưu ý quan trọng:
									</h3>
									<ul className='space-y-2 text-sm text-gray-600'>
										<li className='flex items-start gap-2'>
											<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
											Mang theo CMND/CCCD khi đến gửi đồ
										</li>
										<li className='flex items-start gap-2'>
											<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
											Đảm bảo đồ vật sạch sẽ và đóng gói cẩn thận
										</li>
										<li className='flex items-start gap-2'>
											<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
											Kiểm tra kỹ đồ vật trước khi gửi
										</li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default SendItem
