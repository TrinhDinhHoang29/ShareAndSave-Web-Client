import clsx from 'clsx'
import {
	Check,
	ChevronDown,
	Clock,
	MessageCircle,
	MessageCircleWarning,
	User,
	X
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAlertModalContext } from '@/context/alert-modal-context'
import { useUpdateTransactionMutation } from '@/hooks/mutations/use-transaction.mutation'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import { ESortOrder, ETransactionStatus } from '@/models/enums'
import {
	ITransactionParams,
	ITransactionRequest,
	IUserInterest
} from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

export const InterestItem = ({
	userInterest,
	postID,
	authorID
}: {
	userInterest: IUserInterest
	postID: number
	authorID: number
}) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const { user } = useAuthStore()
	const { showConfirm } = useAlertModalContext()
	const [isPendingTransaction, setIsPendingTransaction] = useState(false)

	const params: ITransactionParams = useMemo(
		() => ({
			postID,
			searchBy: 'interestID',
			searchValue: userInterest.id.toString(),
			sort: 'createdAt',
			page: 1,
			order: ESortOrder.DESC
		}),
		[postID, userInterest]
	)

	const { data: transactionData } = useListTransactionQuery(params)
	const transactions = useMemo(() => {
		return transactionData?.pages.flatMap(page => page.transactions) || []
	}, [transactionData])

	const latestTransaction = useMemo(() => {
		return transactions.length > 0 ? transactions[0] : null
	}, [transactions])
	useEffect(() => {
		if (transactions && transactions.length > 0) {
			const status = transactions[0].status.toString() as ETransactionStatus
			setIsPendingTransaction(status === ETransactionStatus.PENDING)
		}
	}, [transactions])

	// const isPendingTransaction = useMemo(() => {
	// 	if (transactions && transactions.length > 0) {
	// 		const status = transactions[0].status.toString() as ETransactionStatus
	// 		return status === ETransactionStatus.PENDING
	// 	}
	// 	return false
	// }, [transactions])

	const itemsText = useMemo(() => {
		if (!latestTransaction?.items || latestTransaction.items.length === 0) {
			return ''
		}

		const itemTexts = latestTransaction.items.map(
			item => `${item.itemName}: ${item.quantity}`
		)

		const fullText = itemTexts.join(', ')

		// Truncate nếu quá dài (giới hạn 80 ký tự)
		if (fullText.length > 80) {
			return fullText.substring(0, 80) + '...'
		}

		return fullText
	}, [latestTransaction])

	const { mutate: updateTransactionMutation } = useUpdateTransactionMutation({
		onSuccess: (status: ETransactionStatus) => {
			setIsPendingTransaction(true)
		}
	})

	const handleConfirmTransaction = async (status: ETransactionStatus) => {
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage:
				'Hành động này không thể hoàn tác. Bạn cần cân nhắc trước khi xác nhận',
			confirmTitle:
				status === ETransactionStatus.SUCCESS
					? 'Xác nhận hoàn tất giao dịch?'
					: 'Xác nhận từ chối giao dịch?',
			onConfirm: async () => {
				const transactionRequest: ITransactionRequest = {
					status: Number(status)
				}
				updateTransactionMutation({
					transactionID: latestTransaction?.id || 0,
					data: transactionRequest
				})
			},
			cancelButtonText: 'Hủy'
		})
	}

	return (
		<div className='border-border bg-card relative space-y-2 rounded-xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center space-x-4'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
						{userInterest?.userAvatar ? (
							<img
								src={userInterest?.userAvatar}
								alt={`${userInterest?.userName} avatar`}
								className='h-full w-full rounded-full object-cover'
							/>
						) : (
							<User className='text-secondary h-5 w-5' />
						)}
					</div>
					<div className='flex-1'>
						<div className='flex items-center gap-2'>
							<p className='text-foreground font-semibold'>
								{userInterest.userName}
							</p>
							<div className='text-muted-foreground flex items-center text-sm'>
								<Clock className='mr-1 h-3 w-3' />
								<span>{formatNearlyDateTimeVN(userInterest.createdAt)}</span>
							</div>
						</div>

						{latestTransaction && (
							<div className='mt-2 space-y-1 text-sm'>
								{latestTransaction.method && (
									<div className='text-muted-foreground'>
										<span className='font-medium'>Phương thức:</span>{' '}
										{latestTransaction.method}
									</div>
								)}
								{itemsText && (
									<div className='text-muted-foreground'>
										<span className='font-medium'>Sản phẩm:</span> {itemsText}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				<div className='flex items-center gap-2'>
					{isPendingTransaction && (
						<div className='relative'>
							<button
								onClick={() => setIsDropdownOpen(!isDropdownOpen)}
								className='flex items-center space-x-1 rounded-full bg-orange-100 px-3 py-1.5 text-sm text-orange-700 transition-colors hover:bg-orange-200'
							>
								<span>Chờ xử lý</span>
								<ChevronDown
									className={clsx('h-4 w-4 transition-transform', {
										'rotate-180': isDropdownOpen
									})}
								/>
							</button>

							{isDropdownOpen && (
								<div className='absolute top-full right-0 z-10 mt-1 w-48 rounded-lg border border-gray-200 bg-white shadow-lg'>
									<div className='py-2'>
										<button
											onClick={() =>
												handleConfirmTransaction(ETransactionStatus.SUCCESS)
											}
											className='flex w-full items-center space-x-2 px-4 py-2 text-sm text-green-700 transition-colors hover:bg-green-50'
										>
											<Check className='h-4 w-4' />
											<span>Xác nhận</span>
										</button>
										<button
											onClick={() =>
												handleConfirmTransaction(ETransactionStatus.CANCELLED)
											}
											className='flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-700 transition-colors hover:bg-red-50'
										>
											<X className='h-4 w-4' />
											<span>Từ chối</span>
										</button>
									</div>
								</div>
							)}
						</div>
					)}

					<Link
						to={`/chat/${userInterest.id}`}
						className={clsx(
							'text-primary-foreground rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl',
							isPendingTransaction ? 'bg-chart-2' : 'bg-primary'
						)}
						aria-label='Chat'
					>
						{isPendingTransaction ? (
							<MessageCircleWarning className='h-5 w-5' />
						) : (
							<MessageCircle className='h-5 w-5' />
						)}
					</Link>
				</div>
			</div>
			{userInterest.newMessage && (
				<p className='text-muted-foreground bg-muted/50 line-clamp-2 rounded-lg px-4 py-2 text-sm leading-relaxed'>
					{authorID === user?.id ? 'Bạn' : 'Đối phương'}:{' '}
					{userInterest.newMessage}
				</p>
			)}
		</div>
	)
}
