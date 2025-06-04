import {
	ArrowRightIcon,
	ClipboardListIcon,
	FileTextIcon,
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
					<h2 className='text-lg font-medium'>Hướng dẫn đăng bài</h2>
				</div>
				<div className='space-y-6'>
					<div className='flex gap-3'>
						<div className='border-muted-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border'>
							<UserIcon className='text-primary h-4 w-4' />
						</div>
						<div>
							<h3 className='text-foreground mb-1 font-medium'>
								Giai đoạn 1: Thông tin cá nhân
							</h3>
							<p className='text-foreground/90 text-sm'>
								Điền đầy đủ thông tin cá nhân (tên, email, số điện thoại) để
								chúng tôi có thể liên hệ khi cần thiết.
							</p>
						</div>
					</div>
					<div className='flex gap-3'>
						<div className='border-muted-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border'>
							<FileTextIcon className='text-primary h-4 w-4' />
						</div>
						<div>
							<h3 className='text-foreground mb-1 font-medium'>
								Giai đoạn 2: Loại bài đăng
							</h3>
							<p className='text-foreground/90 text-sm'>
								Chọn loại bài đăng phù hợp (Gửi đồ cũ, Nhặt đồ thất lạc, Tìm đồ
								thất lạc, hoặc Khác) để tiếp tục.
							</p>
						</div>
					</div>
					<div className='flex gap-3'>
						<div className='border-muted-foreground flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border'>
							<ClipboardListIcon className='text-primary h-4 w-4' />
						</div>
						<div>
							<h3 className='text-foreground mb-1 font-medium'>
								Giai đoạn 3: Thông tin bài đăng
							</h3>
							<p className='text-foreground/90 text-sm'>
								Cung cấp chi tiết về bài đăng (mô tả, hình ảnh, ngày tháng, địa
								điểm) để hoàn tất quá trình.
							</p>
						</div>
					</div>
					<div className='mt-6 border-t border-gray-200 pt-4'>
						<h3 className='text-foreground mb-2 font-medium'>
							Lưu ý quan trọng khi đăng bài:
						</h3>
						<ul className='text-foreground/90 space-y-2 text-sm'>
							<li className='flex items-start gap-2'>
								<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
								Đảm bảo thông tin cá nhân chính xác để nhận thông báo liên quan
								đến bài đăng
							</li>
							<li className='flex items-start gap-2'>
								<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
								Mô tả chi tiết và cung cấp hình ảnh rõ ràng để tăng khả năng xác
								nhận hoặc tìm kiếm
							</li>
							<li className='flex items-start gap-2'>
								<ArrowRightIcon className='mt-0.5 h-4 w-4 flex-shrink-0' />
								Kiểm tra kỹ thông tin bài đăng trước khi gửi để tránh sai sót
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Instruction
