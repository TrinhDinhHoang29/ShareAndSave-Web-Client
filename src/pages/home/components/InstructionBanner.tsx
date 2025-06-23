import { animate, motion } from 'framer-motion'
import {
	ArrowRight,
	Gift,
	Heart,
	Package,
	Recycle,
	Search,
	TrendingUp,
	Users
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router-dom'

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

export default function HomepageBanner() {
	const navigate = useNavigate()

	// Intersection observer for stats section
	const { ref: statsRef, inView: statsInView } = useInView({
		threshold: 0.3,
		triggerOnce: true
	})

	const handleGiveAwayClick = () => {
		navigate('dang-bai')
	}

	const handleFindItemsClick = () => {
		navigate('dang-bai')
	}

	const handleExploreClick = () => {
		navigate('kho-do-cu')
	}

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2
			}
		}
	}

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

	const cardVariants = {
		hidden: { y: 30, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.6,
				ease: 'easeOut'
			}
		},
		hover: {
			y: -5,
			scale: 1.02,
			transition: {
				duration: 0.2,
				ease: 'easeInOut'
			}
		}
	}

	const floatVariants = {
		float: {
			y: [-10, 10, -10],
			transition: {
				duration: 3,
				repeat: Infinity,
				ease: 'easeInOut'
			}
		}
	}

	return (
		<div className='bg-background relative min-h-screen overflow-hidden'>
			{/* Gradient background with theme colors */}
			<div className='absolute inset-0'>
				<div className='from-primary/5 via-background to-accent/20 absolute top-0 left-0 h-full w-full bg-gradient-to-br'></div>
				<div className='from-primary/10 to-success/10 absolute top-20 left-20 h-64 w-64 rounded-full bg-gradient-to-r blur-3xl'></div>
				<div className='from-success/8 to-primary/8 absolute top-40 right-20 h-80 w-80 rounded-full bg-gradient-to-r blur-3xl'></div>
				<div className='from-accent/20 to-secondary/10 absolute bottom-20 left-1/3 h-72 w-72 rounded-full bg-gradient-to-r blur-3xl'></div>
			</div>

			{/* Floating elements with framer-motion */}
			<div className='pointer-events-none absolute inset-0 overflow-hidden'>
				<motion.div
					className='absolute top-1/4 left-1/5 opacity-20'
					variants={floatVariants}
					animate='float'
				>
					<Recycle className='text-success h-6 w-6' />
				</motion.div>
				<motion.div
					className='absolute top-1/3 right-1/4 opacity-20'
					variants={floatVariants}
					animate='float'
					transition={{ delay: 1 }}
				>
					<Heart className='text-primary h-5 w-5' />
				</motion.div>
				<motion.div
					className='absolute bottom-1/3 left-1/6 opacity-20'
					variants={floatVariants}
					animate='float'
					transition={{ delay: 2 }}
				>
					<Users className='text-secondary h-6 w-6' />
				</motion.div>
			</div>

			<div className='relative z-10 container py-20'>
				<motion.div
					className='mx-auto max-w-6xl'
					variants={containerVariants}
					initial='hidden'
					animate='visible'
				>
					{/* Header section */}
					<div className='mb-16 text-center'>
						<motion.div
							className='glass mb-8 inline-flex items-center gap-2 rounded-full px-6 py-3'
							variants={itemVariants}
						>
							<motion.div
								animate={{ rotate: 360 }}
								transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
							>
								<TrendingUp className='text-primary h-4 w-4' />
							</motion.div>
							<span className='text-foreground text-sm font-medium'>
								Cộng đồng chia sẻ trường Cao Thắng
							</span>
						</motion.div>

						<motion.h1
							className='mb-6 text-4xl leading-tight font-bold lg:text-6xl'
							variants={itemVariants}
						>
							<div className='text-foreground space-x-2'>
								<span>Chia sẻ</span>
								<span>Tạo Nên</span>
							</div>
							<span className='from-primary via-success to-primary bg-gradient-to-r bg-clip-text text-transparent'>
								Giá Trị Mới
							</span>
						</motion.h1>

						<motion.p
							className='text-muted-foreground mb-8 text-center text-lg leading-relaxed lg:text-xl'
							variants={itemVariants}
						>
							Nền tảng kết nối cộng đồng chia sẻ <strong>đồ cũ</strong> và tìm
							kiếm <strong>đồ thất lạc</strong>.
							<br />
							Mỗi món đồ được chia sẻ là một cơ hội để giúp đỡ chúng tôi tạo ra
							nhiều chiến dịch để giúp đỡ mọi người.
						</motion.p>

						<motion.div
							className='mb-12 flex flex-wrap justify-center gap-3'
							variants={itemVariants}
						>
							<motion.div
								className='bg-card border-border flex items-center gap-2 rounded-full border px-4 py-2'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className='bg-success h-2 w-2 rounded-full'
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 2, repeat: Infinity }}
								></motion.div>
								<span className='text-muted-foreground text-sm'>
									Hoàn toàn miễn phí
								</span>
							</motion.div>
							<motion.div
								className='bg-card border-border flex items-center gap-2 rounded-full border px-4 py-2'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className='bg-primary h-2 w-2 rounded-full'
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
								></motion.div>
								<span className='text-muted-foreground text-sm'>
									Bảo mật thông tin
								</span>
							</motion.div>
							<motion.div
								className='bg-card border-border flex items-center gap-2 rounded-full border px-4 py-2'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className='bg-secondary h-2 w-2 rounded-full'
									animate={{ scale: [1, 1.2, 1] }}
									transition={{ duration: 2, repeat: Infinity, delay: 1 }}
								></motion.div>
								<span className='text-muted-foreground text-sm'>
									Cộng đồng thân thiện
								</span>
							</motion.div>
						</motion.div>
					</div>

					{/* Action cards */}
					<motion.div
						className='mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3'
						variants={containerVariants}
					>
						{/* Give away card */}
						<motion.div
							onClick={handleGiveAwayClick}
							className='group bg-card border-border relative cursor-pointer overflow-hidden rounded-2xl border p-8 shadow-sm'
							variants={cardVariants}
							whileHover='hover'
							whileTap={{ scale: 0.98 }}
						>
							<div className='from-success/5 to-success/10 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
							<div className='relative z-10'>
								<motion.div
									className='from-success/10 to-success/20 mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br'
									whileHover={{ scale: 1.1, rotate: 5 }}
									transition={{ duration: 0.2 }}
								>
									<Gift className='text-success h-6 w-6' />
								</motion.div>
								<h3 className='text-foreground mb-3 text-xl font-semibold'>
									Cho Tặng Đồ Cũ
								</h3>
								<p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
									Chia sẻ những món đồ còn tốt mà bạn không sử dụng. Giúp chúng
									có ý nghĩa mới với người cần.
								</p>
								<motion.div
									className='text-success flex items-center gap-2 text-sm font-medium'
									whileHover={{ gap: 12 }}
									transition={{ duration: 0.2 }}
								>
									<span>Đăng bài ngay</span>
									<ArrowRight className='h-4 w-4' />
								</motion.div>
							</div>
						</motion.div>

						{/* Find lost items card */}
						<motion.div
							onClick={handleFindItemsClick}
							className='group bg-card border-border relative cursor-pointer overflow-hidden rounded-2xl border p-8 shadow-sm'
							variants={cardVariants}
							whileHover='hover'
							whileTap={{ scale: 0.98 }}
						>
							<div className='from-primary/5 to-primary/10 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
							<div className='relative z-10'>
								<motion.div
									className='from-primary/10 to-primary/20 mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br'
									whileHover={{ scale: 1.1, rotate: -5 }}
									transition={{ duration: 0.2 }}
								>
									<Search className='text-primary h-6 w-6' />
								</motion.div>
								<h3 className='text-foreground mb-3 text-xl font-semibold'>
									Tìm Đồ Thất Lạc
								</h3>
								<p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
									Đăng thông tin về đồ vật nhặt được hoặc thất lạc. Kết nối để
									giúp đồ vật về với chủ nhân.
								</p>
								<motion.div
									className='text-primary flex items-center gap-2 text-sm font-medium'
									whileHover={{ gap: 12 }}
									transition={{ duration: 0.2 }}
								>
									<span>Đăng thông tin</span>
									<ArrowRight className='h-4 w-4' />
								</motion.div>
							</div>
						</motion.div>

						{/* Explore card */}
						<motion.div
							onClick={handleExploreClick}
							className='group bg-card border-border relative cursor-pointer overflow-hidden rounded-2xl border p-8 shadow-sm md:col-span-2 lg:col-span-1'
							variants={cardVariants}
							whileHover='hover'
							whileTap={{ scale: 0.98 }}
						>
							<div className='from-secondary/5 to-secondary/10 absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100'></div>
							<div className='relative z-10'>
								<motion.div
									className='from-secondary/10 to-secondary/20 mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br'
									whileHover={{ scale: 1.1, rotate: 10 }}
									transition={{ duration: 0.2 }}
								>
									<Package className='text-secondary h-6 w-6' />
								</motion.div>
								<h3 className='text-foreground mb-3 text-xl font-semibold'>
									Khám Phá Kho đồ cũ
								</h3>
								<p className='text-muted-foreground mb-6 text-sm leading-relaxed'>
									Các món đồ cũ sẽ được trưng bày để các sinh viên có thể xem
									xét và chọn ra các món đồ phù hợp với nhu cầu của mình.
								</p>
								<motion.div
									className='text-secondary flex items-center gap-2 text-sm font-medium'
									whileHover={{ gap: 12 }}
									transition={{ duration: 0.2 }}
								>
									<span>Khám phá ngay</span>
									<ArrowRight className='h-4 w-4' />
								</motion.div>
							</div>
						</motion.div>
					</motion.div>

					{/* Stats section with animated counters */}
					<motion.div
						ref={statsRef}
						className='glass border-border rounded-2xl border p-8'
						variants={itemVariants}
					>
						<div className='grid grid-cols-2 gap-8 text-center lg:grid-cols-4'>
							<motion.div
								className='group'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className='from-success to-success/80 mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent lg:text-3xl'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.5, duration: 0.5 }}
								>
									<AnimatedCounter
										target={58}
										suffix='+'
										duration={2.5}
										isVisible={statsInView}
									/>
								</motion.div>
								<div className='text-muted-foreground text-sm font-medium'>
									Món đồ được chia sẻ
								</div>
							</motion.div>
							<motion.div
								className='group'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className='from-primary to-primary/80 mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent lg:text-3xl'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.7, duration: 0.5 }}
								>
									<AnimatedCounter
										target={148}
										suffix='+'
										duration={2.2}
										isVisible={statsInView}
									/>
								</motion.div>
								<div className='text-muted-foreground text-sm font-medium'>
									Thành viên tích cực
								</div>
							</motion.div>
							<motion.div
								className='group'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className='from-warning to-warning/80 mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent lg:text-3xl'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.9, duration: 0.5 }}
								>
									<AnimatedCounter
										target={32}
										suffix='+'
										duration={2.0}
										isVisible={statsInView}
									/>
								</motion.div>
								<div className='text-muted-foreground text-sm font-medium'>
									Đồ thất lạc được tìm thấy
								</div>
							</motion.div>
							<motion.div
								className='group'
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.2 }}
							>
								<motion.div
									className='from-secondary to-secondary/80 mb-2 bg-gradient-to-r bg-clip-text text-2xl font-bold text-transparent lg:text-3xl'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 1.1, duration: 0.5 }}
								>
									<AnimatedCounter
										target={98}
										suffix='%'
										duration={1.8}
										isVisible={statsInView}
									/>
								</motion.div>
								<div className='text-muted-foreground text-sm font-medium'>
									Mức độ hài lòng
								</div>
							</motion.div>
						</div>
					</motion.div>

					{/* Call to action */}
					<motion.div
						className='mt-12 text-center'
						variants={itemVariants}
					>
						<p className='text-muted-foreground mb-4 text-sm'>
							Bắt đầu hành trình chia sẻ và kết nối với cộng đồng
						</p>
						<motion.div
							className='from-primary to-success mx-auto h-0.5 w-16 rounded-full bg-gradient-to-r'
							initial={{ width: 0 }}
							animate={{ width: 64 }}
							transition={{ delay: 1.5, duration: 0.8 }}
						></motion.div>
					</motion.div>
				</motion.div>
			</div>
		</div>
	)
}
