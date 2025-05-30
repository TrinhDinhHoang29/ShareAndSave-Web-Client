import { Gift, Package, Search, Star, Users } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import { EPostType } from '@/models/enums'
import { PostType } from '@/models/types'

import RadioGroup from './RadioGroup'

interface PostTypeFormProps {
	isTransitioning: boolean
}

const PostTypeForm: React.FC<PostTypeFormProps> = ({ isTransitioning }) => {
	const {
		register,
		formState: { errors }
	} = useFormContext<PostType>()

	// Định nghĩa các tùy chọn cho RadioGroup
	const postTypeOptions = [
		{
			value: EPostType.SEND_OLD, // Đổi thành number
			title: 'Gửi đồ cũ',
			description: 'Đồ đã qua sử dụng nhưng vẫn còn giá trị',
			icon: <Package size={20} />
		},
		{
			value: EPostType.SEND_LOST,
			title: 'Gửi đồ thất lạc',
			description: 'Đồ bạn nhặt được và muốn trả lại',
			icon: <Search size={20} />
		},
		{
			value: EPostType.FIND,
			title: 'Tìm đồ',
			description: 'Tìm kiếm đồ bạn đã làm mất',
			icon: <Gift size={20} />
		},
		{
			value: EPostType.FREE,
			title: 'Tự do',
			description: 'Chia sẻ bất kỳ yêu cầu nào khác',
			icon: <Users size={20} />
		}
	]

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<Star className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground mb-2 text-2xl font-bold'>
					Chọn loại bài đăng
				</h3>
				<p className='text-muted-foreground'>Chọn loại bài đăng phù hợp</p>
			</div>

			<div className='space-y-4'>
				{/* Radio Group để chọn loại bài đăng */}
				<RadioGroup
					name='type'
					options={postTypeOptions}
					register={register}
					error={errors.type}
					defaultValue={undefined} // Mặc định chọn "Gửi đồ cũ" (value: 0)
				/>
			</div>
		</div>
	)
}

export default PostTypeForm
