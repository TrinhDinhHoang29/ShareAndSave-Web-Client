import clsx from 'clsx'
import { ChevronDown, Clock, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { useAlertModalContext } from '@/context/alert-modal-context'
import { useChatNotification } from '@/context/chat-noti-context'
import { useUpdateTransactionMutation } from '@/hooks/mutations/use-transaction.mutation'
import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import {
	getConfirmContentTransactionStatus,
	getTransactionStatusConfig
} from '@/models/constants'
import { ESortOrder, ETransactionStatus } from '@/models/enums'
import {
	ITransaction,
	ITransactionParams,
	ITransactionRequest,
	IUserInterest
} from '@/models/interfaces'
import useAuthStore from '@/stores/authStore'

import ChatButton from './ChatButton'

const ButtonStatus = ({
	handleClick,
	type
}: {
	handleClick: () => void
	type: ETransactionStatus
}) => {
	const { Icon, background, textColor, label } = getTransactionStatusConfig(
		true,
		type
	)
	return (
		<button
			onClick={handleClick}
			className={clsx(
				'flex w-full items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors',
				background,
				textColor
			)}
		>
			<div className='flex h-8 w-8 items-center justify-center rounded-full'>
				<Icon className='h-4 w-4' />
			</div>
			<span>{label}</span>
		</button>
	)
}

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
	const [latestTransaction, setLatestTransaction] =
		useState<ITransaction | null>(null)

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

	useEffect(() => {
		if (transactions && transactions.length > 0) {
			setLatestTransaction(transactions[0])
		}
	}, [transactions])

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

	const transactionStatusConfig = useMemo(() => {
		if (latestTransaction)
			return getTransactionStatusConfig(
				true,
				latestTransaction?.status || ETransactionStatus.DEFAULT
			)
	}, [latestTransaction])

	const { mutate: updateTransactionMutation } = useUpdateTransactionMutation({
		onSuccess: (status: ETransactionStatus) => {
			if (latestTransaction) {
				setLatestTransaction({
					...latestTransaction,
					status
				})
			}
		}
	})

	const handleConfirmTransaction = async (status: ETransactionStatus) => {
		const content = getConfirmContentTransactionStatus(status)
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage: content.message,
			confirmTitle: content.title,
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

	const { followedByNotification } = useChatNotification()
	const [duplicateFollowedByNotification, setDuplicateFollowedByNotification] =
		useState(followedByNotification)
	const [newMessages, setNewMessages] = useState<number>(
		userInterest.unreadMessageCount || 0
	)
	const [isPing, setIsPing] = useState(false)

	useEffect(() => {
		if (
			followedByNotification &&
			followedByNotification.interestID === userInterest.id &&
			duplicateFollowedByNotification !== followedByNotification
		) {
			setNewMessages(prev => prev + 1)
			setIsPing(true)
			setDuplicateFollowedByNotification(followedByNotification)
		}
	}, [followedByNotification])

	return (
		<div className='border-border bg-card relative space-y-4 rounded-xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
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
					<div className='flex-1 space-y-1'>
						{latestTransaction?.method && (
							<span
								className={`bg-primary text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}
							>
								{latestTransaction.method}
							</span>
						)}

						<div className='flex items-center gap-2'>
							<p className='text-foreground font-semibold'>
								{userInterest.userName}
							</p>
							<div className='text-muted-foreground flex items-center text-sm'>
								<Clock className='mr-1 h-3 w-3' />
								<span>{formatNearlyDateTimeVN(userInterest.createdAt)}</span>
							</div>
						</div>

						{itemsText && (
							<div className='text-muted-foreground text-sm'>
								<span className='font-medium'>Yêu cầu:</span> {itemsText}
							</div>
						)}
					</div>
				</div>

				{/* Right section - Actions */}
				<div className='flex items-center gap-2'>
					{transactionStatusConfig && (
						<div className='relative'>
							{(latestTransaction?.status.toString() as ETransactionStatus) ===
								ETransactionStatus.SUCCESS ||
							(latestTransaction?.status.toString() as ETransactionStatus) ===
								ETransactionStatus.PENDING ? (
								<button
									onClick={() => setIsDropdownOpen(!isDropdownOpen)}
									className={clsx(
										'flex items-center space-x-1 rounded-full px-3 py-1.5 text-sm transition-colors',
										transactionStatusConfig?.background,
										transactionStatusConfig?.textColor
									)}
								>
									<span>{transactionStatusConfig?.label}</span>
									<ChevronDown
										className={clsx('h-4 w-4 transition-transform', {
											'rotate-180': isDropdownOpen
										})}
									/>
								</button>
							) : (
								<button
									className={clsx(
										'flex items-center space-x-1 rounded-full px-3 py-1.5 text-sm transition-colors',
										transactionStatusConfig?.background,
										transactionStatusConfig?.textColor
									)}
								>
									<span>{transactionStatusConfig?.label}</span>
								</button>
							)}

							{isDropdownOpen && (
								<>
									{/* Background overlay */}
									<div
										className='fixed inset-0 z-10'
										onClick={() => setIsDropdownOpen(false)}
									/>

									{/* Dropdown menu */}
									<div className='absolute top-full right-0 z-20 mt-2 w-48 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl'>
										<div className='divide-y divide-gray-100'>
											{latestTransaction &&
												(latestTransaction.status.toString() as ETransactionStatus) ===
													ETransactionStatus.PENDING && (
													<>
														<ButtonStatus
															handleClick={() => {
																handleConfirmTransaction(
																	ETransactionStatus.SUCCESS
																)
																setIsDropdownOpen(false)
															}}
															type={ETransactionStatus.SUCCESS}
														/>
														<ButtonStatus
															handleClick={() => {
																handleConfirmTransaction(
																	ETransactionStatus.CANCELLED
																)
																setIsDropdownOpen(false)
															}}
															type={ETransactionStatus.CANCELLED}
														/>
													</>
												)}
											{latestTransaction &&
												(latestTransaction.status.toString() as ETransactionStatus) ===
													ETransactionStatus.SUCCESS && (
													<ButtonStatus
														handleClick={() => {
															handleConfirmTransaction(
																ETransactionStatus.REJECTED
															)
															setIsDropdownOpen(false)
														}}
														type={ETransactionStatus.REJECTED}
													/>
												)}
										</div>
									</div>
								</>
							)}
						</div>
					)}

					<ChatButton
						interestID={userInterest.id}
						newMessages={newMessages}
						isPing={isPing}
						isPending={
							(latestTransaction?.status.toString() as ETransactionStatus) ===
							ETransactionStatus.PENDING
						}
					/>
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
