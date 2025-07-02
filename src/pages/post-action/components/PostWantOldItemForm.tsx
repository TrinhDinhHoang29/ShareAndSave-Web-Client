import { Package } from 'lucide-react'
import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import ImageUpload from '@/components/common/ImageUpload'
import InputText from '@/components/common/InputText'
import { PostInfo } from '@/models/types'

import ItemManager from './ItemManager'

interface PostSendOldItemFormProps {
	isTransitioning: boolean
}

const PostSendOldItemForm: React.FC<PostSendOldItemFormProps> = ({
	isTransitioning
}) => {
	const {
		control,
		register,
		formState: { errors }
	} = useFormContext<PostInfo>()

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${
				isTransitioning
					? 'translate-x-4 opacity-0'
					: 'translate-x-0 opacity-100'
			}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<Package className='text-primary h-8 w-8' />
				</div>
				<h3 className='font-manrope text-foreground mb-2 text-2xl font-semibold'>
					Xin nhận đồ cũ
				</h3>
				<p className='text-muted-foreground'>
					Nhập thông tin bài đăng cho xin nhận đồ cũ
				</p>
			</div>

			<div className='space-y-4'>
				<div className='space-y-2'>
					<InputText
						name='title'
						label='Tiêu đề *'
						placeholder='Nhập tiêu đề bài đăng'
						register={register}
						error={errors.title}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: "Xin nhận áo thun cũ còn mới"
					</p>
				</div>

				<ItemManager
					newItemsFieldName='newItems'
					oldItemsFieldName='oldItems'
					label='Món đồ *'
					description='Bấm vào dấu "+" để thêm món đồ'
					animationDelay={0.2}
				/>

				<div className='space-y-2'>
					<Controller
						name='images'
						control={control}
						render={({ field }) => (
							<ImageUpload
								name='images'
								label='Hình ảnh *'
								field={field}
								error={
									Array.isArray(errors.images)
										? errors.images[0]
										: errors.images
								}
								type='multiple'
								animationDelay={0.4}
							/>
						)}
					/>
				</div>

				<div className='space-y-2'>
					<InputText
						name='description'
						label='Mô tả món đồ *'
						type='textarea'
						placeholder='Nhập mô tả món đồ'
						register={register}
						error={errors.description}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: "Xin nhận áo thun màu xanh, size M, đã qua sử dụng nhưng còn
						mới 80%"
					</p>
				</div>
			</div>
		</div>
	)
}

export default PostSendOldItemForm
