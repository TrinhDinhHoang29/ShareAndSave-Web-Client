import React from 'react'

import { getTotalGoodDeeds } from '@/lib/utils'
import {
	getAvatarStyle,
	getRankBadgeStyle,
	getRankStyle
} from '@/models/constants'
import { IUserRank } from '@/models/interfaces'

interface UserRanksOutTopProps {
	userRanks: IUserRank[]
	myID: number
}

const UserRanksOutTop: React.FC<UserRanksOutTopProps> = ({
	userRanks,
	myID
}) => {
	// Tính toán thứ hạng thực tế cho từng user
	const getUsersWithRealRank = (users: IUserRank[]) => {
		const usersWithRank = []
		let currentRank = 1

		for (let i = 0; i < users.length; i++) {
			const currentUser = users[i]

			// Nếu không phải user đầu tiên và có điểm khác với user trước đó
			if (i > 0 && currentUser.goodPoint !== users[i - 1].goodPoint) {
				currentRank = i + 1
			}

			usersWithRank.push({
				...currentUser,
				realRank: currentRank
			})
		}

		return usersWithRank
	}

	const usersWithRealRank = getUsersWithRealRank(userRanks)
	const usersOutOfTop3 = usersWithRealRank.slice(3)

	return usersOutOfTop3.map((user, index) => (
		<div
			key={`${user.userID}-${index}`}
			className={`flex items-center rounded-xl p-5 transition-all duration-300 ${getRankStyle(user.realRank)} ${myID === user.userID ? 'ring-primary/50 ring-2' : ''}`}
		>
			<div
				className={`relative h-12 w-12 overflow-hidden rounded-full ${getAvatarStyle(user.realRank)}`}
			>
				<img
					src={user.userAvatar}
					alt={user.userName}
					className='h-full w-full object-cover'
				/>
			</div>
			<div className='ml-5 flex-1'>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-foreground text-lg font-semibold'>
							{user.userName}
						</h3>
						<p className='text-muted-foreground text-sm'>{user.major}</p>
					</div>
					<div className='flex items-center space-x-6'>
						<div className='text-right'>
							<div className='text-muted-foreground text-sm'>
								<span className='text-foreground text-lg font-bold'>
									{user.goodPoint}
								</span>{' '}
								điểm
							</div>
							<div className='text-muted-foreground text-xs'>
								<span className='text-foreground font-medium'>
									{getTotalGoodDeeds(user.goodDeeds)}
								</span>{' '}
								việc tốt
							</div>
						</div>
						<div
							className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${getRankBadgeStyle(user.realRank)}`}
						>
							{user.realRank}
						</div>
					</div>
				</div>
			</div>
		</div>
	))
}

export default UserRanksOutTop
