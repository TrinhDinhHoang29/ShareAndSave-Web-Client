import clsx from 'clsx'
import { Calendar, Lock, Package, RefreshCw, Unlock, X } from 'lucide-react'
import { FC } from 'react'

import { useAlertModalContext } from '@/context/alert-modal-context'
import { formatDate } from '@/lib/utils'
import { getStatusConfig, getTypeInfo } from '@/models/constants'
import { EPostSTatus, EPostType } from '@/models/enums'
import { IPost } from '@/models/interfaces'

interface MyPostItemProps {
	post: IPost
	onPostClick: () => void
	onUpdateStatus: (postID: number, type: EPostSTatus) => void
	onRepost: (postID: number, status: EPostSTatus) => void
	onGoToPost: (slug: string) => void
	onDelete: (postID: number) => void
}

const MyPostItem: FC<MyPostItemProps> = ({
	post,
	onPostClick,
	onUpdateStatus,
	onRepost,
	onGoToPost,
	onDelete
}) => {
	const statusConfig = getStatusConfig(post.status)
	const StatusIcon = statusConfig.icon
	const typeInfo = getTypeInfo(post.type.toString() as EPostType)
	const TypeIcon = typeInfo.Icon
	const isApproved =
		post.status === parseInt(EPostSTatus.APPROVED) ||
		post.status === parseInt(EPostSTatus.SEAL)
	const { showConfirm } = useAlertModalContext()

	const truncateText = (text: string, maxLength: number) => {
		if (text.length <= maxLength) return text
		return text.substring(0, maxLength) + '...'
	}

	const handleUpdateStatus = (status: EPostSTatus) => {
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage:
				status === EPostSTatus.SEAL
					? 'Những người khác sẽ không còn được quan tâm bạn?'
					: 'Cho phép người khác quan tâm bài đăng của bạn',
			confirmTitle:
				status === EPostSTatus.SEAL ? 'Khóa bài đăng' : 'Mở khóa bài đăng',
			cancelButtonText: 'Hủy',
			onConfirm: () => {
				onUpdateStatus(post.id, status)
			}
		})
	}

	const handleRepost = () => {
		onRepost(post.id, post.status.toString() as EPostSTatus)
	}

	const handleDelete = () => {
		onDelete(post.id)
	}

	return (
		<div className='bg-card border-border group relative overflow-hidden rounded-lg border shadow-sm transition-all duration-300 hover:shadow-md'>
			{/* Layout ngang: Ảnh bên trái, nội dung bên phải */}
			<div className='flex h-36'>
				{/* Phần ảnh - chiếm 1/3 chiều rộng */}
				<button
					className='relative h-full w-36 flex-shrink-0 overflow-hidden'
					onClick={e => {
						e.stopPropagation()
						if (isApproved) {
							onGoToPost(post.slug)
						} else {
							onPostClick()
						}
					}}
				>
					{post.images && post.images.length > 0 ? (
						<img
							src={post.images[0]}
							alt={post.title}
							className='h-full w-full object-cover transition-transform duration-300 group-hover:scale-105'
						/>
					) : (
						<div className='bg-muted flex h-full items-center justify-center'>
							<Package className='text-muted-foreground h-8 w-8' />
						</div>
					)}
					{post.images && post.images.length > 1 && (
						<div className='absolute right-1 bottom-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white'>
							+{post.images.length - 1}
						</div>
					)}
				</button>

				{/* Phần nội dung - chiếm 2/3 chiều rộng */}
				<div className='flex flex-1 flex-col justify-between p-3'>
					{/* Header với status và type */}
					<div className='space-y-3'>
						{/* Status */}
						<div
							className={clsx(
								'mb-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
								statusConfig.bgColor,
								statusConfig.textColor
							)}
						>
							<StatusIcon className={clsx('h-3 w-3', statusConfig.iconColor)} />
							{statusConfig.label}
						</div>

						{/* Type */}
						<div
							className={clsx(
								'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
								typeInfo.color
							)}
						>
							<TypeIcon className='h-3 w-3' />
							{typeInfo.label}
						</div>

						{/* Tiêu đề */}
						<h3
							className='text-foreground hover:text-primary mb-1.5 line-clamp-2 cursor-pointer text-sm leading-5 font-semibold transition-colors'
							onClick={onPostClick}
						>
							{truncateText(post.title, 80)}
						</h3>

						{/* Ngày tạo */}
						<div className='text-muted-foreground flex items-center gap-1 text-xs'>
							<Calendar className='h-3 w-3' />
							<span>{formatDate(post.createdAt)}</span>
						</div>
					</div>

					{/* Actions dựa theo status */}
					<div className='flex gap-1.5'>
						{isApproved && (
							<>
								<button
									onClick={() =>
										handleUpdateStatus(
											(post.status.toString() as EPostSTatus) ===
												EPostSTatus.APPROVED
												? EPostSTatus.SEAL
												: EPostSTatus.APPROVED
										)
									}
									className='bg-secondary text-secondary-foreground hover:bg-secondary/80 flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors'
								>
									{(post.status.toString() as EPostSTatus) ===
									EPostSTatus.APPROVED ? (
										<Lock className='h-3 w-3' />
									) : (
										<Unlock className='h-3 w-3' />
									)}
									{(post.status.toString() as EPostSTatus) ===
									EPostSTatus.APPROVED
										? 'Khóa'
										: 'Mở khóa'}
								</button>
								<button
									onClick={handleRepost}
									className='bg-primary text-primary-foreground hover:bg-primary/90 flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors'
								>
									<RefreshCw className='h-3 w-3' />
									Đăng lại
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			<button
				onClick={handleDelete}
				className='hover:bg-background text-error/90 hover:text-error absolute top-3 right-1 flex-shrink-0 rounded p-1 transition-colors'
			>
				<X className='h-4 w-4' />
			</button>
		</div>
	)
}

export default MyPostItem
