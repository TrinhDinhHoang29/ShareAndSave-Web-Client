import {
	BookOpen,
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
	Recycle,
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

import { EPostSTatus, EPostType, ETransactionStatus } from './enums'
import { ICaoThangLink } from './interfaces'

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
				label: 'Tìm thấy đồ',
				color:
					'bg-post-type-2 text-post-type-foreground-2 dark:bg-post-type-2/20 dark:text-post-type-foreground-2',
				Icon: Gift
			}
		case EPostType.SEEK_LOSE_ITEM:
			return {
				label: 'Tìm đồ bị mất',
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
				label: 'Tìm đồ cũ',
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

export const getStatusPostTypeConfig = (type: EPostType, quantity: number) => {
	// Không xử lý cho type OTHER
	if (type === EPostType.OTHER) {
		return {}
	}

	const isComplete = quantity === 0

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
			return {
				label: isComplete ? 'Đã hoàn thành' : 'Đang diễn ra',
				color: isComplete
					? 'bg-success text-secondary-foreground'
					: 'bg-warning text-white',
				Icon: isComplete ? CheckCircle : Clock,
				animationClass: isComplete ? '' : 'animate-pulse'
			}
		default:
			return {}
	}
}

export const BANNER_CAROUSEL_SOURCE = [
	{
		url: Banner_1,
		name: 'Chiến dịch Yêu thương San sẻ',
		link: '/campaigns/love-sharing',
		icon: Heart,
		badge: 'Chiến dịch từ thiện',
		title: 'Yêu thương San sẻ',
		subtitle:
			'Cùng sinh viên Cao Thắng lan tỏa yêu thương đến cộng đồng qua những hoạt động từ thiện ý nghĩa.',
		ctaText: 'Tham gia ngay',
		stats: [
			{ number: '2,500+', label: 'Sinh viên tham gia' },
			{ number: '50+', label: 'Hoạt động từ thiện' },
			{ number: '10 tỷ+', label: 'Đồng quyên góp' }
		]
	},
	{
		url: Banner_2,
		name: 'Phong trào Tái chế xanh',
		link: '/campaigns/green-recycle',
		icon: Recycle,
		badge: 'Phong trào xanh',
		title: 'Tái chế Xanh - Tương lai Bền vững',
		subtitle:
			'Biến đồ cũ thành tài nguyên quý giá. Cùng nhau bảo vệ môi trường và giúp đỡ những hoàn cảnh khó khăn.',
		ctaText: 'Khám phá ngay',
		stats: [
			{ number: '5 tấn', label: 'Đồ cũ thu gom' },
			{ number: '100+', label: 'Gia đình được hỗ trợ' },
			{ number: '20+', label: 'Điểm thu gom' }
		]
	},
	{
		url: Banner_3,
		name: 'Chương trình Tri thức san sẻ',
		link: '/campaigns/knowledge-sharing',
		icon: BookOpen,
		badge: 'Chương trình giáo dục',
		title: 'Tri thức San sẻ',
		subtitle:
			'Sinh viên Cao Thắng đồng hành cùng trẻ em vùng khó khăn, mang kiến thức kỹ thuật đến những nơi cần nhất.',
		ctaText: 'Đồng hành cùng chúng tôi',
		stats: [
			{ number: '15', label: 'Tỉnh thành' },
			{ number: '1,200+', label: 'Trẻ em được hỗ trợ' },
			{ number: '200+', label: 'Tình nguyện viên' }
		]
	}
	// {
	// 	url: Banner_4, // Thêm banner thứ 4 nếu cần
	// 	name: 'Ngày hội Kết nối yêu thương',
	// 	link: '/events/charity-festival',
	// 	icon: Handshake,
	// 	badge: 'Sự kiện đặc biệt',
	// 	title: 'Ngày hội Kết nối Yêu thương',
	// 	subtitle: 'Sự kiện thường niên quy tụ toàn thể sinh viên, giảng viên và cộng đồng trong tinh thần chia sẻ và yêu thương.',
	// 	ctaText: 'Đăng ký tham gia',
	// 	stats: [
	// 		{ number: '5,000+', label: 'Người tham gia' },
	// 		{ number: '100+', label: 'Hoạt động' },
	// 		{ number: '3 ngày', label: 'Sự kiện' }
	// 	]
	// }
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
