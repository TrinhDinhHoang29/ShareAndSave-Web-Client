import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, User, UserCheck, X } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TutorialTransactionDialogProps {
	isOpen: boolean
	onClose: () => void
}

interface StageData {
	title: string
	steps: string[]
}

const StageSection = ({
	stage,
	stageIndex
}: {
	stage: StageData
	stageIndex: number
}) => {
	const [isExpanded, setIsExpanded] = useState(false)

	const handleToggle = () => {
		setIsExpanded(!isExpanded)
	}

	return (
		<div className='mb-4'>
			<div className='border-border overflow-hidden rounded-lg border shadow-sm'>
				{/* Stage Collapse Header */}
				<div
					onClick={handleToggle}
					className='hover:bg-muted focus:ring-primary/50 w-full cursor-pointer p-4 text-left transition-colors duration-200 focus:ring-2 focus:outline-none focus:ring-inset'
				>
					<div className='flex items-center justify-between'>
						<div className='min-w-0 flex-1'>
							<div className='text-foreground flex items-center gap-3 text-lg font-semibold'>
								<span className='bg-secondary text-secondary-foreground rounded-lg px-3 py-1 text-sm font-bold'>
									Giai đoạn {stageIndex + 1}
								</span>
								{stage.title}
							</div>
						</div>

						<div className='flex items-center gap-4'>
							<ChevronDown
								className={`text-muted-foreground h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
							/>
						</div>
					</div>
				</div>

				{/* Stage Collapse Content */}
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: 'auto', opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: 'easeInOut' }}
							className='border-border border-t'
						>
							<div className='bg-muted/30 px-6 py-4'>
								<div className='space-y-2'>
									{stage.steps.map((step, stepIndex) => (
										<motion.div
											key={stepIndex}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.3,
												delay: stepIndex * 0.1,
												ease: 'easeOut'
											}}
										>
											<div
												key={stepIndex}
												className='text-foreground text-sm'
											>
												<div className='flex items-start gap-2'>
													<span className='text-primary min-w-[1rem] font-medium'>
														{stepIndex + 1}.
													</span>
													<p className='leading-relaxed'>{step}</p>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	)
}

export const TutorialTransactionDialog = ({
	isOpen,
	onClose
}: TutorialTransactionDialogProps) => {
	const [activeTab, setActiveTab] = useState<'trader' | 'poster'>('trader')

	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) {
				onClose()
			}
		}
		document.addEventListener('keydown', handleEscape)
		return () => document.removeEventListener('keydown', handleEscape)
	}, [isOpen, onClose])

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'unset'
		}
		return () => {
			document.body.style.overflow = 'unset'
		}
	}, [isOpen])

	const traderStages: StageData[] = [
		{
			title: 'Chọn món đồ muốn giao dịch',
			steps: [
				'Bạn cần chọn các món đồ muốn giao dịch xuất hiện bên phải phần tin nhắn.',
				'Các món đồ bạn chọn sẽ xuất hiện ở "Món đồ có sẵn" để có thể tùy chỉnh số lượng hoặc xóa đi nếu cần thiết.',
				'Chọn vào "Gửi yêu cầu giao dịch".'
			]
		},
		{
			title: 'Kiểm tra thông tin món đồ trước khi xác nhận giao dịch',
			steps: [
				'Xuất hiện "Yêu cầu đã gửi" trong phần đầu tin nhắn.',
				'Bạn có thể xem lại món đồ đã gửi đồng thời có thể nhấn vào nút "X" để xóa đi nếu muốn thay đổi lựa chọn.'
			]
		},
		{
			title: 'Xác nhận giao dịch',
			steps: [
				'Bạn cần chọn vào "Xác nhận"',
				'Xuất hiện "Thông báo xác nhận"',
				'Nếu đã chắc chắn thì chọn "Xác nhận" ngược lại chọn "Hủy"'
			]
		},
		{
			title: 'Hoàn tất tạo giao dịch',
			steps: [
				'Sau khi chọn "Xác nhận", Bạn sẽ thấy trạng thái giao dịch được chuyển sang "Đang trong giao dịch"',
				'Người đăng sẽ thấy được yêu cầu giao dịch của bạn và sẽ liên hệ trao đổi thêm về giao dịch.'
			]
		}
	]

	const posterStages: StageData[] = [
		{
			title: 'Chọn giao dịch muốn phản hồi',
			steps: [
				'Bạn sẽ cần chọn vào "Giao dịch của tôi" nằm ở cạnh "Tôi :)".',
				'Tìm đến giao dịch ở trạng thái "Đang trong giao dịch".',
				'Chọn vào giao dịch đã tìm thấy.'
			]
		},
		{
			title: 'Xem và từ chối (nếu cần thiết) thông tin yêu cầu giao dịch',
			steps: [
				'Hiển thị yêu cầu giao dịch gồm các món đồ muốn giao dịch và trạng thái "Đang trong giao dịch".',
				'Trong trường hợp bạn không chấp nhận giao dịch, Bạn có thể chọn "Từ chối" để hủy giao dịch.',
				'Hiển thị thông báo từ chối giao dịch thành công.'
			]
		},
		{
			title: 'Trao đổi và xác nhận giao dịch',
			steps: [
				'Bạn và người giao dịch cần trao đổi với nhau để xác nhận thông tin món đồ và cách thức nhận đồ.',
				'Trong trường hợp số lượng giao dịch bạn không mong muốn, Bạn có thể tùy chỉnh lại số lượng ở nút tăng giảm của mỗi món đồ.',
				'Sau khi tùy chỉnh hoàn tất, Bạn cần chọn vào "Xác nhận" để tiến hành cập nhật thông tin giao dịch.',
				'Hiển thị thông báo cập nhật giao dịch thành công.',
				'Khi đã xác nhận giao dịch thì giữ nguyên trạng thái cho đến khi người giao dịch nhận được đồ.'
			]
		},
		{
			title: 'Hoàn tất giao dịch',
			steps: [
				'Ở giai đoạn này, bạn cần phải đảm bảo người giao dịch đã nhận được đồ hoặc bạn đã đưa đồ cho người giao dịch.',
				'Bạn cần chọn vào "Hoàn tất" để hoàn tất giao dịch.',
				'Hiển thị thông báo hoàn tất giao dịch thành công và chuyển sang trạng thái "Hoàn tất".',
				'Hệ thống sẽ cập nhật lại số lượng món đồ và bạn sẽ được cộng điểm vào hệ thống.'
			]
		}
	]

	const currentStages = activeTab === 'trader' ? traderStages : posterStages

	if (!isOpen) return null

	return (
		<AnimatePresence>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				className='fixed inset-0 z-50 flex items-center justify-center p-4'
				onClick={onClose}
			>
				{/* Backdrop */}
				<motion.div
					className='bg-background/50 fixed inset-0 backdrop-blur-sm'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.2, ease: 'easeInOut' }}
				/>

				{/* Dialog */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 10 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 10 }}
					className='bg-card relative z-10 mx-auto max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl shadow-xl'
					onClick={e => e.stopPropagation()}
				>
					{/* Header */}
					<div className='bg-card border-border border-b px-6 py-4'>
						<div className='flex items-center justify-between'>
							<motion.div
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									duration: 0.2,
									delay: 0.1,
									ease: 'easeOut'
								}}
							>
								<h1 className='text-foreground text-xl font-bold'>
									Hướng dẫn giao dịch
								</h1>
								<p className='text-muted-foreground mt-1 text-sm'>
									Xem cách thức giao dịch giữa người giao dịch và người đăng
								</p>
							</motion.div>

							<button
								onClick={onClose}
								className='text-muted-foreground hover:text-foreground hover:bg-muted focus:ring-primary/50 rounded-full p-2 transition-colors duration-200 focus:ring-2 focus:outline-none'
								aria-label='Đóng'
							>
								<X className='h-5 w-5' />
							</button>
						</div>
					</div>

					{/* Content */}
					<div className='flex max-h-[70vh] overflow-hidden'>
						{/* Left Sidebar - Tabs */}
						<div className='border-border bg-muted/30 w-80 border-r p-6'>
							<div className='space-y-4'>
								<h2 className='text-foreground mb-4 text-lg font-semibold'>
									Chọn vai trò
								</h2>

								<div className='space-y-2'>
									<button
										onClick={() => setActiveTab('trader')}
										className={`w-full rounded-lg p-4 text-left transition-all duration-200 ${
											activeTab === 'trader'
												? 'bg-primary text-primary-foreground shadow-md'
												: 'bg-card hover:bg-muted border-border border'
										}`}
									>
										<div className='flex items-center gap-3'>
											<User className='h-5 w-5' />
											<div>
												<h3 className='font-medium'>Người giao dịch</h3>
												<p
													className={`text-sm ${
														activeTab === 'trader'
															? 'text-primary-foreground/80'
															: 'text-muted-foreground'
													}`}
												>
													Bạn muốn giao dịch với người đăng
												</p>
											</div>
										</div>
									</button>

									<button
										onClick={() => setActiveTab('poster')}
										className={`w-full rounded-lg p-4 text-left transition-all duration-200 ${
											activeTab === 'poster'
												? 'bg-primary text-primary-foreground shadow-md'
												: 'bg-card hover:bg-muted border-border border'
										}`}
									>
										<div className='flex items-center gap-3'>
											<UserCheck className='h-5 w-5' />
											<div>
												<h3 className='font-medium'>Người đăng</h3>
												<p
													className={`text-sm ${
														activeTab === 'poster'
															? 'text-primary-foreground/80'
															: 'text-muted-foreground'
													}`}
												>
													Bạn đã đăng bài và nhận yêu cầu từ người giao dịch
												</p>
											</div>
										</div>
									</button>
								</div>

								<div className='bg-accent/50 mt-6 rounded-lg p-4'>
									<h4 className='text-accent-foreground mb-2 font-medium'>
										💡 Lưu ý
									</h4>
									<p className='text-accent-foreground/80 text-sm'>
										{activeTab === 'trader'
											? 'Hãy chọn các món đồ phù hợp với nhu cầu của bản thân, kiểm tra thông tin trước khi xác nhận, và cân nhắc lại trước khi tạo giao dịch vì hành động này không thể hoàn tác.'
											: 'Chỉ chọn "Hoàn tất" chỉ khi bạn đã đưa được đồ cho người giao dịch để tránh bị sai lệch về số lượng. Nếu điều đó xảy ra, bạn cần kiểm soát hoàn toàn quá trình giao dịch.'}
									</p>
								</div>
							</div>
						</div>

						{/* Right Content - Steps */}
						<div className='flex-1 overflow-y-auto p-6'>
							<motion.div
								key={activeTab}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3 }}
								className='space-y-6'
							>
								<div className='mb-6'>
									<h2 className='text-foreground mb-2 text-xl font-bold'>
										{activeTab === 'trader'
											? 'Hướng dẫn cho người giao dịch'
											: 'Hướng dẫn cho người đăng'}
									</h2>
									<p className='text-muted-foreground'>
										{activeTab === 'trader'
											? 'Các bước để thực hiện giao dịch thành công khi bạn muốn trao đổi đồ với người khác.'
											: 'Các bước để xử lý yêu cầu giao dịch khi có người muốn trao đổi với bài đăng của bạn.'}
									</p>
								</div>

								{currentStages.map((stage, stageIndex) => (
									<motion.div
										key={stageIndex}
										initial={{ opacity: 0, y: 30 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{
											duration: 0.4,
											delay: stageIndex * 0.1,
											ease: 'easeOut'
										}}
									>
										<StageSection
											stage={stage}
											stageIndex={stageIndex}
										/>
									</motion.div>
								))}
							</motion.div>
						</div>
					</div>

					{/* Footer */}
					<div className='bg-card border-border border-t px-6 py-4'>
						<div className='flex justify-end'>
							<button
								type='button'
								className='bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:ring-primary/50 rounded-lg px-6 py-2.5 font-medium transition-colors duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none'
								onClick={onClose}
							>
								Đóng
							</button>
						</div>
					</div>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	)
}
