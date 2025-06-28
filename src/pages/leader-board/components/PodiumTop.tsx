import { motion } from 'framer-motion'
import { Award, Crown, Medal, Sparkles } from 'lucide-react'

import { getAvatarStyle } from '@/models/constants'
import { IUserRank } from '@/models/interfaces'

const PodiumTop = ({ users }: { users: IUserRank[] }) => {
	const [first, second, third] = users.slice(0, 3)

	return (
		<div className='mb-8'>
			<motion.div
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='mb-6 flex items-end justify-center gap-4'
			>
				{/* Second Place */}
				{second && (
					<div className='flex flex-col items-center'>
						<div className='relative mb-3'>
							<motion.div
								animate={{
									boxShadow: [
										'0 0 20px rgba(148, 163, 184, 0.3)',
										'0 0 30px rgba(148, 163, 184, 0.5)',
										'0 0 20px rgba(148, 163, 184, 0.3)'
									]
								}}
								transition={{ duration: 2, repeat: Infinity }}
								className={`relative h-16 w-16 overflow-hidden rounded-full ${getAvatarStyle(2)}`}
							>
								<img
									src={second.userAvatar}
									alt={second.userName}
									className='h-full w-full object-cover'
								/>
							</motion.div>
							<div className='bg-muted text-foreground absolute -top-2 -right-2 rounded-full p-1.5 shadow-lg'>
								<Medal className='h-4 w-4' />
							</div>
						</div>
						<div className='bg-muted/20 min-w-[120px] rounded-lg p-4 text-center shadow-lg'>
							<h3 className='text-foreground mb-1 truncate font-bold'>
								{second.userName}
							</h3>
							<p className='text-foreground text-2xl font-bold'>
								{second.goodPoint}
							</p>
							<p className='text-muted-foreground text-xs'>điểm</p>
						</div>
					</div>
				)}

				{/* First Place */}
				{first && (
					<div className='relative flex flex-col items-center'>
						<motion.div
							animate={{ rotate: [0, 5, -5, 0] }}
							transition={{ duration: 3, repeat: Infinity }}
							className='text-warning absolute -top-8'
						>
							<Crown className='h-8 w-8' />
						</motion.div>
						<div className='relative mb-3'>
							<motion.div
								animate={{
									boxShadow: [
										'0 0 25px rgba(245, 158, 11, 0.4)',
										'0 0 35px rgba(245, 158, 11, 0.6)',
										'0 0 25px rgba(245, 158, 11, 0.4)'
									]
								}}
								transition={{ duration: 2, repeat: Infinity }}
								className={`relative h-20 w-20 overflow-hidden rounded-full ${getAvatarStyle(1)}`}
							>
								<img
									src={first.userAvatar}
									alt={first.userName}
									className='h-full w-full object-cover'
								/>
							</motion.div>
							<motion.div
								animate={{ scale: [1, 1.1, 1] }}
								transition={{ duration: 2, repeat: Infinity }}
								className='bg-warning absolute -top-2 -right-2 rounded-full p-2 text-white shadow-lg'
							>
								<Sparkles className='h-4 w-4' />
							</motion.div>
						</div>
						<div className='bg-warning/20 min-w-[140px] rounded-lg p-4 text-center shadow-xl'>
							<h3 className='text-foreground mb-1 truncate font-bold'>
								{first.userName}
							</h3>
							<p className='text-warning text-3xl font-bold'>
								{first.goodPoint}
							</p>
							<p className='text-muted-foreground text-xs'>điểm</p>
						</div>
					</div>
				)}

				{/* Third Place */}
				{third && (
					<div className='flex flex-col items-center'>
						<div className='relative mb-3'>
							<motion.div
								animate={{
									boxShadow: [
										'0 0 20px rgba(105, 161, 230, 0.3)',
										'0 0 30px rgba(105, 161, 230, 0.5)',
										'0 0 20px rgba(105, 161, 230, 0.3)'
									]
								}}
								transition={{ duration: 2, repeat: Infinity }}
								className={`relative h-16 w-16 overflow-hidden rounded-full ${getAvatarStyle(3)}`}
							>
								<img
									src={third.userAvatar}
									alt={third.userName}
									className='h-full w-full object-cover'
								/>
							</motion.div>
							<div className='bg-accent absolute -top-2 -right-2 rounded-full p-1.5 text-white shadow-lg'>
								<Award className='h-4 w-4' />
							</div>
						</div>
						<div className='bg-accent/20 min-w-[120px] rounded-lg p-4 text-center shadow-lg'>
							<h3 className='text-foreground mb-1 truncate font-bold'>
								{third.userName}
							</h3>
							<p className='text-accent text-2xl font-bold'>
								{third.goodPoint}
							</p>
							<p className='text-muted-foreground text-xs'>điểm</p>
						</div>
					</div>
				)}
			</motion.div>
		</div>
	)
}

export default PodiumTop
