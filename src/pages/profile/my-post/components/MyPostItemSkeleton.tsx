import { FC } from 'react'

interface MyPostItemSkeletonProps {
	quantity: number
}

const MyPostItemSkeleton: FC<MyPostItemSkeletonProps> = ({ quantity }) => {
	return (
		<>
			{Array.from({ length: quantity }, (_, index) => (
				<div
					key={index}
					className='bg-card border-border animate-pulse overflow-hidden rounded-lg border shadow-sm'
				>
					{/* Layout ngang: Ảnh bên trái, nội dung bên phải */}
					<div className='flex h-36'>
						{/* Phần ảnh skeleton - chiếm 1/3 chiều rộng */}
						<div className='h-full w-32 flex-shrink-0'>
							<div className='bg-muted h-full w-full'></div>
						</div>

						{/* Phần nội dung skeleton - chiếm 2/3 chiều rộng */}
						<div className='flex flex-1 flex-col justify-between p-3'>
							{/* Header với status và type skeleton */}
							<div className='mb-2'>
								{/* Status skeleton */}
								<div className='bg-muted mb-1.5 h-5 w-20 rounded-full'></div>

								{/* Type skeleton */}
								<div className='bg-muted h-5 w-16 rounded-full'></div>

								{/* Title skeleton */}
								<div className='mt-2 mb-1.5 space-y-1'>
									<div className='bg-muted h-4 w-full rounded'></div>
									<div className='bg-muted h-4 w-4/5 rounded'></div>
								</div>

								{/* Date skeleton */}
								<div className='bg-muted h-3 w-24 rounded'></div>
							</div>

							{/* Actions skeleton - chỉ hiển thị đôi khi để mô phỏng APPROVED status */}
							{index % 3 === 0 && (
								<div className='mt-2 flex gap-1.5'>
									<div className='bg-muted h-7 flex-1 rounded-md'></div>
									<div className='bg-muted h-7 flex-1 rounded-md'></div>
									<div className='bg-muted h-7 w-7 rounded-md'></div>
								</div>
							)}
						</div>
					</div>
				</div>
			))}
		</>
	)
}

export default MyPostItemSkeleton
