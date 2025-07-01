import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import clsx from 'clsx'
import { ChevronDown, Clock, User } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import Loading from '@/components/common/Loading'
import { useAlertModalContext } from '@/context/alert-modal-context'
import { useChatNotification } from '@/context/chat-noti-context'
import { useUpdateTransactionMutation } from '@/hooks/mutations/use-transaction.mutation'
import { useDetailTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import {
	getConfirmContentTransactionStatus,
	getTransactionStatusConfig
} from '@/models/constants'
import { EMethod, ETransactionStatus } from '@/models/enums'
import { ITransactionRequest, IUserInterest } from '@/models/interfaces'

import ChatButton from './ChatButton'

const ButtonStatus = ({
	handleClick,
	type,
	close
}: {
	handleClick: () => void
	type: ETransactionStatus
	close: () => void
}) => {
	const { Icon, background, textColor, label } = getTransactionStatusConfig(
		true,
		type
	)

	const onClick = () => {
		handleClick()
		close()
	}

	return (
		<MenuItem>
			<button
				onClick={onClick}
				className={clsx(
					'flex w-full items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors data-[focus]:bg-gray-50',
					background,
					textColor
				)}
			>
				<div className='flex h-8 w-8 items-center justify-center rounded-full'>
					<Icon className='h-4 w-4' />
				</div>
				<span>{label}</span>
			</button>
		</MenuItem>
	)
}

export const InterestItem = ({
	userInterest,
	authorID,
	isQuick = false,
	updateTransactionStatus
}: {
	userInterest: IUserInterest
	authorID?: number
	isQuick?: boolean
	updateTransactionStatus?: (
		interestID: number,
		status: ETransactionStatus,
		method: EMethod
	) => void
}) => {
	const { showConfirm } = useAlertModalContext()
	const userInterstStable = useMemo(() => userInterest, [userInterest])

	const {
		data: transaction,
		isPending,
		refetch
	} = useDetailTransactionQuery(userInterstStable.id)

	useEffect(() => {
		if (transaction) {
			updateTransactionStatus?.(
				userInterstStable.id,
				transaction.status.toString() as ETransactionStatus,
				transaction.method?.toString() as EMethod
			)
		}
	}, [transaction])

	const itemsText = useMemo(() => {
		if (!transaction?.items || transaction.items.length === 0) {
			return ''
		}

		const itemTexts = transaction.items.map(
			item => `${item.itemName}: ${item.quantity}`
		)

		const fullText = itemTexts.join(', ')

		// Truncate nếu quá dài (giới hạn 80 ký tự)
		if (fullText.length > 80) {
			return fullText.substring(0, 80) + '...'
		}

		return fullText
	}, [transaction])

	const transactionStatusConfig = useMemo(() => {
		if (transaction)
			return getTransactionStatusConfig(
				true,
				transaction?.status || ETransactionStatus.DEFAULT
			)
	}, [transaction])

	const { mutate: updateTransactionMutation } = useUpdateTransactionMutation({
		onSuccess: () => {
			if (transaction) {
				refetch()
			}
		}
	})

	const handleConfirmTransaction = async (status: ETransactionStatus) => {
		const content = getConfirmContentTransactionStatus(status)
		const handle = () => {
			const transactionRequest: ITransactionRequest = {
				status: Number(status)
			}
			updateTransactionMutation({
				transactionID: transaction?.id || 0,
				data: transactionRequest
			})
		}
		if (isQuick) {
			handle()
			return
		}
		showConfirm({
			confirmButtonText: 'Xác nhận',
			confirmMessage: content.message,
			confirmTitle: content.title,
			onConfirm: async () => {
				handle()
			},
			cancelButtonText: 'Hủy'
		})
	}

	const { followedByNotification } = useChatNotification()
	const [duplicateFollowedByNotification, setDuplicateFollowedByNotification] =
		useState(followedByNotification)
	const [newMessages, setNewMessages] = useState<number>(
		userInterstStable.unreadMessageCount || 0
	)
	const [isPing, setIsPing] = useState(false)

	useEffect(() => {
		if (
			followedByNotification &&
			followedByNotification.interestID === userInterstStable.id &&
			duplicateFollowedByNotification !== followedByNotification
		) {
			setNewMessages(prev => prev + 1)
			setIsPing(true)
			setDuplicateFollowedByNotification(followedByNotification)
		}
	}, [followedByNotification])

	const canUpdateStatus =
		(transaction?.status.toString() as ETransactionStatus) ===
			ETransactionStatus.SUCCESS ||
		(transaction?.status.toString() as ETransactionStatus) ===
			ETransactionStatus.PENDING

	return (
		<div className='border-border bg-card relative space-y-4 rounded-xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
			{isPending ? (
				<Loading />
			) : (
				<>
					<div className='flex items-center justify-between'>
						<div className='flex w-2/3 items-center space-x-4'>
							<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
								{userInterstStable?.userAvatar ? (
									<img
										src={userInterstStable?.userAvatar}
										alt={`${userInterstStable?.userName} avatar`}
										className='h-full w-full rounded-full object-cover'
									/>
								) : (
									<User className='text-secondary h-5 w-5' />
								)}
							</div>
							<div className='flex-1 space-y-1'>
								{transaction?.method && (
									<span
										className={`bg-primary text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium`}
									>
										{transaction.method}
									</span>
								)}

								<div className='flex items-center gap-2'>
									<p className='text-foreground font-semibold'>
										{userInterstStable.userName}
									</p>
									<div className='text-muted-foreground flex items-center text-sm'>
										<Clock className='mr-1 h-3 w-3' />
										<span>
											{formatNearlyDateTimeVN(
												transaction?.updatedAt || userInterstStable.createdAt
											)}
										</span>
									</div>
								</div>

								{itemsText && (
									<div className='text-muted-foreground text-sm'>
										<span className='line-clamp-2 space-x-2 overflow-hidden'>
											{/* <span className="font-medium mr-1">Yêu cầu:</span> */}
											{itemsText}
										</span>
									</div>
								)}
							</div>
						</div>

						{/* Right section - Actions */}
						<div className='flex flex-1 items-center justify-end gap-2'>
							{transactionStatusConfig && (
								<>
									{canUpdateStatus ? (
										<Menu
											as='div'
											className='relative'
										>
											<MenuButton
												className={clsx(
													'flex items-center space-x-1 rounded-full px-3 py-1.5 text-sm transition-colors hover:opacity-80 data-[open]:opacity-80',
													transactionStatusConfig?.background,
													transactionStatusConfig?.textColor
												)}
											>
												<span>{transactionStatusConfig?.label}</span>
												<ChevronDown className='h-4 w-4 transition-transform data-[open]:rotate-180' />
											</MenuButton>

											<MenuItems className='absolute top-full right-0 z-20 mt-2 w-48 origin-top-right overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl data-[closed]:scale-95 data-[closed]:opacity-0 data-[enter]:duration-100 data-[enter]:ease-out data-[leave]:duration-75 data-[leave]:ease-in'>
												{transaction &&
													(transaction.status.toString() as ETransactionStatus) ===
														ETransactionStatus.PENDING && (
														<>
															<ButtonStatus
																handleClick={() =>
																	handleConfirmTransaction(
																		ETransactionStatus.SUCCESS
																	)
																}
																type={ETransactionStatus.SUCCESS}
																close={() => {}}
															/>
															<ButtonStatus
																handleClick={() =>
																	handleConfirmTransaction(
																		ETransactionStatus.CANCELLED
																	)
																}
																type={ETransactionStatus.CANCELLED}
																close={() => {}}
															/>
														</>
													)}
												{transaction &&
													(transaction.status.toString() as ETransactionStatus) ===
														ETransactionStatus.SUCCESS && (
														<ButtonStatus
															handleClick={() =>
																handleConfirmTransaction(
																	ETransactionStatus.REJECTED
																)
															}
															type={ETransactionStatus.REJECTED}
															close={() => {}}
														/>
													)}
											</MenuItems>
										</Menu>
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
								</>
							)}

							<ChatButton
								interestID={userInterstStable.id}
								newMessages={newMessages}
								isPing={isPing}
								isPending={
									(transaction?.status.toString() as ETransactionStatus) ===
									ETransactionStatus.PENDING
								}
							/>
						</div>
					</div>

					{userInterstStable.newMessage && authorID && (
						<p className='text-muted-foreground bg-muted/50 line-clamp-2 rounded-lg px-4 py-2 text-sm leading-relaxed'>
							{authorID === userInterstStable.messageFromID
								? 'Bạn'
								: 'Đối phương'}
							: {userInterstStable.newMessage}
						</p>
					)}
				</>
			)}
		</div>
	)
}
