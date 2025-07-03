import {
	Check,
	CheckCircle,
	Clock,
	Computer,
	FileText,
	Gift,
	Globe,
	HandHelping,
	Heart,
	HelpCircle,
	Lock,
	Megaphone,
	Rabbit,
	School,
	Search,
	ShieldX,
	Users,
	X,
	XCircle
} from 'lucide-react'

import Banner_1 from '@/assets/images/1.jpg'
import Banner_2 from '@/assets/images/2.jpg'
import Banner_3 from '@/assets/images/3.jpg'
import Sub_Banner_1 from '@/assets/images/sub_1.jpg'
import Sub_Banner_2 from '@/assets/images/sub_2.jpg'
import Sub_Banner_3 from '@/assets/images/sub_3.jpg'
import Sub_Banner_4 from '@/assets/images/sub_4.jpg'

import {
	EDateRangeStatus,
	EPostSTatus,
	EPostType,
	ETransactionStatus
} from './enums'
import { ICaoThangLink, IDateRangeResult } from './interfaces'

export const getTypeInfo = (type: EPostType) => {
	switch (type) {
		case EPostType.GIVE_AWAY_OLD_ITEM:
			return {
				label: 'Cho tặng đồ cũ',
				color:
					'bg-post-type-1 text-post-type-foreground-1 dark:bg-post-type-1/20 dark:text-post-type-foreground-1',
				Icon: HandHelping
			}
		case EPostType.FOUND_ITEM:
			return {
				label: 'Nhặt được đồ thất lạc',
				color:
					'bg-post-type-2 text-post-type-foreground-2 dark:bg-post-type-2/20 dark:text-post-type-foreground-2',
				Icon: Gift
			}
		case EPostType.SEEK_LOSE_ITEM:
			return {
				label: 'Tìm đồ thất lạc',
				color:
					'bg-post-type-3 text-post-type-foreground-3 dark:bg-post-type-3/20 dark:text-post-type-foreground-3',
				Icon: Search
			}
		case EPostType.OTHER:
			return {
				label: 'Khác',
				color: 'bg-post-type-6 text-post-type-foreground-6',
				Icon: Users
			}
		case EPostType.WANT_OLD_ITEM:
			return {
				label: 'Xin nhận đồ cũ',
				color: 'bg-post-type-6 text-post-type-foreground-6',
				Icon: Rabbit
			}
		case EPostType.CAMPAIGN:
			return {
				label: 'Chiến dịch',
				color: 'bg-post-type-5 text-post-type-foreground-5',
				Icon: Megaphone
			}
		default:
			return {
				label: 'Khác',
				color: 'bg-post-type-4 text-post-type-foreground-4',
				Icon: Users
			}
	}
}

export const getStatusConfig = (status: number) => {
	switch (status.toString()) {
		case EPostSTatus.PENDING:
			return {
				label: 'Đang chờ duyệt',
				icon: Clock,
				bgColor: 'bg-warning/10',
				textColor: 'text-warning',
				iconColor: 'text-warning/80'
			}
		case EPostSTatus.REJECTED:
			return {
				label: 'Bị từ chối',
				icon: XCircle,
				bgColor: 'bg-error/10',
				textColor: 'text-error',
				iconColor: 'text-error/80'
			}
		case EPostSTatus.APPROVED:
			return {
				label: 'Đã duyệt',
				icon: CheckCircle,
				bgColor: 'bg-success/10 ',
				textColor: 'text-success ',
				iconColor: 'text-success/80'
			}
		case EPostSTatus.SEAL:
			return {
				label: 'Đã khóa',
				icon: Lock,
				bgColor: 'bg-secondary/10',
				textColor: 'text-secondary ',
				iconColor: 'text-secondary/80 '
			}
		default:
			return {
				label: 'Không xác định',
				icon: Clock,
				bgColor: 'bg-secondary/10',
				textColor: 'text-secondary ',
				iconColor: 'text-secondary/80 '
			}
	}
}

