import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ProgressBarProps {
	currentStep: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => (
	<div className='mb-8'>
		<div className='relative flex items-center justify-between'>
			<div className='bg-muted absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 transform' />
			<motion.div
				className='bg-primary absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transform'
				initial={{ width: '0%' }}
				animate={{
					width: currentStep === 0 ? '0%' : currentStep === 1 ? '50%' : '100%'
				}}
				transition={{ duration: 0.5, ease: 'easeOut' }}
			/>
			{[1, 2, 3].map(step => (
				<div
					key={step}
					className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all duration-300 ${
						step <= currentStep
							? 'bg-primary border-primary text-primary-foreground'
							: 'bg-card border-muted-foreground text-muted-foreground'
					} ${step === currentStep ? 'ring-primary/50 ring-2' : ''}`}
				>
					{step <= currentStep ? <Check size={16} /> : step}
				</div>
			))}
		</div>
		<div className='mt-2 flex justify-between text-sm'>
			<span
				className={currentStep >= 0 ? 'text-primary' : 'text-muted-foreground'}
			>
				Thông tin cá nhân
			</span>
			<span
				className={currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}
			>
				Thông tin đồ vật
			</span>
			<span
				className={currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}
			>
				Lịch hẹn
			</span>
		</div>
	</div>
)

export default ProgressBar
