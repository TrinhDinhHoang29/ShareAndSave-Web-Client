import { Users } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import ImageUpload from '@/components/common/ImageUpload'
import InputText from '@/components/common/InputText'
import { PostInfo } from '@/models/types'

interface PostFormProps {
	isTransitioning: boolean
}

const PostForm: React.FC<PostFormProps> = ({ isTransitioning }) => {
	const {
		register,
		formState: { errors },
		control
	} = useFormContext<PostInfo>()

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<Users className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground mb-2 text-2xl font-bold'>Tự do</h3>
				<p className='text-muted-foreground'>Nhập thông tin bài đăng</p>
			</div>

			<div className='space-y-4'>
				<div>
					<InputText
						name='title'
						label='Tiêu đề *'
						placeholder='Nhập tiêu đề bài đăng'
						register={register}
						error={errors.title}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: 'Tìm điện thoại iPhone 12 bị mất'
					</p>
				</div>
				<div>
					<InputText
						name='description'
						label='Mô tả *'
						type='textarea'
						placeholder='Nhập mô tả món đồ'
						register={register}
						error={errors.description}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: 'Điện thoại iPhone 12, màu đen, làm mất ở bến xe vào ngày
						25/05'
					</p>
				</div>
				<div className='space-y-2'>
					<Controller
						name='images'
						control={control}
						render={({ field }) => (
							<ImageUpload
								name='images'
								label='Hình ảnh'
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
					<p className='text-muted-foreground mt-1 text-sm'>
						Tải lên hình ảnh của món đồ (nếu có)
					</p>
				</div>
			</div>
		</div>
	)
}

export default PostForm
