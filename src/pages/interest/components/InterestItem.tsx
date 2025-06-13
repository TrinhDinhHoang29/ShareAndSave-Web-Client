import clsx from 'clsx'
import {
	Calendar,
	Clock,
	MessageCircle,
	MessageCircleWarning,
	User
} from 'lucide-react'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

import { useListTransactionQuery } from '@/hooks/queries/use-transaction.query'
import { formatNearlyDateTimeVN } from '@/lib/utils'
import { ETransactionStatus } from '@/models/enums'
import { ITransactionParams, IUserInterest } from '@/models/interfaces'

export const InterestItem = ({
	userInterest,
	postID
}: {
	userInterest: IUserInterest
	postID: number
}) => {
	const navigate = useNavigate()

	const handleOpenChat = () => {
		const receiver = {
			id: userInterest.userID,
			name: userInterest.userName
		}

		navigate(`/chat/${postID}/${userInterest.id}`, {
			state: { receiver }
		})
	}
	const params: ITransactionParams = useMemo(
		() => ({
			postID,
			searchBy: 'interestID',
			searchValue: userInterest.id.toString()
		}),
		[postID, userInterest]
	)

	const { data: transactions } = useListTransactionQuery(params)
	const isPendingTransaction = useMemo(() => {
		if (transactions && transactions.length > 0) {
			const status = transactions[0].status.toString() as ETransactionStatus
			return status === ETransactionStatus.PENDING
		}
		return false
	}, [transactions])

	return (
		<div className='relative'>
			<div className='border-border bg-card flex items-center justify-between rounded-xl border p-4 shadow-sm transition-shadow duration-200 hover:shadow-md'>
				<div className='flex items-center space-x-4'>
					<div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
						{userInterest?.userAvatar ? (
							<img
								src={userInterest?.userAvatar}
								alt={`${userInterest?.userName} avatar`}
								className='h-full w-full rounded-full object-cover'
							/>
						) : (
							<User className='text-secondary h-5 w-5' /> // Placeholder nếu không có avatar
						)}
					</div>
					<div>
						<p className='text-foreground font-semibold'>
							{userInterest.userName}
						</p>
						<div className='text-muted-foreground mt-1 flex items-center space-x-2 text-sm'>
							<Clock className='h-4 w-4' />
							<span>{formatNearlyDateTimeVN(userInterest.createdAt)}</span>
							{/* <div className='ml-2 flex items-center space-x-1'>
								<CheckCircle className='text-chart-1 h-4 w-4' />
								<span className='text-chart-1 font-medium'>Hoàn thành</span>
							</div> */}
						</div>
					</div>
				</div>

				<button
					className={clsx(
						`text-primary-foreground rounded-xl p-3 shadow-lg transition-all duration-200 hover:shadow-xl`,
						isPendingTransaction ? 'bg-chart-2' : 'bg-primary'
					)}
					onClick={handleOpenChat}
					aria-label='Chat'
				>
					{isPendingTransaction ? (
						<MessageCircleWarning className='h-5 w-5' />
					) : (
						<MessageCircle className='h-5 w-5' />
					)}
				</button>
			</div>
		</div>
	)
}
