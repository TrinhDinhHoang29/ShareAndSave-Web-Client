import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import {
	Award,
	Camera,
	Mail,
	MapPin,
	PhoneCall,
	Save,
	User
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import InputText from '@/components/common/InputText'
import PrimaryButton from '@/components/common/PrimaryButton'
import Selection from '@/components/common/Selection'
import { useUpdateUserMutation } from '@/hooks/mutations/use-auth.mutation'
import { IMajor, IUser } from '@/models/interfaces'
import { userProfileSchema } from '@/models/schema'
import { UserProfileFormData } from '@/models/types'
import useAuthStore from '@/stores/authStore'

// Zod Schema

const EditProfile = () => {
	const [avatar, setAvatar] = useState('')

	const majors: IMajor[] = [
		{ id: 1, name: 'Công nghệ Kỹ thuật Điện' },
		{ id: 2, name: 'Công nghệ Kỹ thuật Điện tử - Viễn thông' },
		{ id: 3, name: 'Công nghệ Kỹ thuật Cơ khí' },
		{ id: 4, name: 'Công nghệ Kỹ thuật Ô tô' },
		{ id: 5, name: 'Công nghệ Thông tin' },
		{ id: 6, name: 'Công nghệ Kỹ thuật Nhiệt' },
		{ id: 7, name: 'Công nghệ Kỹ thuật Điều khiển và Tự động hóa' },
		{ id: 8, name: 'Công nghệ Kỹ thuật Cơ điện tử' },
		{ id: 9, name: 'Kế toán tin học' },
		{ id: 10, name: 'Cơ khí chế tạo' },
		{ id: 11, name: 'Sửa chữa cơ khí' },
		{ id: 12, name: 'Hàn' },
		{ id: 13, name: 'Kỹ thuật máy lạnh và điều hòa không khí' },
		{ id: 14, name: 'Bảo trì, sửa chữa Ô tô' },
		{ id: 15, name: 'Điện công nghiệp' },
		{ id: 16, name: 'Điện tử công nghiệp' },
		{ id: 17, name: 'Quản trị mạng máy tính' },
		{ id: 18, name: 'Kỹ thuật sửa chữa, lắp ráp máy tính' }
	]

	const { user } = useAuthStore()

	// React Hook Form setup with Zod resolver
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue
	} = useForm<UserProfileFormData>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			fullName: user?.fullName || '',
			majorID: majors.some(i => i.name === user?.major)
				? majors.find(i => i.name === user?.major)?.id
				: undefined,
			address: user?.address || '',
			avatar: user?.avatar || '',
			status: user?.status
		}
	})

	const { mutate: updateUserMutation } = useUpdateUserMutation({
		onSuccess: (userData: IUser) => {
			userData = {
				...userData,
				email: user?.email,
				goodPoint: user?.goodPoint,
				phoneNumber: user?.phoneNumber || ''
			}
			useAuthStore.setState({ user: userData })
		}
	})

	// Set initial avatar when component mounts
	useEffect(() => {
		if (user?.avatar) {
			setAvatar(user.avatar)
			setValue('avatar', user.avatar)
		}
	}, [user?.avatar, setValue])

	const onSubmit = async (data: UserProfileFormData) => {
		try {
			const { majorID, ...rest } = data
			const userDataRequest: IUser = {
				...rest,
				major: majors.find(i => i.id === majorID)?.name
			}
			updateUserMutation({ clientID: user?.id || 0, data: userDataRequest })
		} catch (error) {
			console.error('Error updating profile:', error)
			alert('Có lỗi xảy ra khi cập nhật thông tin!')
		}
	}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			if (file.size > 5 * 1024 * 1024) {
				alert('Kích thước file không được vượt quá 5MB')
				return
			}
			if (!file.type.startsWith('image/')) {
				alert('Vui lòng chọn file hình ảnh')
				return
			}
			const reader = new FileReader()
			reader.onload = e => {
				const result = e.target?.result as string
				setAvatar(result)
				setValue('avatar', result)
			}
			reader.readAsDataURL(file)
		}
	}

	return (
		<div className='bg-background dark:bg-background min-h-screen px-4 py-8'>
			<div className='mx-auto max-w-2xl'>
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className='bg-card dark:bg-card rounded-2xl p-8 shadow-xl'
				>
					{/* Header */}
					<div className='mb-8 text-center'>
						<motion.h1
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1, duration: 0.5 }}
							className='text-foreground dark:text-foreground mb-2 text-3xl font-bold'
						>
							Chỉnh Sửa Thông Tin
						</motion.h1>
						<motion.p
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className='text-muted-foreground dark:text-muted-foreground'
						>
							Cập nhật thông tin cá nhân của bạn
						</motion.p>
					</div>

					{/* Avatar Section */}
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className='mb-8 flex justify-center'
					>
						<div className='relative'>
							<div className='from-primary to-primary-foreground flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br shadow-md'>
								{avatar ? (
									<img
										src={avatar}
										alt='Avatar'
										className='h-full w-full object-cover'
									/>
								) : (
									<User className='text-primary-foreground h-12 w-12' />
								)}
							</div>
							<label className='bg-primary hover:bg-primary/90 text-primary-foreground absolute -right-2 -bottom-2 cursor-pointer rounded-full p-2 shadow-lg transition-colors'>
								<Camera className='h-4 w-4' />
								<input
									type='file'
									accept='image/jpeg,image/jpg,image/png,image/gif'
									onChange={handleAvatarChange}
									className='hidden'
								/>
							</label>
						</div>
					</motion.div>

					{/* Static Information Section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35, duration: 0.5 }}
						className='border-border bg-muted/30 mb-8 rounded-lg border p-6'
					>
						<h3 className='text-foreground mb-4 text-lg font-semibold'>
							Thông Tin
						</h3>
						<div className='space-y-4'>
							{/* Email */}
							<div className='flex items-center gap-3'>
								<div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
									<Mail className='text-primary h-5 w-5' />
								</div>
								<div className='flex-1'>
									<p className='text-muted-foreground text-sm'>
										Email đã xác thực
									</p>
									<p className='text-foreground font-medium'>
										{user?.email || 'Chưa cập nhật'}
									</p>
								</div>
							</div>

							{/* Phone Number (Static) */}
							<div className='flex items-center gap-3'>
								<div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
									<PhoneCall className='text-primary h-5 w-5' />
								</div>
								<div className='flex-1'>
									<p className='text-muted-foreground text-sm'>Số điện thoại</p>
									<p className='text-foreground font-medium'>
										{user?.phoneNumber || 'Chưa cập nhật'}
									</p>
								</div>
							</div>

							{/* Good Point */}
							<div className='flex items-center gap-3'>
								<div className='bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full'>
									<Award className='text-primary h-5 w-5' />
								</div>
								<div className='flex-1'>
									<p className='text-muted-foreground text-sm'>Điểm tích lũy</p>
									<p className='text-foreground font-medium'>
										{user?.goodPoint !== undefined
											? `${user.goodPoint} điểm`
											: 'Chưa có điểm'}
									</p>
								</div>
							</div>
						</div>
					</motion.div>

					{/* Editable Form */}
					<div className='space-y-6'>
						<InputText
							name='fullName'
							label='Họ và Tên'
							placeholder='Nhập họ và tên của bạn'
							register={register}
							error={errors.fullName}
							icon={User}
							animationDelay={0.4}
							autocompleted='off'
						/>

						<InputText
							name='address'
							label='Địa Chỉ'
							type='text'
							placeholder='Nhập địa chỉ của bạn'
							register={register}
							error={errors.address}
							icon={MapPin}
							animationDelay={0.5}
							rows={4}
							autocompleted='off'
						/>

						<Selection
							name='majorID'
							label='Chuyên Ngành'
							options={majors}
							register={register}
							error={errors.majorID}
							animationDelay={0.6}
							defaulTextOption='chuyên ngành'
							isLoading={false}
							disabled={false}
						/>

						{/* Action Buttons */}
						<div className='flex gap-4 pt-4'>
							<PrimaryButton
								onClick={handleSubmit(onSubmit, errors => console.log(errors))}
								icon={<Save className='h-5 w-5' />}
								className='flex w-full items-center justify-center gap-2 py-2'
							>
								Lưu Thay Đổi
							</PrimaryButton>
						</div>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default EditProfile
