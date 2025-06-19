import React from 'react'

import { formatHoverTime } from '@/lib/utils'
import { IMessage } from '@/models/interfaces'

const MessageBubble = React.memo(
	({ message, index }: { message: IMessage; index: number }) => (
		<div
			key={`${message.id}-${index}`}
			className={`flex ${message.receiver === 'user' ? 'justify-end' : 'justify-start'}`}
		>
			<div
				className={`flex flex-col ${message.receiver === 'user' ? 'items-end' : 'items-start'} max-w-[60%]`}
			>
				<div
					className={`group relative w-full rounded-2xl px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md ${
						message.receiver === 'user'
							? 'bg-primary text-primary-foreground rounded-br-md'
							: 'border-border bg-card text-foreground rounded-bl-md border'
					}`}
				>
					<p className='text-sm leading-relaxed break-words'>
						{message.message}
					</p>
					<div
						className={`pointer-events-none absolute top-1/2 z-50 -translate-y-1/2 rounded-md bg-gray-800 px-3 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 ${
							message.receiver === 'user' ? 'right-full mr-2' : 'left-full ml-2'
						}`}
					>
						{formatHoverTime(message.time)}
					</div>
				</div>
			</div>
		</div>
	)
)

export default MessageBubble
