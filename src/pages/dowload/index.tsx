import {
	BarChart3,
	Bell,
	DownloadIcon,
	FileText,
	Gift,
	Heart,
	Search,
	Smartphone,
	User,
	Warehouse
} from 'lucide-react'

const Download = () => {
	return (
		<div className='from-background via-card-background to-muted/30 min-h-screen bg-gradient-to-br'>
			<div className='container mx-auto px-4 py-8 lg:py-12'>
				{/* Header Section */}
				<div className='mb-8 text-center lg:mb-12'>
					<div className='from-primary to-secondary mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg'>
						<img
							src='https://caothang.edu.vn/tuyensinh/templates/images/logo.png'
							alt='logo_caothang'
							className='h-8 w-8 object-contain'
						/>
					</div>
					<h1 className='text-foreground mb-3 text-2xl font-bold md:text-3xl lg:text-4xl'>
						Tải ứng dụng ShareAndSave
					</h1>
					<p className='text-muted-foreground mx-auto max-w-2xl text-sm md:text-base'>
						Kết nối sinh viên Cao Thắng - Chia sẻ, tìm kiếm và nhận đồ dùng miễn
						phí
					</p>
				</div>

				<div className='mx-auto grid max-w-6xl gap-6 lg:grid-cols-2 lg:gap-8'>
					{/* Mobile Preview */}
					<div className='order-2 lg:order-1'>
						<div className='glass flex items-center justify-center rounded-2xl p-4 md:p-6'>
							<div className='relative h-[480px] w-[240px] rounded-[2.5rem] bg-gray-900 p-2 shadow-2xl md:h-[560px] md:w-[280px]'>
								<div className='bg-background relative h-full w-full overflow-hidden rounded-[2rem]'>
									{/* Status Bar */}
									<div className='bg-muted/50 text-muted-foreground flex items-center justify-between px-4 py-2 text-xs font-medium'>
										<span>9:41</span>
										<div className='flex items-center gap-1'>
											<div className='bg-success h-2 w-4 rounded-sm'></div>
											<div className='bg-muted-foreground h-2 w-1 rounded-sm'></div>
										</div>
									</div>

									{/* App Content */}
									<div className='from-accent/20 to-muted/20 bg-gradient-to-br p-4'>
										{/* App Icon & Title */}
										<div className='mb-4 text-center'>
											<div className='from-primary to-secondary mb-2 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-md'>
												<img
													src='https://caothang.edu.vn/tuyensinh/templates/images/logo.png'
													alt='logo_caothang'
													className='h-8 w-8 object-contain'
												/>
											</div>
											<h3 className='text-foreground text-sm font-bold'>
												ShareAndSave
											</h3>
											<p className='text-muted-foreground text-xs'>
												Cao Thắng Community
											</p>
										</div>

										{/* Quick Actions */}
										<div className='mb-4 grid grid-cols-2 gap-2'>
											<div className='bg-card/80 border-border/50 rounded-lg border p-2 text-center backdrop-blur-sm'>
												<FileText className='text-primary mx-auto mb-1 h-4 w-4' />
												<span className='text-foreground text-xs font-medium'>
													Đăng bài
												</span>
											</div>
											<div className='bg-card/80 border-border/50 rounded-lg border p-2 text-center backdrop-blur-sm'>
												<Warehouse className='text-secondary mx-auto mb-1 h-4 w-4' />
												<span className='text-foreground text-xs font-medium'>
													Kho đồ cũ
												</span>
											</div>
										</div>

										{/* Recent Posts */}
										<div className='space-y-2'>
											<h4 className='text-foreground mb-2 text-xs font-semibold'>
												Bài đăng gần đây
											</h4>

											{[
												{
													icon: Gift,
													title: 'Cho tặng sách cũ',
													location: 'Tòa A',
													time: '2h',
													color: 'text-primary'
												},
												{
													icon: Search,
													title: 'Tìm ví màu đen',
													location: 'Thư viện',
													time: '1d',
													color: 'text-success'
												},
												{
													icon: Bell,
													title: 'Nhặt được chìa khóa',
													location: 'Cổng chính',
													time: '3h',
													color: 'text-warning'
												}
											].map((post, index) => (
												<div
													key={index}
													className='bg-card/80 border-border/50 flex items-center gap-2 rounded-lg border p-2 backdrop-blur-sm'
												>
													<div
														className={`flex h-6 w-6 items-center justify-center rounded-lg bg-${post.color.replace('text-', '')}/20`}
													>
														<post.icon className={`h-3 w-3 ${post.color}`} />
													</div>
													<div className='min-w-0 flex-1'>
														<div className='text-foreground truncate text-xs font-medium'>
															{post.title}
														</div>
														<div className='text-muted-foreground text-xs'>
															{post.location} • {post.time}
														</div>
													</div>
												</div>
											))}
										</div>

										{/* Community Stats */}
										<div className='bg-card/80 border-border/50 mt-4 rounded-lg border p-3 backdrop-blur-sm'>
											<div className='mb-2 flex items-center justify-between'>
												<span className='text-foreground text-xs font-medium'>
													Cộng đồng Cao Thắng
												</span>
												<span className='text-muted-foreground text-xs'>
													1,2k thành viên
												</span>
											</div>
											<div className='bg-muted h-1.5 w-full rounded-full'>
												<div
													className='from-primary to-secondary h-1.5 rounded-full bg-gradient-to-r'
													style={{ width: '68%' }}
												></div>
											</div>
										</div>
									</div>

									{/* Bottom Navigation */}
									<div className='bg-card/95 border-border absolute right-0 bottom-0 left-0 border-t backdrop-blur-sm'>
										<div className='flex justify-around py-2'>
											{[
												{ icon: FileText, label: 'Bài đăng', active: true },
												{ icon: Warehouse, label: 'Kho đồ', active: false },
												{ icon: Heart, label: 'Quan tâm', active: false },
												{ icon: BarChart3, label: 'Xếp hạng', active: false },
												{ icon: User, label: 'Hồ sơ', active: false }
											].map((item, index) => (
												<div
													key={index}
													className='flex flex-col items-center'
												>
													<item.icon
														className={`h-3 w-3 ${item.active ? 'text-primary' : 'text-muted-foreground'}`}
													/>
													<span
														className={`mt-0.5 text-[0.5rem] ${item.active ? 'text-primary' : 'text-muted-foreground'}`}
													>
														{item.label}
													</span>
												</div>
											))}
										</div>
									</div>
								</div>

								{/* Home Indicator */}
								<div className='absolute bottom-1 left-1/2 h-1 w-20 -translate-x-1/2 transform rounded-full bg-gray-600'></div>
							</div>
						</div>
					</div>

					{/* Download & Features */}
					<div className='order-1 space-y-6 lg:order-2'>
						{/* Download Buttons */}
						<div className='glass rounded-2xl p-6'>
							<div className='mb-6 flex items-center gap-3'>
								<DownloadIcon className='text-primary h-6 w-6' />
								<h2 className='text-foreground text-xl font-bold'>
									Tải xuống ngay
								</h2>
							</div>

							<div className='space-y-3'>
								<a
									target='_blank'
									href='https://drive.google.com/drive/folders/1GX5qudF8Eggl1bydvZrQBU7WgylfsKgX'
									className='bg-card hover:bg-accent/50 border-border hover:border-primary/50 group flex w-full items-center justify-center gap-4 rounded-xl border-2 p-4 transition-all duration-200'
								>
									<DownloadIcon className='text-foreground group-hover:text-primary h-8 w-8 transition-colors' />
									<div className='text-left'>
										<div className='text-muted-foreground text-xs'>
											GET IT ON
										</div>
										<div className='text-foreground text-lg font-bold'>APK</div>
									</div>
								</a>
							</div>
						</div>

						{/* Features */}
						<div className='glass rounded-2xl p-6'>
							<div className='mb-4 flex items-center gap-3'>
								<Smartphone className='text-secondary h-6 w-6' />
								<h3 className='text-foreground text-lg font-bold'>
									Tính năng nổi bật
								</h3>
							</div>

							<div className='grid gap-3'>
								{[
									{
										icon: Gift,
										text: 'Đăng bài cho tặng đồ cũ không dùng đến',
										color: 'text-primary'
									},
									{
										icon: Bell,
										text: 'Báo cáo đồ nhặt được để trả lại chủ nhân',
										color: 'text-warning'
									},
									{
										icon: Search,
										text: 'Tìm kiếm đồ thất lạc trong trường',
										color: 'text-success'
									},
									{
										icon: Heart,
										text: 'Kết nối cộng đồng sinh viên Cao Thắng',
										color: 'text-secondary'
									}
								].map((feature, index) => (
									<div
										key={index}
										className='bg-card/50 border-border/30 flex items-start gap-3 rounded-lg border p-3'
									>
										<div
											className={`flex h-8 w-8 items-center justify-center rounded-lg bg-${feature.color.replace('text-', '')}/20 flex-shrink-0`}
										>
											<feature.icon className={`h-4 w-4 ${feature.color}`} />
										</div>
										<span className='text-foreground text-sm leading-relaxed'>
											{feature.text}
										</span>
									</div>
								))}
							</div>
						</div>

						{/* Community Info */}
						<div className='glass from-primary/5 to-secondary/5 rounded-2xl bg-gradient-to-br p-6'>
							<div className='text-center'>
								<div className='text-primary mb-1 text-2xl font-bold'>
									1,200+
								</div>
								<div className='text-muted-foreground mb-3 text-sm'>
									Sinh viên đang sử dụng
								</div>
								<div className='text-muted-foreground flex items-center justify-center gap-2 text-xs'>
									<div className='bg-success h-2 w-2 animate-pulse rounded-full'></div>
									<span>Hoạt động 24/7</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Download
