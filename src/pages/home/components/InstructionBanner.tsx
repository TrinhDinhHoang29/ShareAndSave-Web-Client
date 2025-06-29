import { animate, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
// import { useInView } from 'react-intersection-observer'
// import { useNavigate } from 'react-router-dom'

// Simple useInView hook replacement
const useInView = (options: { threshold: number; triggerOnce: boolean }) => {
	const [ref, setRef] = useState<HTMLDivElement | null>(null)
	const [inView, setInView] = useState(false)

	useEffect(() => {
		if (!ref) return

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !inView) {
					setInView(true)
					if (options.triggerOnce) {
						observer.disconnect()
					}
				}
			},
			{ threshold: options.threshold }
		)

		observer.observe(ref)
		return () => observer.disconnect()
	}, [ref, inView, options.threshold, options.triggerOnce])

	return { ref: setRef, inView }
}

// Counter component with animation
const AnimatedCounter = ({
	target,
	suffix = '',
	duration = 2,
	isVisible
}: {
	target: number
	suffix?: string
	duration?: number
	isVisible: boolean
}) => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		if (!isVisible) return

		const controls = animate(0, target, {
			duration,
			ease: 'easeOut',
			onUpdate: value => {
				setCount(Math.floor(value))
			}
		})

		return controls.stop
	}, [isVisible, target, duration])

	return (
		<span>
			{count.toLocaleString()}
			{suffix}
		</span>
	)
}

export default function InstructionBanner() {
	// const navigate = useNavigate()

	// Intersection observer for stats section
	const { ref: statsRef, inView: statsInView } = useInView({
		threshold: 0.3,
		triggerOnce: true
	})

	const itemVariants = {
		hidden: { y: 20, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
				ease: 'easeOut'
			}
		}
	}

	return (
		<motion.div
			ref={statsRef}
			className='from-primary/10 to-background bg-gradient-to-b p-6 backdrop-blur-sm'
			variants={itemVariants}
		>
			<div className='container mx-auto'>
				<div className='grid grid-cols-2 gap-6 text-center lg:grid-cols-4'>
					<motion.div
						className='group'
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<motion.div
							className='from-success to-success/80 mb-1 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
						>
							<AnimatedCounter
								target={58}
								suffix='+'
								duration={2.5}
								isVisible={statsInView}
							/>
						</motion.div>
						<div className='text-muted-foreground text-base font-medium'>
							Món đồ được chia sẻ
						</div>
					</motion.div>
					<motion.div
						className='group'
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<motion.div
							className='from-primary to-primary/80 mb-1 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.5 }}
						>
							<AnimatedCounter
								target={148}
								suffix='+'
								duration={2.2}
								isVisible={statsInView}
							/>
						</motion.div>
						<div className='text-muted-foreground text-base font-medium'>
							Thành viên tích cực
						</div>
					</motion.div>
					<motion.div
						className='group'
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<motion.div
							className='from-warning to-warning/80 mb-1 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.7, duration: 0.5 }}
						>
							<AnimatedCounter
								target={32}
								suffix='+'
								duration={2.0}
								isVisible={statsInView}
							/>
						</motion.div>
						<div className='text-muted-foreground text-base font-medium'>
							Đồ thất lạc được tìm thấy
						</div>
					</motion.div>
					<motion.div
						className='group'
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<motion.div
							className='from-secondary to-secondary/80 mb-1 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.9, duration: 0.5 }}
						>
							<AnimatedCounter
								target={98}
								suffix='%'
								duration={1.8}
								isVisible={statsInView}
							/>
						</motion.div>
						<div className='text-muted-foreground text-base font-medium'>
							Mức độ hài lòng
						</div>
					</motion.div>
				</div>
			</div>
		</motion.div>
	)
}
