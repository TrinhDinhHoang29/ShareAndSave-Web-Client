import { motion } from 'framer-motion'

const PodiumTopSkeleton: React.FC = () => {
	const renderPodiumSkeleton = (position: 'left' | 'center' | 'right') => {
		const style =
			position === 'center'
				? { size: 'h-20 w-20', cardWidth: 'min-w-[140px]', shadow: 'shadow-xl' }
				: { size: 'h-16 w-16', cardWidth: 'min-w-[120px]', shadow: 'shadow-lg' }

		return (
			<div
				className={`flex flex-col items-center ${position === 'center' ? 'relative' : ''}`}
			>
				{/* Crown placeholder for first place */}
				{position === 'center' && (
					<div className='bg-muted absolute -top-8 h-8 w-8 animate-pulse rounded-full' />
				)}

				{/* Avatar placeholder */}
				<div className='relative mb-3'>
					<div
						className={`bg-muted ${style.size} animate-pulse rounded-full`}
					/>
					{/* Badge placeholder */}
					<div className='bg-muted absolute -top-2 -right-2 animate-pulse rounded-full p-1.5' />
				</div>

				{/* User info card placeholder */}
				<div
					className={`bg-muted/20 ${style.cardWidth} rounded-lg p-4 text-center ${style.shadow} animate-pulse`}
				>
					<div className='bg-muted mx-auto mb-1 h-6 w-3/4 rounded' />
					<div className='bg-muted mx-auto h-8 w-1/2 rounded' />
					<div className='bg-muted mx-auto mt-1 h-4 w-1/3 rounded' />
					{position !== 'center' && (
						<div className='bg-muted mx-auto mt-2 h-4 w-1/4 rounded' />
					)}
				</div>
			</div>
		)
	}

	return (
		<div className='mb-8'>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='mb-6 flex items-end justify-center gap-4'
			>
				{renderPodiumSkeleton('left')}
				{renderPodiumSkeleton('center')}
				{renderPodiumSkeleton('right')}
			</motion.div>
		</div>
	)
}

export default PodiumTopSkeleton
