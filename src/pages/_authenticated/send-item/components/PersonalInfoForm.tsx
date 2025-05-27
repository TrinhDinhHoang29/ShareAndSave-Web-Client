import { User } from 'lucide-react'
import { useFormContext } from 'react-hook-form'

import InputText from '@/components/common/InputText'
import { PersonalInfo } from '@/models/types'

interface PersonalInfoFormProps {
	isTransitioning: boolean
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
	isTransitioning
}) => {
	const {
		register,
		formState: { errors }
	} = useFormContext<PersonalInfo>()

	return (
		<div
			className={`space-y-6 transition-all duration-200 ${isTransitioning ? 'translate-x-4 opacity-0' : 'translate-x-0 opacity-100'}`}
		>
			<div className='mb-8 text-center'>
				<div className='bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full'>
					<User className='text-primary h-8 w-8' />
				</div>
				<h3 className='text-foreground mb-2 text-2xl font-bold'>
					Thông tin cá nhân
				</h3>
				<p className='text-muted-foreground'>
					Hãy cho chúng tôi biết thông tin liên lạc của bạn
				</p>
			</div>

			<div className='space-y-4'>
				<InputText
					name='fullName'
					label='Họ và tên *'
					placeholder='Nhập họ và tên đầy đủ'
					register={register}
					error={errors.fullName}
				/>
				<InputText
					name='email'
					label='Email *'
					type='email'
					placeholder='example@email.com'
					register={register}
					error={errors.email}
				/>
				<InputText
					name='phone'
					label='Số điện thoại *'
					type='tel'
					placeholder='0123 456 789'
					register={register}
					error={errors.phone}
				/>
			</div>
		</div>
	)
}

export default PersonalInfoForm