export const getTransactionStatusConfig = (
	isAuthor: boolean,
	status: ETransactionStatus
) => {
	const configs: Record<
		ETransactionStatus,
		{
			label: string
			Icon: React.ComponentType<{ className?: string }>
			background: string
			border: string
			textColor: string
		}
	> = {
		[ETransactionStatus.DEFAULT]: {
			label: 'Xác nhận',
			Icon: Check,
			background: 'bg-green-100 hover:bg-green-200',
			textColor: 'text-success',
			border: 'border-success border-solid border-2'
		},
		[ETransactionStatus.PENDING]: {
			label: 'Đang trong giao dịch',
			Icon: Clock,
			background: 'bg-yellow-100 hover:bg-yellow-200',
			textColor: 'text-warning',
			border: 'border-warning border-solid border-2'
		},
		[ETransactionStatus.SUCCESS]: {
			label: 'Hoàn tất',
			Icon: CheckCircle,
			background: 'bg-green-100 hover:bg-green-200',
			textColor: 'text-success',
			border: 'border-success border-solid border-2'
		},
		[ETransactionStatus.CANCELLED]: {
			label: isAuthor ? 'Từ chối' : 'Bị từ chối',
			Icon: XCircle,
			background: 'bg-red-100 hover:bg-red-200',
			textColor: 'text-error',
			border: 'border-error border-solid border-2'
		},
		[ETransactionStatus.REJECTED]: {
			label: isAuthor ? 'Hủy' : 'Đã hủy',
			Icon: ShieldX,
			background: 'bg-red-100 hover:bg-red-200',
			textColor: 'text-error',
			border: 'border-error border-solid border-2'
		}
	}
	return configs[status]
}

export const getStatusAppointment = (status: number) => {
	const statusMap = {
		1: {
			label: 'Đã xác nhận',
			color: 'bg-info/10 text-info border-info/20',
			icon: CheckCircle
		},
		2: {
			label: 'Đã hủy',
			color: 'bg-error/10 text-error border-error/20',
			icon: X
		}
	}
	return statusMap[status as keyof typeof statusMap] || statusMap[1]
}

export const LIMIT_MESSAGE = 30
export const SCROLL_THRESHOLD = 100
export const SCROLL_TIMEOUT = 300
export const TIME_GAP_THRESHOLD = 30 * 60 * 1000 // 30 minutes in milliseconds

export const getConfirmContentTransactionStatus = (
	status: ETransactionStatus
) => {
	switch (status) {
		case ETransactionStatus.SUCCESS:
		default:
			return {
				message:
					'Hành động này không thể hoàn tác. Bạn cần cân nhắc trước khi xác nhận.',
				title: 'Xác nhận hoàn tất giao dịch?'
			}
		case ETransactionStatus.CANCELLED:
			return {
				message:
					'Hành động này không thể hoàn tác. Bạn cần cân nhắc trước khi xác nhận.',
				title: 'Xác nhận từ chối giao dịch?'
			}
		case ETransactionStatus.REJECTED:
			return {
				message:
					'Hành động này không thể hoàn tác. Số lượng yêu cầu sẽ được hoàn tác.',
				title: 'Xác nhận hủy giao dịch?'
			}
	}
}

