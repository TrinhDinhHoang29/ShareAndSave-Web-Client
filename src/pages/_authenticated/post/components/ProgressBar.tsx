import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface ProgressBarProps {
	currentStep: number
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
	// Tính toán width của thanh progress
	const getProgressWidth = () => {
		if (currentStep >= 3) return '100%' // Hoàn thành tất cả
		if (currentStep === 2) return '100%' // Bước cuối
		if (currentStep === 1) return '50%' // Bước giữa
		return '0%' // Bước đầu
	}

	return (
		<div className='mb-8'>
			<div className='relative flex items-center justify-between'>
				<div className='bg-muted absolute top-1/2 right-0 left-0 h-0.5 -translate-y-1/2 transform' />
				<motion.div
					className='bg-primary absolute top-1/2 left-0 h-0.5 -translate-y-1/2 transform'
					initial={{ width: '0%' }}
					animate={{ width: getProgressWidth() }}
					transition={{ duration: 0.5, ease: 'easeOut' }}
				/>
				{[1, 2, 3].map(step => {
					const isCompleted = currentStep >= 3 ? true : step <= currentStep
					const isActive = step === currentStep && currentStep < 3

					return (
						<motion.div
							key={step}
							className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border transition-all duration-300 ${
								isCompleted
									? 'bg-primary border-primary text-primary-foreground'
									: 'bg-card border-muted-foreground text-muted-foreground'
							} ${isActive ? 'ring-primary/50 ring-2' : ''}`}
							animate={isCompleted ? { scale: [1, 1.1, 1] } : { scale: 1 }}
							transition={{ duration: 0.3 }}
						>
							{isCompleted ? <Check size={16} /> : step}
						</motion.div>
					)
				})}
			</div>
			<div className='mt-2 flex justify-between text-sm'>
				<span
					className={
						currentStep >= 0 ? 'text-primary' : 'text-muted-foreground'
					}
				>
					Thông tin cá nhân
				</span>
				<span
					className={
						currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'
					}
				>
					Loại bài đăng
				</span>
				<span
					className={
						currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'
					}
				>
					Thông tin bài đăng
				</span>
			</div>
		</div>
	)
}

export default ProgressBar
