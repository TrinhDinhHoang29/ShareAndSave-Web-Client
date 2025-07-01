import { motion } from 'framer-motion'
import { Award, Crown, Medal, Sparkles } from 'lucide-react'

import { getAvatarStyle } from '@/models/constants'
import { IUserRank } from '@/models/interfaces'

const PodiumTop = ({ users }: { users: IUserRank[] }) => {
	// Tính toán thứ hạng thực tế cho top 3
	const getTop3WithRealRank = (users: IUserRank[]) => {
		const top3 = users.slice(0, 3)
		const usersWithRank = []
		let currentRank = 1

		for (let i = 0; i < top3.length; i++) {
			const currentUser = top3[i]

			// Nếu không phải user đầu tiên và có điểm khác với user trước đó
			if (i > 0 && currentUser.goodPoint !== top3[i - 1].goodPoint) {
				currentRank = i + 1
			}

			usersWithRank.push({
				...currentUser,
				realRank: currentRank
			})
		}

		return usersWithRank
	}

	const top3WithRank = getTop3WithRealRank(users)
	const [first, second, third] = top3WithRank

	// Helper function để render badge dựa trên thứ hạng thực tế
	const getRankBadge = (realRank: number) => {
		switch (realRank) {
			case 1:
				return {
					icon: Sparkles,
					color: 'bg-warning',
					textColor: 'text-warning'
				}
			case 2:
				return { icon: Medal, color: 'bg-muted', textColor: 'text-foreground' }
			case 3:
				return { icon: Award, color: 'bg-accent', textColor: 'text-accent' }
			default:
				return { icon: Award, color: 'bg-muted', textColor: 'text-foreground' }
		}
	}

	// Helper function để render podium style dựa trên thứ hạng thực tế
	const getPodiumStyle = (realRank: number) => {
		switch (realRank) {
			case 1:
				return {
					containerBg: 'bg-warning/20',
					textColor: 'text-warning',
					size: 'h-20 w-20',
					cardWidth: 'min-w-[140px]',
					textSize: 'text-3xl',
					shadow: 'shadow-xl',
					glowColor: 'rgba(245, 158, 11, 0.4)',
					showCrown: true
				}
			case 2:
				return {
					containerBg: 'bg-muted/20',
					textColor: 'text-foreground',
					size: 'h-16 w-16',
					cardWidth: 'min-w-[120px]',
					textSize: 'text-2xl',
					shadow: 'shadow-lg',
					glowColor: 'rgba(148, 163, 184, 0.3)',
					showCrown: false
				}
			case 3:
				return {
					containerBg: 'bg-accent/20',
					textColor: 'text-accent',
					size: 'h-16 w-16',
					cardWidth: 'min-w-[120px]',
					textSize: 'text-2xl',
					shadow: 'shadow-lg',
					glowColor: 'rgba(105, 161, 230, 0.3)',
					showCrown: false
				}
			default:
				return {
					containerBg: 'bg-muted/20',
					textColor: 'text-foreground',
					size: 'h-16 w-16',
					cardWidth: 'min-w-[120px]',
					textSize: 'text-2xl',
					shadow: 'shadow-lg',
					glowColor: 'rgba(148, 163, 184, 0.3)',
					showCrown: false
				}
		}
	}

	const renderPodiumUser = (
		user: any,
		position: 'left' | 'center' | 'right'
	) => {
		if (!user) return null

		const badge = getRankBadge(user.realRank)
		const style = getPodiumStyle(user.realRank)
		const BadgeIcon = badge.icon

		return (
			<div
				className={`flex flex-col items-center ${position === 'center' ? 'relative' : ''}`}
			>
				{/* Crown for first place */}
				{style.showCrown && (
					<motion.div
						animate={{ rotate: [0, 5, -5, 0] }}
						transition={{ duration: 3, repeat: Infinity }}
						className='text-warning absolute -top-8'
					>
						<Crown className='h-8 w-8' />
					</motion.div>
				)}

				{/* Avatar */}
				<div className='relative mb-3'>
					<motion.div
						animate={{
							boxShadow: [
								`0 0 25px ${style.glowColor}`,
								`0 0 35px ${style.glowColor.replace('0.4', '0.6').replace('0.3', '0.5')}`,
								`0 0 25px ${style.glowColor}`
							]
						}}
						transition={{ duration: 2, repeat: Infinity }}
						className={`relative ${style.size} overflow-hidden rounded-full ${getAvatarStyle(user.realRank)}`}
					>
						<img
							src={user.userAvatar}
							alt={user.userName}
							className='h-full w-full object-cover'
						/>
					</motion.div>

					{/* Badge */}
					<motion.div
						animate={style.showCrown ? { scale: [1, 1.1, 1] } : {}}
						transition={{ duration: 2, repeat: Infinity }}
						className={`${badge.color} absolute -top-2 -right-2 rounded-full p-1.5 text-white ${style.shadow}`}
					>
						<BadgeIcon className='h-4 w-4' />
					</motion.div>
				</div>

				{/* User info card */}
				<div
					className={`${style.containerBg} ${style.cardWidth} rounded-lg p-4 text-center ${style.shadow}`}
				>
					<h3 className='text-foreground mb-1 truncate font-bold'>
						{user.userName}
					</h3>
					<p className={`${style.textColor} ${style.textSize} font-bold`}>
						{user.goodPoint}
					</p>
					<p className='text-muted-foreground text-xs'>điểm</p>
					{/* Hiển thị thứ hạng nếu có đồng hạng */}
					{user.realRank > 1 && (
						<p className='text-muted-foreground mt-1 text-xs'>
							Hạng #{user.realRank}
						</p>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className='mb-8'>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='mb-6 flex items-end justify-center gap-4'
			>
				{/* Sắp xếp lại để hiển thị đúng vị trí podium */}
				{renderPodiumUser(second, 'left')}
				{renderPodiumUser(first, 'center')}
				{renderPodiumUser(third, 'right')}
			</motion.div>
		</div>
	)
}

export default PodiumTop
