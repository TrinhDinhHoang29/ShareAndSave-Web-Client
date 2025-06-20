import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

interface ConnectionStatusIndicatorProps {
	status: 'connecting' | 'connected' | 'disconnected' | 'reconnecting'
	onReconnect?: () => void
	inline?: boolean
	className?: string
}

const ConnectionStatusIndicator = ({
	status,
	onReconnect,
	inline = false,
	className = ''
}: ConnectionStatusIndicatorProps) => {
	const getStatusConfig = () => {
		switch (status) {
			case 'connecting':
				return {
					icon: RefreshCw,
					text: 'Đang kết nối...',
					bgColor: 'bg-yellow-100 border-yellow-200',
					textColor: 'text-yellow-800',
					iconColor: 'text-yellow-600',
					showReconnect: false,
					animate: true
				}
			case 'reconnecting':
				return {
					icon: RefreshCw,
					text: 'Đang kết nối lại...',
					bgColor: 'bg-orange-100 border-orange-200',
					textColor: 'text-orange-800',
					iconColor: 'text-orange-600',
					showReconnect: false,
					animate: true
				}
			case 'disconnected':
				return {
					icon: WifiOff,
					text: 'Mất kết nối',
					bgColor: 'bg-red-100 border-red-200',
					textColor: 'text-red-800',
					iconColor: 'text-red-600',
					showReconnect: true,
					animate: false
				}
			default:
				return {
					icon: Wifi,
					text: 'Đã kết nối',
					bgColor: 'bg-green-100 border-green-200',
					textColor: 'text-green-800',
					iconColor: 'text-green-600',
					showReconnect: false,
					animate: false
				}
		}
	}

	const config = getStatusConfig()
	const Icon = config.icon

	if (inline) {
		return (
			<div
				className={`mx-4 my-2 flex items-center justify-center gap-2 rounded-lg border px-3 py-2 ${config.bgColor} ${config.textColor} ${className} `}
			>
				<Icon
					size={16}
					className={`${config.iconColor} ${config.animate ? 'animate-spin' : ''}`}
				/>
				<span className='text-sm font-medium'>{config.text}</span>
				{config.showReconnect && onReconnect && (
					<button
						onClick={onReconnect}
						className='ml-2 rounded border bg-white px-2 py-1 text-xs font-medium transition-colors hover:bg-gray-50'
					>
						Kết nối lại
					</button>
				)}
			</div>
		)
	}

	return (
		<div
			className={`flex items-center justify-between border-b px-4 py-2 ${config.bgColor} ${config.textColor} ${className} `}
		>
			<div className='flex items-center gap-2'>
				<Icon
					size={16}
					className={`${config.iconColor} ${config.animate ? 'animate-spin' : ''}`}
				/>
				<span className='text-sm font-medium'>{config.text}</span>
			</div>
			{config.showReconnect && onReconnect && (
				<button
					onClick={onReconnect}
					className='rounded border bg-white px-3 py-1 text-xs font-medium transition-colors hover:bg-gray-50'
				>
					Kết nối lại
				</button>
			)}
		</div>
	)
}

export default ConnectionStatusIndicator
