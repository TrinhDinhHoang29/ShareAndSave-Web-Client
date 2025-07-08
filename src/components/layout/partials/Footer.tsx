import { Clock, Heart, Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ESettingKey } from '@/models/enums'
import { useSettingsStore } from '@/stores/settingStore'

const Footer = () => {
	const currentYear = new Date().getFullYear()
	const { getSettingValue } = useSettingsStore()

	// Get settings values
	const description = getSettingValue(ESettingKey.DESCRIPTION)
	const email = getSettingValue(ESettingKey.EMAIL)
	const phoneNumber = getSettingValue(ESettingKey.PHONE_NUMBER)
	const location = getSettingValue(ESettingKey.LOCATION)
	const workDay = getSettingValue(ESettingKey.WORK_DAY)
	const startMorningTime = getSettingValue(ESettingKey.START_MORNING_TIME)
	const endMorningTime = getSettingValue(ESettingKey.END_MORNING_TIME)
	const startAfternoonTime = getSettingValue(ESettingKey.START_AFTERNOON_TIME)
	const endAfternoonTime = getSettingValue(ESettingKey.END_AFTERNOON_TIME)

	// Format working hours
	const workingHours =
		workDay &&
		startMorningTime &&
		endMorningTime &&
		startAfternoonTime &&
		endAfternoonTime ? (
			<>
				<p className='text-muted-foreground text-sm'>{workDay}</p>
				<p className='text-muted-foreground text-sm'>
					Sáng: {startMorningTime} - {endMorningTime}
				</p>
				<p className='text-muted-foreground text-sm'>
					Chiều: {startAfternoonTime} - {endAfternoonTime}
				</p>
			</>
		) : (
			<p className='text-muted-foreground text-sm'>T2-T6: 7:00 - 17:00</p>
		)

	return (
		<footer className='bg-card border-border border-t'>
			<div className='container mx-auto px-4 py-12'>
				{/* Main Footer Content */}
				<div className='mb-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4'>
					{/* Brand Section */}
					<div className='lg:col-span-1'>
						<Link
							to='/'
							className='group mb-4 flex items-center gap-3 text-xl font-bold'
						>
							<img
								src='https://shareandsave.io.vn/logo.png'
								alt='logo_caothang'
								className='h-12 w-12 object-contain'
							/>
							<span className='from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent'>
								Share&Save
							</span>
						</Link>
						<p className='text-muted-foreground mb-4 text-sm leading-relaxed'>
							{description ||
								'Nền tảng kết nối sinh viên Cao đẳng Kỹ thuật Cao Thắng.'}
						</p>
						<div className='text-muted-foreground flex items-center gap-2 text-sm'>
							<Heart className='text-destructive h-4 w-4' />
							<span>Made with love for students</span>
						</div>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className='text-foreground mb-4 flex items-center gap-2 font-semibold'>
							<div className='bg-primary h-4 w-1 rounded-full'></div>
							Truy cập nhanh
						</h3>
						<ul className='space-y-3'>
							{[
								{ to: '/', label: 'Trang chủ' },
								{ to: '/bai-dang', label: 'Bài đăng' },
								{ to: '/kho-do-cu', label: 'Kho đồ cũ' },
								{ to: '/dang-bai', label: 'Đăng bài' },
								{ to: '/quan-tam', label: 'Quan tâm' },
								{ to: '/bang-xep-hang', label: 'Bảng xếp hạng' }
							].map(({ to, label }) => (
								<li key={to}>
									<Link
										to={to}
										className='text-muted-foreground hover:text-primary inline-block transform text-sm transition-colors hover:translate-x-1'
									>
										{label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Contact Info */}
					<div>
						<h3 className='text-foreground mb-4 flex items-center gap-2 font-semibold'>
							<div className='bg-primary h-4 w-1 rounded-full'></div>
							Liên hệ
						</h3>
						<div className='space-y-3'>
							<div className='flex items-start gap-3'>
								<Mail className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
								<div>
									<p className='text-foreground text-sm font-medium'>Email</p>
									<a
										href={`mailto:${email || 'yeahsiraha@gmail.com'}`}
										className='text-muted-foreground hover:text-primary text-sm transition-colors'
									>
										{email || 'yeahsiraha@gmail.com'}
									</a>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<Phone className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
								<div>
									<p className='text-foreground text-sm font-medium'>Hotline</p>
									<a
										href={`tel:${phoneNumber || '0123456789'}`}
										className='text-muted-foreground hover:text-primary text-sm transition-colors'
									>
										{phoneNumber || '0123 456 789'}
									</a>
								</div>
							</div>
							<div className='flex items-start gap-3'>
								<Clock className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
								<div>
									<p className='text-foreground text-sm font-medium'>
										Giờ làm việc
									</p>
									{workingHours}
								</div>
							</div>
						</div>
					</div>

					{/* Address */}
					<div>
						<h3 className='text-foreground mb-4 flex items-center gap-2 font-semibold'>
							<div className='bg-primary h-4 w-1 rounded-full'></div>
							Địa điểm nhận
						</h3>
						<div className='space-y-3'>
							<div className='flex items-start gap-3'>
								<MapPin className='text-primary mt-0.5 h-4 w-4 flex-shrink-0' />
								<div>
									<p className='text-foreground mb-1 text-sm font-medium'>
										Trường CĐ Kỹ thuật Cao Thắng
									</p>
									<p className='text-muted-foreground text-sm leading-relaxed'>
										65 Huỳnh Thúc Kháng, P. Bến Nghé, Q.1, TP.HCM
									</p>
								</div>
							</div>
							<div className='pl-7'>
								<p className='text-foreground text-sm font-medium'>Vị trí:</p>
								<p className='text-muted-foreground text-sm'>
									{location || 'Khu F, Lầu 5, Phòng F5.12'}
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Divider */}
				<div className='border-border my-8 border-t'></div>

				{/* Bottom Section */}
				<div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
					<div className='text-muted-foreground flex flex-col items-center gap-2 text-sm sm:flex-row'>
						<span>© {currentYear} Share&Save.</span>
						<span className='hidden sm:inline'>•</span>
						<span>Dành cho sinh viên Cao đẳng Kỹ thuật Cao Thắng</span>
					</div>

					<div className='text-muted-foreground flex items-center gap-4 text-sm'>
						<button className='hover:text-primary transition-colors'>
							Chính sách
						</button>
						<span>•</span>
						<button className='hover:text-primary transition-colors'>
							Điều khoản
						</button>
						<span>•</span>
						<button className='hover:text-primary transition-colors'>
							Hỗ trợ
						</button>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
