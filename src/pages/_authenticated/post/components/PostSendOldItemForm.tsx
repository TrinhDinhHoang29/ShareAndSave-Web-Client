import { Package } from 'lucide-react'
import { FieldError, useFormContext } from 'react-hook-form'

import ImageUpload from '@/components/common/ImageUpload'
import InputText from '@/components/common/InputText'
import { PostInfo } from '@/models/types'

interface PostSendOldItemFormProps {
	isTransitioning: boolean
}

const PostSendOldItemForm: React.FC<PostSendOldItemFormProps> = ({
	isTransitioning
}) => {
	const {
		register,
		formState: { errors },
		watch,
		setValue
	} = useFormContext<PostInfo>()

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<Package className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground mb-2 text-2xl font-bold'>Gửi đồ cũ</h3>
				<p className='text-muted-foreground'>
					Nhập thông tin bài đăng cho đồ cũ
				</p>
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
						Ví dụ: 'Tặng áo thun cũ còn mới'
					</p>
				</div>
				<div>
					<InputText
						name='description'
						label='Mô tả món đồ *'
						type='textarea'
						placeholder='Nhập mô tả món đồ'
						register={register}
						error={errors.description}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: 'Áo thun màu xanh, size M, đã qua sử dụng nhưng còn mới 80%'
					</p>
				</div>
				<div>
					<InputText
						name='condition'
						label='Tình trạng đồ'
						placeholder='Nhập tình trạng đồ'
						register={register}
						error={errors.condition}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: 'Còn mới 80%'
					</p>
				</div>
				<div>
					<InputText
						name='category'
						label='Danh mục đồ'
						placeholder='Nhập danh mục đồ'
						register={register}
						error={errors.category}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>Ví dụ: 'Quần áo'</p>
				</div>
				<div>
					<ImageUpload
						name='images'
						label='Hình ảnh'
						watch={watch}
						setValue={setValue}
						error={errors.images as FieldError}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Tải lên hình ảnh của món đồ (nếu có)
					</p>
				</div>
			</div>
		</div>
	)
}

export default PostSendOldItemForm
