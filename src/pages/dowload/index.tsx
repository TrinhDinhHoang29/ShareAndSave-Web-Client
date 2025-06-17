import {
	Apple,
	Bell,
	ChartColumnIcon,
	FileText,
	Gift,
	Heart,
	Search,
	Share,
	User,
	Warehouse
} from 'lucide-react'

const Download = () => {
	return (
		<div className='bg-background text-foreground'>
			<div className='mb-12 text-center'>
				<h1 className='text-foreground font-manrope mb-4 text-3xl font-bold'>
					Tải ứng dụng ShareAndSave
				</h1>
				<p className='text-muted-foreground'>
					Kết nối sinh viên Cao Thắng - Chia sẻ, tìm kiếm và nhận đồ dùng miễn
					phí
				</p>
			</div>

			<div className='grid gap-8 md:grid-cols-2'>
				{/* App Preview */}
				<div className='border-border bg-card flex items-center justify-center rounded-lg border p-6'>
					<div className='relative h-[500px] w-[250px] rounded-3xl bg-gray-900 p-3 shadow-xl'>
						<div className='bg-background relative h-full w-full overflow-hidden rounded-2xl'>
							{/* Status Bar */}
							<div className='bg-muted flex h-8 items-center justify-between px-6 text-xs font-medium'>
								<span>9:41</span>
								<div className='flex items-center space-x-1'>
									<div className='bg-muted-foreground h-2 w-4 rounded-sm'></div>
									<div className='bg-muted-foreground h-2 w-6 rounded-sm'></div>
									<div className='bg-chart-1 h-2 w-6 rounded-sm'></div>
								</div>
							</div>

							{/* App Header */}
							<div className='from-accent to-muted bg-gradient-to-br p-4'>
								<div className='mb-6 text-center'>
									<div className='from-primary to-secondary mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg'>
										<div className='flex items-center space-x-1'>
											<Share className='text-primary-foreground h-5 w-5' />
										</div>
									</div>
									<h3 className='text-foreground font-manrope text-lg font-bold'>
										ShareAndSave
									</h3>
									<p className='text-muted-foreground text-xs'>
										Cao Thắng Community
									</p>
								</div>

								{/* Quick Actions */}
								<div className='mb-4 grid grid-cols-2 gap-3'>
									<div className='bg-card/80 border-border/50 rounded-xl border p-3 text-center backdrop-blur-sm'>
										<FileText className='text-primary mx-auto mb-2 h-6 w-6' />
										<span className='text-foreground text-xs font-medium'>
											Đăng bài
										</span>
									</div>
									<div className='bg-card/80 border-border/50 rounded-xl border p-3 text-center backdrop-blur-sm'>
										<Warehouse className='text-secondary mx-auto mb-2 h-6 w-6' />
										<span className='text-foreground text-xs font-medium'>
											Kho đồ cũ
										</span>
									</div>
								</div>

								{/* Recent Posts */}
								<div className='space-y-2'>
									<h4 className='text-foreground text-sm font-semibold'>
										Bài đăng gần đây
									</h4>
									<div className='bg-card/80 border-border/50 flex items-center space-x-3 rounded-lg border p-2 backdrop-blur-sm'>
										<div className='bg-primary/20 flex h-8 w-8 items-center justify-center rounded-lg'>
											<Gift className='text-primary h-3 w-3' />
										</div>
										<div className='flex-1'>
											<div className='text-foreground text-xs font-medium'>
												Cho tặng sách cũ
											</div>
											<div className='text-muted-foreground text-xs'>
												Tòa A - 2 giờ trước
											</div>
										</div>
									</div>

									<div className='bg-card/80 border-border/50 flex items-center space-x-3 rounded-lg border p-2 backdrop-blur-sm'>
										<div className='bg-chart-1/20 flex h-8 w-8 items-center justify-center rounded-lg'>
											<Search className='text-chart-1 h-3 w-3' />
										</div>
										<div className='flex-1'>
											<div className='text-foreground text-xs font-medium'>
												Tìm ví màu đen
											</div>
											<div className='text-muted-foreground text-xs'>
												Thư viện - 1 ngày trước
											</div>
										</div>
									</div>

									<div className='bg-card/80 border-border/50 flex items-center space-x-3 rounded-lg border p-2 backdrop-blur-sm'>
										<div className='bg-chart-2/20 flex h-8 w-8 items-center justify-center rounded-lg'>
											<Bell className='text-chart-2 h-3 w-3' />
										</div>
										<div className='flex-1'>
											<div className='text-foreground text-xs font-medium'>
												Nhặt được chìa khóa
											</div>
											<div className='text-muted-foreground text-xs'>
												Cổng chính - 3 giờ trước
											</div>
										</div>
									</div>
								</div>

								{/* Stats */}
								<div className='bg-card/80 border-border/50 mt-4 rounded-lg border p-3 backdrop-blur-sm'>
									<div className='mb-2 flex items-center justify-between'>
										<span className='text-foreground text-xs font-medium'>
											Cộng đồng Cao Thắng
										</span>
										<span className='text-muted-foreground text-xs'>
											1,2k thành viên
										</span>
									</div>
									<div className='bg-muted h-2 w-full rounded-full'>
										<div
											className='from-primary to-secondary h-2 rounded-full bg-gradient-to-r'
											style={{ width: '68%' }}
										></div>
									</div>
								</div>
							</div>

							{/* Bottom Navigation */}
							<div className='bg-card border-border absolute right-0 bottom-0 left-0 border-t py-2'>
								<div className='flex justify-around'>
									<div className='flex flex-col items-center'>
										<FileText className='text-primary h-3 w-3' />
										<span className='text-3xs text-primary mt-1'>Bài đăng</span>
									</div>
									<div className='flex flex-col items-center'>
										<Warehouse className='text-foreground/50 h-3 w-3' />
										<span className='text-3xs text-foreground/50 mt-1'>
											Kho đồ
										</span>
									</div>
									<div className='flex flex-col items-center'>
										<Heart className='text-foreground/50 h-3 w-3' />
										<span className='text-3xs text-foreground/50 mt-1'>
											Quan tâm
										</span>
									</div>
									<div className='flex flex-col items-center'>
										<ChartColumnIcon className='text-foreground/50 h-3 w-3' />
										<span className='text-3xs text-foreground/50 mt-1'>
											Xếp hạng
										</span>
									</div>
									<div className='flex flex-col items-center'>
										<User className='text-foreground/50 h-3 w-3' />
										<span className='text-3xs text-foreground/50 mt-1'>
											Hồ sơ
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Home Indicator */}
						<div className='absolute bottom-2 left-1/2 h-1 w-32 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
					</div>
				</div>

				{/* Download Options */}
				<div className='space-y-8'>
					<div className='border-border bg-card rounded-lg border p-6'>
						<h2 className='text-foreground font-manrope mb-4 text-xl font-semibold'>
							Chọn phiên bản
						</h2>
						<div className='space-y-4'>
							<button className='border-border hover:bg-accent flex w-full items-center justify-center gap-3 rounded-lg border-2 p-4 transition-colors'>
								<Apple className='text-foreground h-6 w-6' />
								<div className='text-left'>
									<div className='text-muted-foreground text-xs'>
										Download on the
									</div>
									<div className='text-foreground text-lg font-semibold'>
										App Store
									</div>
								</div>
							</button>
							<button className='border-border hover:bg-accent flex w-full items-center justify-center gap-3 rounded-lg border-2 p-4 transition-colors'>
								<div className='relative h-6 w-6'>
									<div className='border-foreground absolute inset-0 rotate-45 border-2'></div>
									<div className='absolute inset-0 flex items-center justify-center'>
										<div className='border-foreground h-3 w-3 rotate-45 border-t-2 border-r-2'></div>
									</div>
								</div>
								<div className='text-left'>
									<div className='text-muted-foreground text-xs'>GET IT ON</div>
									<div className='text-foreground text-lg font-semibold'>
										Google Play
									</div>
								</div>
							</button>
						</div>
					</div>

					<div className='border-border bg-card rounded-lg border p-6'>
						<h3 className='text-foreground font-manrope mb-3 font-semibold'>
							Tính năng chính
						</h3>
						<ul className='text-muted-foreground space-y-2'>
							<li className='flex items-center gap-2'>
								• Đăng bài cho tặng đồ cũ không dùng đến
							</li>
							<li className='flex items-center gap-2'>
								• Báo cáo đồ nhặt được để trả lại chủ nhân
							</li>
							<li className='flex items-center gap-2'>
								• Tìm kiếm đồ thất lạc trong trường
							</li>
							<li className='flex items-center gap-2'>
								• Tự do tìm kiếm đồ dùng cần thiết
							</li>
							<li className='flex items-center gap-2'>
								• Kết nối cộng đồng sinh viên Cao Thắng
							</li>
							<li className='flex items-center gap-2'>
								• Thông báo thời gian thực khi có kết quả
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Download
