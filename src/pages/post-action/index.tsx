import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronRight, Package, Send, Star, User } from 'lucide-react'
import React, { lazy, Suspense, useEffect, useState } from 'react' // Thêm Suspense và lazy
import { FormProvider, useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import PrimaryButton from '@/components/common/PrimaryButton'
import SecondaryButton from '@/components/common/SecondaryButton'
import { useAuthDialog } from '@/context/auth-dialog-context'
import { useCreatePostMutation } from '@/hooks/mutations/use-post.mutation'
import { EPostType } from '@/models/enums'
import {
	IPostActionInfoFormData,
	IPostActionRequest,
	IPostActionResponse,
	IStep
} from '@/models/interfaces'
import {
	personalInfoSchema,
	postInfoSchema,
	postTypeSchema
} from '@/models/schema'
import {
	PersonalInfo,
	PostInfo,
	PostType,
	RegisterFormData
} from '@/models/types'
import useAuthStore from '@/stores/authStore'

import Instruction from './components/Instruction'
import MyThank from './components/MyThank' // Không lazy
import PersonalInfoForm from './components/PersonalInfoForm' // Không lazy
import PostTypeForm from './components/PostTypeForm'
import ProgressBar from './components/ProgressBar'

// Lazy load chỉ các Post components
const PostSendOldItemform = lazy(
	() => import('./components/PostSendOldItemForm')
)
const PostSendLostItemForm = lazy(
	() => import('./components/PostSendLostItemForm')
)
const PostFindItemForm = lazy(() => import('./components/PostFindItemForm'))
const PostForm = lazy(() => import('./components/PostForm'))

function isValidPostType(value: string | undefined): value is EPostType {
	return (
		value !== undefined && Object.values(EPostType).includes(value as EPostType)
	)
}

const PostAction: React.FC = () => {
	const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
	const [formData, setFormData] = useState<IPostActionInfoFormData>(Object)
	const [isCompleted, setIsCompleted] = useState<boolean>(false)
	const [completedEmail, setCompletedEmail] = useState<string>('')
	const { isAuthenticated } = useAuthStore()
	const [currentStep, setCurrentStep] = useState<number>(() =>
		isAuthenticated ? 1 : 0
	)
	const params = useParams()
	const type = isValidPostType(params.type)
		? params.type
		: EPostType.GIVE_AWAY_OLD_ITEM

	const { openRegisterWithData, isRegisterByPost } = useAuthDialog()

	useEffect(() => {
		if (!isRegisterByPost) setCurrentStep(isAuthenticated ? 1 : 0)
	}, [isAuthenticated, isRegisterByPost])

	const mutation = useCreatePostMutation({
		onSuccess: (data: IPostActionResponse) => {
			console.log(data)
			setCompletedEmail(formData.personalInfo?.email || '')
			setIsCompleted(true)
		}
	})

	const steps: IStep[] = [
		{ title: 'Thông tin cá nhân', icon: User },
		{ title: 'Loại bài đăng', icon: Star },
		{ title: 'Thông tin bài đăng', icon: Package }
	]

	const personalForm = useForm<PersonalInfo>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: formData.personalInfo
	})

	const postTypeForm = useForm<PostType>({
		resolver: zodResolver(postTypeSchema),
		defaultValues: formData.postType || { type: type.toString() }
	})

	const postInfoForm = useForm<PostInfo>({
		resolver: zodResolver(postInfoSchema),
		defaultValues: formData.postInfo || { description: '', images: [] }
	})

	const handleNext = async () => {
		let isValid = false

		if (currentStep === 0) {
			isValid = await personalForm.trigger()
			if (isValid) {
				setFormData((prev: any) => ({
					...prev,
					personalInfo: personalForm.getValues()
				}))
			}
		} else if (currentStep === 1) {
			isValid = await postTypeForm.trigger()
			if (isValid) {
				setFormData((prev: any) => ({
					...prev,
					postType: postTypeForm.getValues()
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
		personalForm.reset()
		postTypeForm.reset({ type: '1' })
		postInfoForm.reset({ description: '', images: [] })
		setFormData(Object)
		setCurrentStep(isAuthenticated ? 1 : 0)
		setIsCompleted(false)
		setCompletedEmail('')
		setIsTransitioning(false)
	}

	const handleSubmit = async () => {
		const isValid = await postInfoForm.trigger()
		if (isValid) {
			if (!isAuthenticated) {
				// Nếu chưa đăng nhập, mở dialog đăng ký với thông tin đã nhập
				const userInfo: RegisterFormData = {
					email: formData.personalInfo.email,
					fullName: formData.personalInfo.fullName,
					phoneNumber: formData.personalInfo.phoneNumber,
					password: '',
					confirmPassword: ''
				}
				openRegisterWithData(userInfo)
				return
			}

			const finalData: IPostActionInfoFormData = {
				...formData,
				postInfo: postInfoForm.getValues()
			}

			const requestData = {
				...finalData.personalInfo,
				...finalData.postType,
				...finalData.postInfo
			}

			// Lọc các thuộc tính không null hoặc không rỗng từ requestData
			const contentData: Record<string, any> = {}
			Object.entries(requestData).forEach(([key, value]) => {
				// Loại bỏ các thuộc tính đã sử dụng trong convertedData
				if (
					![
						'fullName',
						'email',
						'phoneNumber',
						'type',
						'images',
						'title',
						'newItems',
						'oldItems',
						'description'
					].includes(key) &&
					value != null && // Không null hoặc undefined
					value !== '' && // Không rỗng (string)
					(!Array.isArray(value) || value.length > 0) // Không phải mảng rỗng
				) {
					contentData[key] = value
				}
			})

			// Chuyển contentData thành JSON string
			const infoJson = JSON.stringify(contentData)

			const convertedData: IPostActionRequest = {
				// fullName: requestData?.fullName,
				// email: requestData?.email,
				// phoneNumber: requestData?.phoneNumber,
				// author_id: user?.id,
				description: requestData.description,
				type: Number(requestData.type),
				images: requestData.images || [],
				title: requestData.title,
				info: infoJson, // Gán content dưới dạng JSON string
				newItems: requestData.newItems?.map(item => ({
					quantity: item.quantity,
					categoryID: item.categoryID,
					name: item.name,
					image: item.image
				})),
				oldItems: requestData.oldItems?.map(item => ({
					itemID: item.itemID,
					quantity: item.quantity,
					image: item.image
				}))
			}

			mutation.mutate(convertedData)
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
					<FormProvider {...postTypeForm}>
						<PostTypeForm isTransitioning={isTransitioning} />
					</FormProvider>
				)
			case 2: {
				const selectedType = postTypeForm.watch('type')
				let FormComponent

				switch (selectedType) {
					case '1':
						FormComponent = PostSendOldItemform
						break
					case '2':
						FormComponent = PostSendLostItemForm
						break
					case '3':
						FormComponent = PostFindItemForm
						break
					case '4':
						FormComponent = PostForm
						break
					default:
						FormComponent = PostForm
				}

				return (
					<FormProvider {...postInfoForm}>
						<Suspense fallback={<Loading />}>
							<FormComponent isTransitioning={isTransitioning} />
						</Suspense>
					</FormProvider>
				)
			}
			default:
				return null
		}
	}

	return (
		<>
			<div className='container mx-auto grid w-full grid-cols-1 gap-6 py-12 md:grid-cols-3'>
				<div className='top-0 col-span-1 md:top-16'>
					<Instruction />
				</div>
				<div className='col-span-1 md:col-span-2'>
					<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
						<ProgressBar currentStep={isCompleted ? 3 : currentStep} />

						<div className='mb-8 min-h-[400px]'>{renderCurrentForm()}</div>

						{!isCompleted && (
							<div className='border-border flex items-center justify-between border-t pt-6'>
								{(currentStep > 0 && !isAuthenticated) ||
								(currentStep > 1 && isAuthenticated) ? (
									<SecondaryButton onClick={handleBack}>
										Quay lại
									</SecondaryButton>
								) : (
									<div></div>
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
											className='bg-success hover:bg-success/90 flex items-center rounded-lg px-6 py-2 font-medium text-white transition-colors duration-200'
										>
											<Send
												size={18}
												className='mr-2'
											/>{' '}
											Đăng bài
										</button>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default PostAction
