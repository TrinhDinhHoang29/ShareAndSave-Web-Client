import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, ChevronRight, Package, Send, User } from 'lucide-react'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import requestApi from '@/apis/modules/request.api'
import PrimaryButton from '@/components/common/PrimaryButton'
import SecondaryButton from '@/components/common/SecondaryButton'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { formatDateToISO } from '@/lib/utils'
import {
	IApiErrorResponse,
	IRequestSendItemRequest,
	ISendItemFormData,
	IStep
} from '@/models/interfaces'
import {
	Appointment,
	appointmentSchema,
	ItemInfo,
	itemInfoSchema,
	PersonalInfo,
	personalInfoSchema
} from '@/models/types'

import AppointmentForm from './components/AppointmentForm'
import Instruction from './components/Instruction'
import ItemInfoForm from './components/ItemInfoForm'
import MyThank from './components/MyThank'
import PersonalInfoForm from './components/PersonalInfoForm'
import ProgressBar from './components/ProgressBar'

const SendItem: React.FC = () => {
	const [currentStep, setCurrentStep] = useState<number>(0)
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
	const [ISendItemFormData, setISendItemFormData] =
		useState<ISendItemFormData>(Object)
	const [isCompleted, setIsCompleted] = useState<boolean>(false)
	const [completedEmail, setCompletedEmail] = useState<string>('')
	const { showLoading, showSuccess, showError, close } = useAlertModalContext()

	const steps: IStep[] = [
		{ title: 'Thông tin cá nhân', icon: User },
		{ title: 'Thông tin món đồ', icon: Package },
		{ title: 'Lịch hẹn', icon: Calendar }
	]

	const personalForm = useForm<PersonalInfo>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: ISendItemFormData.personalInfo
	})

	const itemForm = useForm<ItemInfo>({
		resolver: zodResolver(itemInfoSchema),
		defaultValues: ISendItemFormData.itemInfo || { description: '' }
	})

	const appointmentForm = useForm<Appointment>({
		resolver: zodResolver(appointmentSchema),
		defaultValues: ISendItemFormData.appointment || { isAnonymous: false }
	})

	const handleNext = async () => {
		let isValid = false

		if (currentStep === 0) {
			isValid = await personalForm.trigger()
			if (isValid) {
				setISendItemFormData(prev => ({
					...prev,
					personalInfo: personalForm.getValues()
				}))
			}
		} else if (currentStep === 1) {
			isValid = await itemForm.trigger()
			if (isValid) {
				setISendItemFormData(prev => ({
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

	const resetForm = () => {
		// Reset tất cả form
		personalForm.reset()
		itemForm.reset({ description: '' })
		appointmentForm.reset({ isAnonymous: false })

		// Reset state
		setISendItemFormData(Object)
		setCurrentStep(0)
		setIsCompleted(false)
		setCompletedEmail('')
		setIsTransitioning(false)
	}

	const handleSubmit = async () => {
		const isValid = await appointmentForm.trigger()
		if (isValid) {
			const finalData: ISendItemFormData = {
				...ISendItemFormData,
				appointment: appointmentForm.getValues()
			}

			const requestData = {
				...finalData.personalInfo,
				...finalData.itemInfo,
				...finalData.appointment
			}

			console.log('Dữ liệu gửi đi:', requestData)

			const convertedData: IRequestSendItemRequest = {
				fullName: requestData.fullName,
				email: requestData.email,
				phoneNumber: requestData.phoneNumber,
				description: requestData.description,
				appointmentTime: formatDateToISO(requestData.appointmentTime),
				appointmentLocation: requestData.appointmentLocation,
				isAnonymous: requestData.isAnonymous || false
			}

			try {
				showLoading({
					loadingMessage: 'Đang gửi yêu cầu...',
					showCancel: true,
					onCancel: () => {
						close()
					}
				})

				const res = await requestApi.sendOldItem(convertedData)

				if (res.code === 200) {
					// Lưu email và chuyển sang trạng thái hoàn thành
					setCompletedEmail(convertedData.email)
					setIsCompleted(true)

					// Có thể vẫn giữ success modal nếu muốn
					showSuccess({
						successTitle: 'Gửi yêu cầu thành công!',
						successMessage: `Vui lòng để ý email ${convertedData.email} để nhận thông tin sớm nhất.`,
						successButtonText: 'Hoàn tất'
					})
				} else {
					showError({
						errorTitle: 'Lỗi gửi yêu cầu',
						errorMessage:
							res.message ||
							'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.',
						errorButtonText: 'Thử lại'
					})
					return
				}
			} catch (error: any) {
				const errorResponse = error as IApiErrorResponse

				console.log(errorResponse)
				showError({
					errorTitle: 'Lỗi gửi yêu cầu',
					errorMessage:
						errorResponse.message ||
						'Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.',
					errorButtonText: 'Thử lại'
				})
				return
			}
		}
	}

	const renderCurrentForm = () => {
		if (isCompleted) {
			return (
				<MyThank
					onReset={resetForm}
					email={completedEmail}
				/>
			)
		}

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
						<ItemInfoForm isTransitioning={isTransitioning} />
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
		<>
			<div className='bg-background min-h-screen'>
				<div className='grid w-full grid-cols-1 gap-6 md:grid-cols-3'>
					<div className='col-span-1 md:col-span-2'>
						<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
							<ProgressBar currentStep={isCompleted ? 3 : currentStep} />

							<div className='mb-8 min-h-[400px]'>{renderCurrentForm()}</div>

							{!isCompleted && (
								<div className='border-border flex items-center justify-between border-t pt-6'>
									{currentStep > 0 ? (
										<SecondaryButton onClick={handleBack}>
											Quay lại
										</SecondaryButton>
									) : (
										<div />
									)}

									<div>
										{currentStep < steps.length - 1 ? (
											<PrimaryButton
												icon={<ChevronRight size={18} />}
												positionIcon='right'
												onClick={handleNext}
											>
												Tiếp theo
											</PrimaryButton>
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
							)}
						</div>
					</div>
					<div className='sticky top-0 col-span-1 md:top-16'>
						<Instruction />
					</div>
				</div>
			</div>
		</>
	)
}

export default SendItem