export const getStatusPostTypeConfig = (
	type: EPostType,
	quantity: number,
	startDate?: string,
	endDate?: string,
	tags?: string[]
) => {
	// Không xử lý cho type OTHER
	if (type === EPostType.OTHER) {
		return {}
	}

	const isComplete = quantity === 0 && tags && tags.length > 0
	const currentDate = new Date()
	const start = new Date(startDate || '')
	const end = new Date(endDate || '')

	switch (type) {
		case EPostType.GIVE_AWAY_OLD_ITEM:
			return {
				label: isComplete ? 'Đã tặng hết' : 'Đang cho tặng',
				color: isComplete
					? 'bg-success text-secondary-foreground'
					: 'bg-warning text-white',
				Icon: isComplete ? CheckCircle : Clock,
				animationClass: isComplete ? '' : 'animate-pulse'
			}

		case EPostType.FOUND_ITEM:
			return {
				label: isComplete ? 'Đã trả lại' : 'Đang tìm chủ',
				color: isComplete
					? 'bg-success text-secondary-foreground'
					: 'bg-info text-white',
				Icon: isComplete ? CheckCircle : Search,
				animationClass: isComplete ? '' : 'animate-move'
			}

		case EPostType.SEEK_LOSE_ITEM:
			return {
				label: isComplete ? 'Đã tìm thấy' : 'Đang tìm kiếm',
				color: isComplete
					? 'bg-success text-secondary-foreground'
					: 'bg-secondary text-secondary-foreground',
				Icon: isComplete ? CheckCircle : HelpCircle,
				animationClass: isComplete ? '' : 'animate-bounce'
			}
		case EPostType.WANT_OLD_ITEM:
			return {
				label: isComplete ? 'Đã nhận đủ' : 'Đang tìm kiếm',
				color: isComplete
					? 'bg-success text-secondary-foreground'
					: 'bg-secondary text-secondary-foreground',
				Icon: isComplete ? CheckCircle : HelpCircle,
				animationClass: isComplete ? '' : 'animate-bounce'
			}
		case EPostType.CAMPAIGN:
			if (isComplete && !startDate && !endDate) {
				return {
					label: 'Đã hoàn thành',
					color: 'bg-success text-secondary-foreground',
					Icon: CheckCircle,
					animationClass: ''
				}
			}
			if (currentDate < start) {
				return {
					label: 'Sắp diễn ra',
					color: 'bg-info text-white',
					Icon: Clock,
					animationClass: 'animate-pulse'
				}
			}
			if (currentDate > end) {
				return {
					label: 'Đã kết thúc',
					color: 'bg-error text-white',
					Icon: CheckCircle,
					animationClass: ''
				}
			}
			return {
				label: 'Đang diễn ra',
				color: 'bg-warning text-white',
				Icon: Clock,
				animationClass: 'animate-pulse'
			}
		default:
			return {}
	}
}

