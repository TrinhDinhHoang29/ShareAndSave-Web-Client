import { Search } from 'lucide-react'
import { FieldError, useFormContext } from 'react-hook-form'

import DatePicker from '@/components/common/DatePicker'
import ImageUpload from '@/components/common/ImageUpload'
import InputText from '@/components/common/InputText'
import { PostInfo } from '@/models/types'

interface PostSendLostItemFormProps {
	isTransitioning: boolean
}

const PostSendLostItemForm: React.FC<PostSendLostItemFormProps> = ({
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
					<Search className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground mb-2 text-2xl font-bold'>
					Nhặt đồ thất lạc
				</h3>
				<p className='text-muted-foreground'>
					Nhập thông tin bài đăng cho nhặt đồ thất lạc
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
						Ví dụ: 'Nhặt được ví da màu đen'
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
						Ví dụ: 'Ví da màu đen, nhặt được ở công viên vào ngày 20/05'
					</p>
				</div>
				<div>
					<DatePicker
						name='foundDate'
						label='Ngày nhặt được'
						error={errors.foundDate}
						register={register}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Chọn ngày bạn nhặt được món đồ
					</p>
				</div>
				<div>
					<InputText
						name='foundLocation'
						label='Nơi nhặt được'
						placeholder='Nhập nơi nhặt được'
						register={register}
						error={errors.foundLocation}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>
						Ví dụ: 'Công viên Tao Đàn, TP.HCM'
					</p>
				</div>
				<div>
					<InputText
						name='category'
						label='Loại đồ vật'
						placeholder='Nhập loại đồ vật'
						register={register}
						error={errors.category}
					/>
					<p className='text-muted-foreground mt-1 text-sm'>Ví dụ: 'Ví'</p>
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

export default PostSendLostItemForm
