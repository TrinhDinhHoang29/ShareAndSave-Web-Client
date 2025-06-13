import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { Camera, MapPin, Phone, Save, User } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import InputText from '@/components/common/InputText'
import Selection from '@/components/common/Selection'
import useAuthStore from '@/stores/authStore'

// Zod Schema
const studentSchema = z.object({
	fullName: z
		.string()
		.min(1, 'Họ và tên không được để trống')
		.min(2, 'Họ và tên phải có ít nhất 2 ký tự')
		.max(50, 'Họ và tên không được quá 50 ký tự'),
	majorID: z.number().min(1, 'Vui lòng chọn chuyên ngành'),
	phoneNumber: z
		.string()
		.min(1, 'Số điện thoại không được để trống')
		.regex(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
	address: z
		.string()
		.min(1, 'Địa chỉ không được để trống')
		.min(5, 'Địa chỉ phải có ít nhất 5 ký tự')
		.max(200, 'Địa chỉ không được quá 200 ký tự'),
	avatar: z.string().optional()
})

type StudentFormData = z.infer<typeof studentSchema>

const EditProfile = () => {
	const [avatar, setAvatar] = useState('')
	const majors = [
		{ id: 1, name: 'Công nghệ Kỹ thuật Điện, Điện tử' },
		{ id: 2, name: 'Công nghệ Kỹ thuật Điện tử - Viễn thông' },
		{ id: 3, name: 'Công nghệ Kỹ thuật Cơ khí' },
		{ id: 4, name: 'Công nghệ Kỹ thuật Ô tô' },
		{ id: 5, name: 'Công nghệ Kỹ thuật Thời trang' },
		{ id: 6, name: 'Công nghệ Kỹ thuật Nhiệt' },
		{ id: 7, name: 'Công nghệ Kỹ thuật Điện khí' },
		{ id: 8, name: 'Công nghệ Kỹ thuật Cơ điện tử' },
		{ id: 9, name: 'Kỹ thuật tin học' },
		{ id: 10, name: 'Công nghệ kỹ thuật' },
		{ id: 11, name: 'Sử dụng công nghệ' },
		{ id: 12, name: 'Hàn' },
		{ id: 13, name: 'Kỹ thuật máy lạnh và điều hòa không khí' },
		{ id: 14, name: 'Bảo trì, sửa chữa Ô tô' },
		{ id: 15, name: 'Điện công nghiệp' },
		{ id: 16, name: 'Điện tử công nghiệp' },
		{ id: 17, name: 'Quan trị mạng máy tính' },
		{ id: 18, name: 'Kỹ thuật xây dựng, lắp ráp máy tính' }
	]

	const { user } = useAuthStore()

	// React Hook Form setup with Zod resolver
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset
	} = useForm<StudentFormData>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			fullName: user?.fullName,
			majorID: majors.some(i => i.name === user?.major)
				? majors.find(i => i.name === user?.major)?.id || 0
				: 0,
			phoneNumber: user?.phoneNumber,
			address: user?.address,
			avatar: user?.avatar
		}
	})

	const onSubmit = async (data: StudentFormData) => {
		try {
			// // Add avatar to form data
			// const formDataWithAvatar = {
			//   ...data,
			//   avatar: avatar
			// };

			// // Simulate API call
			// await new Promise(resolve => setTimeout(resolve, 2000));

			// console.log('Profile updated:', formDataWithAvatar);

			// // Success notification could go here
			// alert('Thông tin đã được cập nhật thành công!');
			console.log(data)
		} catch (error) {
			console.error('Error updating profile:', error)
			alert('Có lỗi xảy ra khi cập nhật thông tin!')
		}
	}

	const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				alert('Kích thước file không được vượt quá 5MB')
				return
			}

			// Validate file type
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

	const handleCancel = () => {
		reset()
		setAvatar(user?.avatar || '')
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
							<div className='from-primary to-primary-foreground flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br'>
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
									accept='image/*'
									onChange={handleAvatarChange}
									className='hidden'
								/>
							</label>
						</div>
					</motion.div>

					{/* Form */}
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

						<Selection
							defaulTextOption='chuyên ngành'
							name='major'
							label='Chuyên Ngành'
							options={majors}
							register={register}
							error={errors.majorID}
							animationDelay={0.5}
							isLoading={false}
							disabled={false}
						/>

						<InputText
							name='phoneNumber'
							label='Số Điện Thoại'
							type='tel'
							placeholder='Nhập số điện thoại'
							register={register}
							error={errors.phoneNumber}
							icon={Phone}
							animationDelay={0.6}
							autocompleted='off'
						/>

						<InputText
							name='address'
							label='Địa Chỉ'
							type='textarea'
							placeholder='Nhập địa chỉ của bạn'
							register={register}
							error={errors.address}
							icon={MapPin}
							animationDelay={0.7}
							rows={4}
							autocompleted='off'
						/>

						{/* Action Buttons */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8, duration: 0.5 }}
							className='flex gap-4 pt-6'
						>
							<button
								onClick={handleSubmit(onSubmit)}
								className='from-primary to-primary-foreground hover:from-primary/90 hover:to-primary-foreground flex flex-1 transform items-center justify-center gap-2 rounded-lg bg-gradient-to-r px-6 py-3 font-semibold text-white transition-all duration-200 hover:scale-105 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50'
							>
								<Save className='h-5 w-5' />
								Lưu Thay Đổi
							</button>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</div>
	)
}

export default EditProfile