export const BANNER_CAROUSEL_SOURCE = [
	{
		id: 10,
		url: Banner_1,
		name: '🍀MÙA HÈ XANH NĂM 2024 MẶT TRẬN THÀNH PHỐ HỒ CHÍ MINH🍀',
		link: '/bai-dang/mua-he-xanh-nam-2024-mat-tran-thanh-pho-ho-chi-minh-547',
		icon: Heart,
		badge: 'Chiến dịch từ thiện',
		title: 'MÙA HÈ XANH NĂM 2024 MẶT TRẬN THÀNH PHỐ HỒ CHÍ MINH',
		organizer: 'Tuổi trẻ Cao Thắng',
		subtitle:
			'NGÀY HOẠT ĐỘNG CAO ĐIỂM "CHIẾN SĨ TÌNH NGUYỆN CHUNG TAY XÂY DỰNG NÔNG THÔN MỚI"',
		description:
			'💥NGÀY HOẠT ĐỘNG CAO ĐIỂM "CHIẾN SĨ TÌNH NGUYỆN CHUNG TAY XÂY DỰNG NÔNG THÔN MỚI"\n📆Ngày 20/7/2024, Chiến sĩ tình nguyện trường Cao đẳng Kỹ thuật Cao Thắng phối hợp cùng đoàn viên, thanh niên xã Tân Quý Tây tổ chức các hoạt động chung tay bảo vệ môi trường, xây dựng nông thôn mới.\n🍀Các chiến sĩ tình nguyện đã tổ chức dọn dẹp cảnh quan môi trường, xoá các biển quảng cáo trái phép trên cột điện, tổ chức trồng cây cải tạo cảnh quan tại các địa điểm dễ gây ô nhiễm môi trường,…\n🕊️Cùng ngày, Các chiến sĩ tình nguyện cũng đã trao 02 bộ bàn ghế học tập dành cho các em học sinh có hoàn cảnh khó khăn vươn lên trong học tập.',
		ctaText: 'Đồng hành cùng chúng tôi',
		startDate: '2025-07-04T17:00:00.000Z',
		endDate: '2025-08-03T17:00:00.000Z',
		location: 'Trường Cao Đẳng Kỹ Thuật Cao Thắng'
	},
	{
		id: 39,
		url: Banner_2,
		name: '💥CHIẾN SĨ TÌNH NGUYỆN MÙA HÈ XANH TRƯỜNG CAO ĐẲNG KỸ THUẬT CAO THẮNG',
		link: '/bai-dang/chien-si-tinh-nguyen-mua-he-xanh-truong-cao-ang-ky-thuat-cao-thang-314',
		icon: Heart,
		badge: 'Chiến dịch từ thiện',
		title:
			'CHIẾN SĨ TÌNH NGUYỆN MÙA HÈ XANH TRƯỜNG CAO ĐẲNG KỸ THUẬT CAO THẮNG',
		organizer: 'Tuổi trẻ Cao Thắng',
		subtitle:
			'CHIẾN SĨ TÌNH NGUYỆN MÙA HÈ XANH TRƯỜNG CAO ĐẲNG KỸ THUẬT CAO THẮNG ĐÃ CÓ MẶT TẠI ĐẢO PHÚ QUÝ, TỈNH BÌNH THUẬN',
		description:
			'💥CHIẾN SĨ TÌNH NGUYỆN MÙA HÈ XANH TRƯỜNG CAO ĐẲNG KỸ THUẬT CAO THẮNG ĐÃ CÓ MẶT TẠI ĐẢO PHÚ QUÝ, TỈNH BÌNH THUẬN\n🌟Năm 2024, trường Cao đẳng Kỹ thuật Cao Thắng cùng tham gia đội hình chiến sĩ tình nguyện của Thành phố Hồ Chí Minh tại huyện đảo Phú Quý, tỉnh Bình Thuận.\n🛳️Xuất phát từ Thành Đoàn TP. Hồ Chí Minh, sau gần 6 giờ di chuyển, các chiến sĩ tham gia các hoạt động tình nguyện hè tại huyện Đảo Phú Quý, tỉnh Bình Thuận đã có mặt tại Đảo . \n🕊️Các công tác chuẩn bị đã sẵn sàng cho các hoạt động tình nguyện tại vùng đảo phía Đông Nam tổ quốc.',
		ctaText: 'Đồng hành cùng chúng tôi',
		startDate: '2025-06-30T17:00:00.000Z',
		endDate: '2025-08-22T17:00:00.000Z',
		location: 'Huyện đảo Phú Quý, Tỉnh Bình Thuận.'
	},
	{
		id: 40,
		url: Banner_3,
		name: '🍀MÙA HÈ XANH NĂM 2024 MẶT TRẬN THÀNH PHỐ HỒ CHÍ MINH🍀',
		link: '/bai-dang/mua-he-xanh-nam-2024-mat-tran-thanh-pho-ho-chi-minh-403',
		icon: Heart,
		badge: 'Chiến dịch từ thiện',
		title: 'MÙA HÈ XANH NĂM 2024 MẶT TRẬN THÀNH PHỐ HỒ CHÍ MINH',
		organizer: 'Trường Cao đẳng Kỹ thuật Cao Thắng',
		subtitle:
			'NGÀY HOẠT ĐỘNG CAO ĐIỂM "CHIẾN SĨ TÌNH NGUYỆN CHUNG TAY XÂY DỰNG NÔNG THÔN MỚI"',
		description:
			'💥NGÀY HOẠT ĐỘNG CAO ĐIỂM "CHIẾN SĨ TÌNH NGUYỆN CHUNG TAY XÂY DỰNG NÔNG THÔN MỚI"\n📆Ngày 20/7/2024, Chiến sĩ tình nguyện trường Cao đẳng Kỹ thuật Cao Thắng phối hợp cùng đoàn viên, thanh niên xã Tân Quý Tây tổ chức các hoạt động chung tay bảo vệ môi trường, xây dựng nông thôn mới.\n🍀Các chiến sĩ tình nguyện đã tổ chức dọn dẹp cảnh quan môi trường, xoá các biển quảng cáo trái phép trên cột điện, tổ chức trồng cây cải tạo cảnh quan tại các địa điểm dễ gây ô nhiễm môi trường,…\n🕊️Cùng ngày, Các chiến sĩ tình nguyện cũng đã trao 02 bộ bàn ghế học tập dành cho các em học sinh có hoàn cảnh khó khăn vươn lên trong học tập.',
		ctaText: 'Đồng hành cùng chúng tôi',
		startDate: '2025-07-04T17:00:00.000Z',
		endDate: '2025-08-03T17:00:00.000Z',
		location: 'Trường Cao Đẳng Kỹ Thuật Cao Thắng'
	}
]

