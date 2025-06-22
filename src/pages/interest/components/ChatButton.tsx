import clsx from 'clsx'
import { MessageCircle, MessageCircleWarning } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router-dom'

interface ChatButtonProps {
	interestID: string | number
	newMessages?: number
	isPing?: boolean
	isPending?: boolean
	className?: string
	size?: 'sm' | 'md' | 'lg'
}

const ChatButton: FC<ChatButtonProps> = ({
	interestID,
	newMessages = 0,
	isPing = false,
	isPending = false,
	className = '',
	size = 'md'
}) => {
	const sizeConfig = {
		sm: {
			button: 'p-2 rounded-full',
			icon: 'h-4 w-4',
			badge: 'h-5 w-5 text-xs',
			position: '-top-1 -right-1'
		},
		md: {
			button: 'p-3 rounded-full',
			icon: 'h-5 w-5',
			badge: 'h-6 w-6 text-xs',
			position: '-top-2 -right-2'
		},
		lg: {
			button: 'p-4 rounded-full',
			icon: 'h-6 w-6',
			badge: 'h-7 w-7 text-sm',
			position: '-top-2 -right-2'
		}
	}

	const config = sizeConfig[size]

	return (
		<Link
			to={`/chat/${interestID}`}
			className={clsx(
				'text-primary-foreground relative shadow-lg transition-all duration-200 hover:shadow-xl',
				isPending ? 'bg-warning' : 'bg-primary',
				config.button,
				className
			)}
			aria-label={isPending ? 'Đang có giao dịch' : 'Chat với đối phương'}
			title={isPending ? 'Đang có giao dịch' : 'Chat với đối phương'}
		>
			{isPending ? (
				<MessageCircleWarning className={config.icon} />
			) : (
				<MessageCircle className={config.icon} />
			)}

			{newMessages > 0 && (
				<div className={clsx('absolute', config.position)}>
					{/* Ping animation rings */}
					{isPing && (
						<>
							<span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75'></span>
						</>
					)}

					{/* Message count badge */}
					<span
						className={clsx(
							'relative flex items-center justify-center rounded-full bg-red-500 font-medium text-white shadow-lg',
							config.badge
						)}
					>
						{newMessages > 99 ? '99+' : newMessages}
					</span>
				</div>
			)}
		</Link>
	)
}

export default ChatButton
