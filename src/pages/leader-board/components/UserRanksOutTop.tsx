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
	return userRanks.slice(3).map((user, index) => (
		<div
			key={`${user.userID}-${index}`}
			className={`flex items-center rounded-xl p-5 transition-all duration-300 ${getRankStyle(index + 4)} ${myID === user.userID ? 'ring-primary/50 ring-2' : ''}`}
		>
			<div
				className={`relative h-12 w-12 overflow-hidden rounded-full ${getAvatarStyle(index + 4)}`}
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
							className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${getRankBadgeStyle(index + 4)}`}
						>
							{index + 4}
						</div>
					</div>
				</div>
			</div>
		</div>
	))
}

export default UserRanksOutTop