export const BANNER_THEME = {
	primaryColor: '#0066CC', // Màu chủ đạo của trường
	secondaryColor: '#FF6B35', // Màu phụ
	gradients: {
		primary: 'from-blue-600 to-blue-800',
		secondary: 'from-orange-500 to-red-600',
		charity: 'from-pink-500 to-purple-600',
		environment: 'from-green-500 to-teal-600'
	}
}

export const SUB_BANNER_SOURCE = [
	{
		url: Sub_Banner_1,
		name: 'Lắp đặt hệ thống điện và mạng internet cho 20 laptop tại phòng máy tính "Tri thức mới"',
		link: '#'
	},
	{
		url: Sub_Banner_2,
		name: 'Giúp đỡ các bạn nhỏ học tập và cho sách vở',
		link: '#'
	},
	{
		url: Sub_Banner_3,
		name: 'Cho tặng bánh kẹo cho các bạn vùng xa',
		link: '#'
	},
	{
		url: Sub_Banner_4,
		name: 'Cho tặng bàn cho các gia đình có hoàn cảnh khó khăn',
		link: '#'
	}
]

export const caothangLinks: ICaoThangLink[] = [
	{
		title: 'Trường Cao đẳng Cao Thắng',
		description:
			'Trang chủ chính thức - Thông tin tuyển sinh, đào tạo và hoạt động của trường',
		url: 'https://caothang.edu.vn/',
		Icon: School,
		imageUrl:
			'https://caothang.edu.vn/uploads/images/Tuyen_Sinh/ts_2025/PhanMemRieng_2025_16x9-min.jpg'
	},
	{
		title: 'Khoa Công nghệ Thông tin',
		description:
			'Chuyên ngành CNTT - Lập trình, Mạng máy tính, An toàn thông tin',
		url: 'https://cntt.caothang.edu.vn/',
		Icon: Computer,
		imageUrl: 'https://cntt.caothang.edu.vn/uploads/media/default-slide.jpg'
	},
	{
		title: 'Tuyển sinh 2024',
		description:
			'Thông tin tuyển sinh, hồ sơ xét tuyển và học bổng dành cho sinh viên',
		url: 'https://caothang.edu.vn/tuyensinh/',
		Icon: FileText,
		imageUrl:
			'https://caothang.edu.vn/tuyensinh/images/banner/Ketqua_HB_2025.png'
	},
	{
		title: 'Trung tâm Anh ngữ Cao Thắng',
		description:
			'Khóa học tiếng Anh chất lượng cao - IELTS, TOEIC, Giao tiếp dành cho sinh viên',
		url: 'https://englishcenter.caothang.edu.vn/',
		Icon: Globe,
		imageUrl:
			'https://englishcenter.caothang.edu.vn/images/banner/1710867119_420918217_927143358976996_3473896296539658367_n.jpg'
	}
]

