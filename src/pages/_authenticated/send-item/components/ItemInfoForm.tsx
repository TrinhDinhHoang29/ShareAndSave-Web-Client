import { Package } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import ImageUpload from '@/components/common/ImageUpload'
import InputText from '@/components/common/InputText'
import { ItemInfo } from '@/models/types'

interface ItemInfoFormProps {
	isTransitioning: boolean
	handleImageUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const ItemInfoForm: React.FC<ItemInfoFormProps> = ({
	isTransitioning,
	handleImageUpload
}) => {
	const {
		register,
		watch,
		setValue,
		formState: { errors }
	} = useFormContext<ItemInfo>()

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<Package className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground mb-2 text-2xl font-bold'>
					Thông tin món đồ
				</h3>
				<p className='text-muted-foreground'>
					Hãy chia sẻ hình ảnh và mô tả chi tiết
				</p>
			</div>

			<div className='space-y-4'>
				{/* <ImageUpload
					name='image'
					label='Hình ảnh món đồ *'
					watch={watch}
					setValue={setValue}
					handleImageUpload={handleImageUpload}
					error={Array.isArray(errors.image) ? errors.image[0] : errors.image}
					maxImages={5}
				/> */}
				<InputText
					name='description'
					label='Mô tả món đồ *'
					type='textarea'
					placeholder='Hãy mô tả chi tiết về món đồ...'
					register={register}
					error={errors.description}
				/>
			</div>
		</div>
	)
}

export default ItemInfoForm
