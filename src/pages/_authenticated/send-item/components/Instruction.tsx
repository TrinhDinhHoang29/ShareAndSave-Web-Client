import {
	ArrowRightIcon,
	BoxIcon,
	CalendarIcon,
	InfoIcon,
	UserIcon
} from 'lucide-react'
import React from 'react'

const Instruction: React.FC = () => {
	return (
		<div className='bg-card border-border rounded-xl border p-8 shadow-lg'>
			<div className='p-4'>
				<div className='mb-4 flex items-center gap-2'>
					<InfoIcon className='text-primary h-5 w-5' />
					<h2 className='text-lg font-medium'>Hướng dẫn gửi đồ</h2>
				</div>
				<div className='space-y-6'>
					<div className='flex gap-3'>
						<div className='border-muted-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border'>
							<UserIcon className='text-primary h-4 w-4' />
						</div>
						<div>
							<h3 className='text-foreground mb-1 font-medium'>
								Bước 1: Thông tin cá nhân
							</h3>
							<p className='text-foreground/90 text-sm'>
								Điền đầy đủ thông tin cá nhân để chúng tôi có thể liên hệ khi
								cần thiết.
							</p>
						</div>
					</div>
					<div className='flex gap-3'>
						<div className='border-muted-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border'>
							<BoxIcon className='text-primary h-4 w-4' />
						</div>
						<div>
							<h3 className='text-foreground mb-1 font-medium'>
								Bước 2: Thông tin đồ vật
							</h3>
							<p className='text-foreground/90 text-sm'>
								Cung cấp hình ảnh và mô tả chi tiết về đồ vật để dễ dàng xác
								nhận.
							</p>
						</div>
					</div>
					<div className='flex gap-3'>
						<div className='border-muted-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border'>
							<CalendarIcon className='text-primary h-4 w-4' />
						</div>
						<div>
							<h3 className='text-foreground mb-1 font-medium'>
								Bước 3: Đặt lịch hẹn
							</h3>
							<p className='text-foreground/90 text-sm'>
								Chọn thời gian và địa điểm thuận tiện để gửi đồ.
							</p>
						</div>
					</div>
					<div className='mt-6 border-t border-gray-200 pt-4'>
						<h3 className='text-foreground mb-2 font-medium'>
							Lưu ý quan trọng:
						</h3>
						<ul className='text-foreground/90 space-y-2 text-sm'>
							<li className='flex items-start gap-2'>
								<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
								Mang theo CMND/CCCD khi đến gửi đồ
							</li>
							<li className='flex items-start gap-2'>
								<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
								Đảm bảo đồ vật sạch sẽ và đóng gói cẩn thận
							</li>
							<li className='flex items-start gap-2'>
								<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
								Kiểm tra kỹ đồ vật trước khi gửi
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Instruction