export const getRankStyle = (rank: number) => {
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

export const getAvatarStyle = (rank: number) => {
	switch (rank) {
		case 1:
			return 'ring-4 ring-warning shadow-lg'
		case 2:
			return 'ring-4 ring-muted shadow-lg'
		case 3:
			return 'ring-4 ring-accent shadow-lg'
		default:
			return 'ring-2 ring-border'
	}
}

export const getRankBadgeStyle = (rank: number) => {
	switch (rank) {
		case 1:
			return 'bg-warning text-white shadow-lg'
		case 2:
			return 'bg-muted text-foreground shadow-lg'
		case 3:
			return 'bg-accent text-white shadow-lg'
		default:
			return 'border-primary/20 bg-primary/10 text-primary border'
	}
}

function formatTimeRemaining(milliseconds: number): string {
	const seconds = Math.floor(milliseconds / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) {
		const remainingHours = hours % 24
		return `${days} ngày ${remainingHours > 0 ? remainingHours + ' giờ' : ''}`
	}

	if (hours > 0) {
		const remainingMinutes = minutes % 60
		return `${hours} giờ ${remainingMinutes > 0 ? remainingMinutes + ' phút' : ''}`
	}

	if (minutes > 0) {
		const remainingSeconds = seconds % 60
		return `${minutes} phút ${remainingSeconds > 0 ? remainingSeconds + ' giây' : ''}`
	}

	return `${seconds} giây`
}
export function checkDateRange(
	startDate: string,
	endDate: string
): IDateRangeResult {
	const currentTime = new Date()

	try {
		const startTime = new Date(startDate)
		const endTime = new Date(endDate)

		// Kiểm tra tính hợp lệ của ngày
		if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
			return {
				isInRange: false,
				status: EDateRangeStatus.INVALID_RANGE,
				message: 'Ngày tháng không hợp lệ',
				currentTime,
				startTime: new Date(),
				endTime: new Date()
			}
		}

		// Kiểm tra nếu startDate > endDate
		if (startTime.getTime() > endTime.getTime()) {
			return {
				isInRange: false,
				status: EDateRangeStatus.INVALID_RANGE,
				message: 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc',
				currentTime,
				startTime,
				endTime
			}
		}

		const currentTimestamp = currentTime.getTime()
		const startTimestamp = startTime.getTime()
		const endTimestamp = endTime.getTime()

		// Trước thời gian bắt đầu
		if (currentTimestamp < startTimestamp) {
			const timeUntilStart = startTimestamp - currentTimestamp
			return {
				isInRange: false,
				status: EDateRangeStatus.BEFORE_START,
				message: `Chưa đến thời gian bắt đầu. Còn ${formatTimeRemaining(timeUntilStart)}`,
				currentTime,
				startTime,
				endTime,
				timeUntilStart
			}
		}

		// Sau thời gian kết thúc
		if (currentTimestamp > endTimestamp) {
			return {
				isInRange: false,
				status: EDateRangeStatus.AFTER_END,
				message: 'Chiến dịch đã kết thúc',
				currentTime,
				startTime,
				endTime
			}
		}

		// Trong khoảng thời gian
		const timeUntilEnd = endTimestamp - currentTimestamp
		return {
			isInRange: true,
			status: EDateRangeStatus.IN_RANGE,
			message: `Đang trong thời gian hoạt động. Còn ${formatTimeRemaining(timeUntilEnd)}`,
			currentTime,
			startTime,
			endTime,
			timeUntilEnd
		}
	} catch (error) {
		return {
			isInRange: false,
			status: EDateRangeStatus.INVALID_RANGE,
			message: 'Lỗi khi xử lý thời gian',
			currentTime,
			startTime: new Date(),
			endTime: new Date()
		}
	}
}
