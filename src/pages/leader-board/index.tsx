import {
	Award,
	Gift,
	Heart,
	Medal,
	Search,
	Star,
	TrendingUp,
	Trophy,
	User,
	X
} from 'lucide-react'

interface RankingUser {
	id: number
	name: string
	points: number
	goodDeeds: number
	rank: number
}

const Leaderboard = () => {
	const rankings: RankingUser[] = [
		{
			id: 1,
			name: 'Nguyễn Văn A',
			points: 150,
			goodDeeds: 12,
			rank: 1
		},
		{
			id: 2,
			name: 'Trần Thị B',
			points: 120,
			goodDeeds: 10,
			rank: 2
		},
		{
			id: 3,
			name: 'Lê Văn C',
			points: 100,
			goodDeeds: 8,
			rank: 3
		},
		{
			id: 4,
			name: 'Phạm Thị D',
			points: 80,
			goodDeeds: 6,
			rank: 4
		},
		{
			id: 5,
			name: 'Hoàng Văn E',
			points: 60,
			goodDeeds: 5,
			rank: 5
		}
	]

	const getRankIcon = (rank: number) => {
		switch (rank) {
			case 1:
				return <Trophy className='text-success h-6 w-6' />
			case 2:
				return <Medal className='text-warning h-6 w-6' />
			case 3:
				return <Award className='text-error h-6 w-6' />
			default:
				return <User className='text-secondary h-6 w-6' />
		}
	}

	const getRankStyle = (rank: number) => {
		switch (rank) {
			case 1:
			case 2:
			case 3:
				return 'bg-primary/10 border-primary/50'
			default:
				return 'bg-secondary/10 border-secondary/50'
		}
	}

	const scoringActions = [
		{
			icon: <Gift className='text-foreground h-5 w-5' />,
			action: 'Gửi đồ cũ',
			points: 10,
			description: 'Mỗi lần gửi đồ cũ vào kho',
			color: 'bg-background border'
		},
		{
			icon: <Search className='text-foreground h-5 w-5' />,
			action: 'Tìm thấy đồ thất lạc',
			points: 15,
			description: 'Khi tìm và trả lại đồ thất lạc',
			color: 'bg-background border'
		},
		{
			icon: <X className='text-foreground h-5 w-5' />,
			action: 'Bỏ lỡ cuộc hẹn',
			points: -10,
			description: 'Khi đăng ký nhận đồ nhưng không đến đúng hẹn',
			color: 'bg-background border'
		},
		{
			icon: <Heart className='text-foreground h-5 w-5' />,
			action: 'Hoàn thành giao dịch',
			points: 8,
			description: 'Mỗi giao dịch nhận/gửi đồ thành công',
			color: 'bg-background border'
		}
	]

	return (
		<div className='container mx-auto grid grid-cols-1 gap-6 py-12 lg:grid-cols-3'>
			{/* User Stats and Rankings */}
			<div className='space-y-6 lg:col-span-2'>
				{/* User Stats */}
				<div className='bg-background rounded-lg border shadow-sm backdrop-blur-md'>
					<div className='p-6'>
						<div className='mb-6 flex items-center gap-3'>
							<div className='bg-primary/10 rounded-lg p-2'>
								<TrendingUp className='text-primary h-5 w-5' />
							</div>
							<h2 className='text-foreground text-lg font-semibold'>
								Thông tin của bạn
							</h2>
						</div>
						<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
							<div className='rounded-lg border p-4 text-center'>
								<div className='bg-primary/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
									<Star className='text-primary h-5 w-5' />
								</div>
								<p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
									Xếp hạng hiện tại
								</p>
								<p className='text-foreground text-2xl font-bold'>#4</p>
							</div>
							<div className='rounded-lg border p-4 text-center'>
								<div className='bg-primary/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
									<Trophy className='text-primary h-5 w-5' />
								</div>
								<p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
									Điểm tích lũy
								</p>
								<p className='text-foreground text-2xl font-bold'>80</p>
							</div>
							<div className='rounded-lg border p-4 text-center'>
								<div className='mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 dark:bg-green-950'>
									<Heart className='h-5 w-5 text-green-600' />
								</div>
								<p className='mb-1 text-sm text-gray-500 dark:text-gray-400'>
									Việc tốt
								</p>
								<p className='text-foreground text-2xl font-bold'>6</p>
							</div>
						</div>
					</div>
				</div>

				{/* Rankings */}
				<div className='rounded-lg border bg-white/80 shadow-sm backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-800/80'>
					<div className='p-6'>
						<div className='mb-6 flex items-center gap-3'>
							<div className='rimary/10-2 rounded-lg bg-blue-50'>
								<Trophy className='text-primary h-5 w-5' />
							</div>
							<h2 className='text-foreground text-lg font-semibold'>
								Bảng xếp hạng
							</h2>
						</div>
						<div className='space-y-3'>
							{rankings.map(user => (
								<div
									key={user.id}
									className={`flex items-center rounded-lg border p-4 transition-all duration-200 ${getRankStyle(user.rank)}`}
								>
									<div className='flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
										{getRankIcon(user.rank)}
									</div>
									<div className='ml-4 flex-1'>
										<div className='flex items-center justify-between'>
											<h3 className='text-foreground font-medium'>
												{user.name}
											</h3>
											<div className='flex items-center space-x-4'>
												<div className='text-sm text-gray-500 dark:text-gray-400'>
													<span className='text-foreground font-medium'>
														{user.points}
													</span>{' '}
													điểm
												</div>
												<div className='text-sm text-gray-500 dark:text-gray-400'>
													<span className='text-foreground font-medium'>
														{user.goodDeeds}
													</span>{' '}
													việc tốt
												</div>
												<div className='border-bprimary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full border bg-blue-50 font-medium dark:border-blue-800'>
													{user.rank}
												</div>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Scoring System */}
			<div className='rounded-lg border bg-white/80 shadow-sm backdrop-blur-md dark:border-gray-700/50 dark:bg-gray-800/80'>
				<div className='p-6'>
					<div className='mb-6 flex items-center gap-3'>
						<div className='classprimary/10-2 rounded-lg bg-blue-50'>
							<Star className='text-primary h-5 w-5' />
						</div>
						<h2 className='text-foreground text-lg font-semibold'>
							Hệ thống tính điểm
						</h2>
					</div>

					{/* Scoring Actions */}
					<div className='space-y-6'>
						<div className='grid grid-cols-1 gap-4'>
							{scoringActions.map((action, index) => (
								<div
									key={index}
									className={`space-y-3 rounded-lg border p-4 transition-all duration-200 ${action.color}`}
								>
									<div className='flex items-center gap-3'>
										<div className='flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'>
											{action.icon}
										</div>
										<div className='flex-1'>
											<h3 className='text-sm font-medium text-gray-900 dark:text-gray-100'>
												{action.action}
											</h3>
											<p className='mt-1 text-xs text-gray-500 dark:text-gray-400'>
												{action.description}
											</p>
										</div>
									</div>
									<div className='flex items-center justify-between'>
										<span
											className={`text-lg font-bold ${action.points > 0 ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}
										>
											{action.points > 0 ? '+' : ''}
											{action.points} điểm
										</span>
									</div>
								</div>
							))}
						</div>

						{/* Additional Info */}
						<div className='rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900'>
							<h3 className='mb-3 font-medium text-gray-900 dark:text-gray-100'>
								Lưu ý quan trọng
							</h3>
							<div className='space-y-2 text-sm text-gray-500 dark:text-gray-400'>
								<p>• Điểm được cộng dồn theo mỗi hoạt động</p>
								<p>• Việc tốt được tính khi hoàn thành giao dịch</p>
								<p>• Xếp hạng cập nhật theo thời gian thực</p>
								<p>• Điểm âm sẽ hạn chế quyền nhận đồ</p>
							</div>
						</div>

						{/* Example */}
						<div className='borderprimary/10-blue-200 rounded-lg bg-blue-50 p-4 dark:border-blue-800'>
							<h3 className='mb-3 font-medium text-gray-900 dark:text-gray-100'>
								Ví dụ tính điểm
							</h3>
							<div className='space-y-2 text-sm text-gray-500 dark:text-gray-400'>
								<p className='font-medium text-gray-900 dark:text-gray-100'>
									Hoạt động trong ngày:
								</p>
								<p>
									• Gửi 2 món đồ cũ:{' '}
									<span className='font-medium text-green-600'>+20 điểm</span>
								</p>
								<p>
									• Tìm 1 đồ thất lạc:{' '}
									<span className='font-medium text-green-600'>+15 điểm</span>
								</p>
								<p>
									• Hoàn thành 2 giao dịch:{' '}
									<span className='font-medium text-green-600'>+16 điểm</span>
								</p>
								<div className='mt-2 border border-t pt-2 dark:border-gray-700/50'>
									<p className='font-medium text-gray-900 dark:text-gray-100'>
										→ Tổng: <span className='text-green-600'>51 điểm</span>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Leaderboard
