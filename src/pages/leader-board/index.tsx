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
import React from 'react'

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
				return <Trophy className='text-warning h-6 w-6' />
			case 2:
				return <Medal className='text-muted-foreground h-6 w-6' />
			case 3:
				return <Award className='h-6 w-6 text-orange-500' />
			default:
				return <User className='text-secondary h-6 w-6' />
		}
	}

	const getRankStyle = (rank: number) => {
		switch (rank) {
			case 1:
				return 'glass border-warning/30 hover:border-warning/50 hover:shadow-lg hover:shadow-warning/10'
			case 2:
				return 'glass border-muted/30 hover:border-muted/50 hover:shadow-lg hover:shadow-muted/10'
			case 3:
				return 'glass border-orange-300/30 hover:border-orange-300/50 hover:shadow-lg hover:shadow-orange-300/10'
			default:
				return 'glass border-border/30 hover:border-border/50 hover:shadow-md'
		}
	}

	const scoringActions = [
		{
			icon: <Gift className='text-success h-5 w-5' />,
			action: 'Gửi đồ cũ',
			points: 10,
			description: 'Mỗi lần gửi đồ cũ vào kho',
			color: 'glass border-success/20 hover:border-success/40'
		},
		{
			icon: <Search className='text-info h-5 w-5' />,
			action: 'Tìm thấy đồ thất lạc',
			points: 15,
			description: 'Khi tìm và trả lại đồ thất lạc',
			color: 'glass border-info/20 hover:border-info/40'
		},
		{
			icon: <X className='text-error h-5 w-5' />,
			action: 'Bỏ lỡ cuộc hẹn',
			points: -10,
			description: 'Khi đăng ký nhận đồ nhưng không đến đúng hẹn',
			color: 'glass border-error/20 hover:border-error/40'
		},
		{
			icon: <Heart className='text-accent h-5 w-5' />,
			action: 'Hoàn thành giao dịch',
			points: 8,
			description: 'Mỗi giao dịch nhận/gửi đồ thành công',
			color: 'glass border-accent/20 hover:border-accent/40'
		}
	]

	return (
		<div className='container mx-auto grid grid-cols-1 gap-6 py-12 lg:grid-cols-3'>
			{/* User Stats and Rankings */}
			<div className='space-y-6 lg:col-span-2'>
				{/* User Stats */}
				<div className='glass rounded-lg shadow-sm'>
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
							<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
								<div className='bg-primary/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
									<Star className='text-primary h-5 w-5' />
								</div>
								<p className='text-muted-foreground mb-1 text-sm'>
									Xếp hạng hiện tại
								</p>
								<p className='text-foreground text-2xl font-bold'>#4</p>
							</div>
							<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
								<div className='bg-warning/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
									<Trophy className='text-warning h-5 w-5' />
								</div>
								<p className='text-muted-foreground mb-1 text-sm'>
									Điểm tích lũy
								</p>
								<p className='text-foreground text-2xl font-bold'>80</p>
							</div>
							<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
								<div className='bg-success/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
									<Heart className='text-success h-5 w-5' />
								</div>
								<p className='text-muted-foreground mb-1 text-sm'>Việc tốt</p>
								<p className='text-foreground text-2xl font-bold'>6</p>
							</div>
						</div>
					</div>
				</div>

				{/* Rankings */}
				<div className='glass rounded-lg shadow-sm'>
					<div className='p-6'>
						<div className='mb-6 flex items-center gap-3'>
							<div className='bg-primary/10 rounded-lg p-2'>
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
									className={`flex items-center rounded-lg p-4 transition-all duration-200 ${getRankStyle(user.rank)}`}
								>
									<div className='bg-card flex h-12 w-12 items-center justify-center rounded-full border'>
										{getRankIcon(user.rank)}
									</div>
									<div className='ml-4 flex-1'>
										<div className='flex items-center justify-between'>
											<h3 className='text-foreground font-medium'>
												{user.name}
											</h3>
											<div className='flex items-center space-x-4'>
												<div className='text-muted-foreground text-sm'>
													<span className='text-foreground font-medium'>
														{user.points}
													</span>{' '}
													điểm
												</div>
												<div className='text-muted-foreground text-sm'>
													<span className='text-foreground font-medium'>
														{user.goodDeeds}
													</span>{' '}
													việc tốt
												</div>
												<div className='border-primary/20 bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full border font-medium'>
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
			<div className='glass rounded-lg shadow-sm'>
				<div className='p-6'>
					<div className='mb-6 flex items-center gap-3'>
						<div className='bg-accent/10 rounded-lg p-2'>
							<Star className='text-accent h-5 w-5' />
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
									className={`space-y-3 rounded-lg p-4 transition-all duration-200 ${action.color}`}
								>
									<div className='flex items-center gap-3'>
										<div className='bg-card flex h-8 w-8 items-center justify-center rounded-full border'>
											{action.icon}
										</div>
										<div className='flex-1'>
											<h3 className='text-foreground text-sm font-medium'>
												{action.action}
											</h3>
											<p className='text-muted-foreground mt-1 text-xs'>
												{action.description}
											</p>
										</div>
									</div>
									<div className='flex items-center justify-between'>
										<span
											className={`text-lg font-bold ${action.points > 0 ? 'text-success' : 'text-error'}`}
										>
											{action.points > 0 ? '+' : ''}
											{action.points} điểm
										</span>
									</div>
								</div>
							))}
						</div>

						{/* Additional Info */}
						<div className='border-border bg-muted/30 rounded-lg border p-4'>
							<h3 className='text-foreground mb-3 font-medium'>
								Lưu ý quan trọng
							</h3>
							<div className='text-muted-foreground space-y-2 text-sm'>
								<p>• Điểm được cộng dồn theo mỗi hoạt động</p>
								<p>• Việc tốt được tính khi hoàn thành giao dịch</p>
								<p>• Xếp hạng cập nhật theo thời gian thực</p>
								<p>• Điểm âm sẽ hạn chế quyền nhận đồ</p>
							</div>
						</div>

						{/* Example */}
						<div className='border-primary/20 bg-primary/5 rounded-lg border p-4'>
							<h3 className='text-foreground mb-3 font-medium'>
								Ví dụ tính điểm
							</h3>
							<div className='text-muted-foreground space-y-2 text-sm'>
								<p className='text-foreground font-medium'>
									Hoạt động trong ngày:
								</p>
								<p>
									• Gửi 2 món đồ cũ:{' '}
									<span className='text-success font-medium'>+20 điểm</span>
								</p>
								<p>
									• Tìm 1 đồ thất lạc:{' '}
									<span className='text-success font-medium'>+15 điểm</span>
								</p>
								<p>
									• Hoàn thành 2 giao dịch:{' '}
									<span className='text-success font-medium'>+16 điểm</span>
								</p>
								<div className='border-border/50 mt-2 border-t pt-2'>
									<p className='text-foreground font-medium'>
										→ Tổng: <span className='text-success'>51 điểm</span>
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
