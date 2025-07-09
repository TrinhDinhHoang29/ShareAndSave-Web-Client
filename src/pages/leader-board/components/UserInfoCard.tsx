import { Heart, Star, Trophy, User } from 'lucide-react'
import React from 'react'

import { getTotalGoodDeeds } from '@/lib/utils'

interface UserInfo {
	userAvatar?: string
	userName: string
	major: string
	goodPoint: number
	goodDeeds: any[] // Adjust type based on actual data structure
}

interface UserInfoCardProps {
	myInfo: UserInfo
	myRank: number
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ myInfo, myRank }) => {
	return (
		<div className='mb-6'>
			{/* User Info */}
			<div className='mb-6 flex items-center gap-4'>
				<div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
					{myInfo.userAvatar ? (
						<img
							src={myInfo.userAvatar}
							alt={myInfo.userName}
							className='h-full w-full rounded-full object-cover'
						/>
					) : (
						<User className='text-primary h-6 w-6' />
					)}
				</div>
				<div>
					<h3 className='text-foreground text-lg font-semibold'>
						{myInfo.userName}
					</h3>
					<p className='text-muted-foreground text-sm'>{myInfo.major}</p>
				</div>
			</div>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
				<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
					<div className='bg-primary/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
						<Star className='text-primary h-5 w-5' />
					</div>
					<p className='text-muted-foreground mb-1 text-sm'>
						Xếp hạng hiện tại
					</p>
					<p className='text-foreground text-2xl font-bold'>#{myRank}</p>
				</div>
				<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
					<div className='bg-warning/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
						<Trophy className='text-warning h-5 w-5' />
					</div>
					<p className='text-muted-foreground mb-1 text-sm'>Điểm tích lũy</p>
					<p className='text-foreground text-2xl font-bold'>
						{myInfo.goodPoint}
					</p>
				</div>
				<div className='neumorphic rounded-lg p-4 text-center transition-all duration-200 hover:shadow-lg'>
					<div className='bg-success/10 mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full'>
						<Heart className='text-success h-5 w-5' />
					</div>
					<p className='text-muted-foreground mb-1 text-sm'>Việc tốt</p>
					<p className='text-foreground text-2xl font-bold'>
						{getTotalGoodDeeds(myInfo.goodDeeds)}
					</p>
				</div>
			</div>
		</div>
	)
}

export default UserInfoCard
