import { RefreshCw } from 'lucide-react'
import React from 'react'

import { formatNearlyDateTimeVN, isOneMinuteDifference } from '@/lib/utils'
import { EMessageStatus } from '@/models/enums'
import { IMessage } from '@/models/interfaces'

const MessageStatusIndicator = React.memo(
	({ message }: { message: IMessage }) => {
		const isTimeDistance = isOneMinuteDifference(message.time)
		switch (message.status) {
			case EMessageStatus.SENDING:
				return (
					<div className='text-muted-foreground flex items-center text-xs'>
						<div className='border-muted-foreground mr-1 h-3 w-3 animate-spin rounded-full border border-t-transparent' />
						Đang gửi...
					</div>
				)
			case EMessageStatus.SENT:
				return (
					<div className='text-muted-foreground flex justify-end text-xs'>
						Đã gửi {isTimeDistance && formatNearlyDateTimeVN(message.time)}
					</div>
				)
			case EMessageStatus.RECEIVED:
				return null
			case EMessageStatus.ERROR:
				return (
					<div className='mt-1 flex items-center text-xs text-red-500'>
						<span>⚠ Gửi thất bại</span>
						{message.retry && (
							<button
								onClick={message.retry}
								className='ml-2 flex items-center text-blue-500 transition-colors hover:text-blue-600'
							>
								<RefreshCw className='mr-1 h-3 w-3' />
								Thử lại
							</button>
						)}
					</div>
				)
			default:
				return null
		}
	}
)

export default MessageStatusIndicator
