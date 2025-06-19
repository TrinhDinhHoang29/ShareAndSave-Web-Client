import React from 'react'

import Loading from '@/components/common/Loading'
import { shouldShowTimestamp } from '@/lib/utils'
import { IMessage } from '@/models/interfaces'

import MessageBubble from './MessageBubble'
import MessageStatusIndicator from './MessageStatusIndicator'
import TimestampDivider from './TimestampDivider'

const MessagesContainer = React.memo(
	({
		scrollContainerRef,
		onScroll,
		hasNextPage,
		isFetchingNextPage,
		allMessages,
		isStatusChange
	}: {
		scrollContainerRef: React.RefObject<HTMLDivElement | null>
		onScroll: () => void
		hasNextPage: boolean
		isFetchingNextPage: boolean
		allMessages: IMessage[]
		isStatusChange: boolean
	}) => (
		<div
			ref={scrollContainerRef}
			onScroll={onScroll}
			className='bg-muted messages-container max-h-[400px] min-h-[350px] flex-1 overflow-y-auto'
		>
			{/* End of messages indicator */}
			{!hasNextPage && allMessages.length > 0 && (
				<div className='flex justify-center pt-4'>
					<div className='text-muted-foreground text-xs'>
						Không còn tin nhắn nào
					</div>
				</div>
			)}

			{/* Loading indicator */}
			{isFetchingNextPage && (
				<Loading
					size='sm'
					color='primary'
				/>
			)}

			{/* Messages with timestamp dividers */}
			<div className='space-y-2 p-4'>
				{allMessages.map((msg, i) => (
					<React.Fragment key={`${msg.id}-${i}`}>
						{/* Show timestamp if there's a significant time gap */}
						{shouldShowTimestamp(msg, allMessages[i - 1]) && (
							<TimestampDivider timestamp={msg.time} />
						)}
						<MessageBubble
							message={msg}
							index={i}
						/>
					</React.Fragment>
				))}
				{isStatusChange ? (
					<MessageStatusIndicator
						message={allMessages[allMessages.length - 1]}
					/>
				) : null}
			</div>
		</div>
	)
)

export default MessagesContainer
