import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, Send } from 'lucide-react'
import React, { forwardRef, useCallback, useEffect, useRef } from 'react'

import Loading from '@/components/common/Loading'
import { formatHoverTime } from '@/lib/utils'
import { EMessageStatus } from '@/models/enums'
import { IMessage } from '@/models/interfaces'

interface Props {
	messages: IMessage[]
	message: string
	setMessage: (val: string) => void
	handleSend: () => void
	handleKeyPress: (e: React.KeyboardEvent) => void
	sentinelRef?: (node: HTMLElement | null) => void
	hasNextPage?: boolean
	isFetchingNextPage?: boolean
	isMoreThanLimitMessage?: boolean
}

const ChatMessagesPanel = forwardRef<HTMLDivElement, Props>(
	(
		{
			messages,
			message,
			setMessage,
			handleSend,
			handleKeyPress,
			sentinelRef,
			hasNextPage = false,
			isFetchingNextPage = false,
			isMoreThanLimitMessage
		},
		ref
	) => {
		const messagesEndRef = useRef<HTMLDivElement>(null)
		const previousScrollHeight = useRef<number>(0)
		const shouldMaintainScrollPosition = useRef<boolean>(false)

		// Maintain scroll position when loading more messages
		const maintainScrollPosition = useCallback(() => {
			if (ref && typeof ref === 'object' && ref.current) {
				const container = ref.current
				const currentScrollHeight = container.scrollHeight
				const heightDifference =
					currentScrollHeight - previousScrollHeight.current

				if (heightDifference > 0 && shouldMaintainScrollPosition.current) {
					container.scrollTop = container.scrollTop + heightDifference
					shouldMaintainScrollPosition.current = false
				}

				previousScrollHeight.current = currentScrollHeight
			}
		}, [ref])

		// Track when we're loading more messages (when new messages are added to the beginning)
		const prevMessagesLength = useRef<number>(0)
		useEffect(() => {
			if (messages.length > prevMessagesLength.current) {
				const newMessagesCount = messages.length - prevMessagesLength.current
				const lastMessage = messages[messages.length - 1]

				// If new messages are added to the end (new chat messages), scroll to bottom
				if (
					lastMessage &&
					lastMessage.receiver === 'user' &&
					lastMessage.status === EMessageStatus.SENDING
				) {
					setTimeout(() => {
						messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
					}, 0)
				}
				// If messages are added to the beginning (loading old messages), maintain position
				else if (newMessagesCount > 1) {
					shouldMaintainScrollPosition.current = true
					maintainScrollPosition()
				}
			}

			prevMessagesLength.current = messages.length
		}, [messages, maintainScrollPosition])

		// Initial scroll to bottom when messages first load
		useEffect(() => {
			if (messages.length > 0 && prevMessagesLength.current === 0) {
				setTimeout(() => {
					if (messagesEndRef.current) {
						messagesEndRef.current.scrollIntoView({ behavior: 'auto' })
					}
				}, 100)
			}
		}, [messages.length])

		// Auto scroll to bottom for new messages (only when near bottom)
		useEffect(() => {
			if (
				messagesEndRef.current &&
				ref &&
				typeof ref === 'object' &&
				ref.current
			) {
				const container = ref.current
				const isAtBottom =
					container.scrollHeight -
						container.scrollTop -
						container.clientHeight <
					100

				// Only auto scroll if user is near bottom
				if (isAtBottom) {
					messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
				}
			}
		}, [messages.length, ref])

		// Hàm render status message
		const renderMessageStatus = (msg: IMessage) => {
			if (msg.receiver !== 'user') return null
			switch (msg.status) {
				case EMessageStatus.SENDING:
					return (
						<div className='text-muted-foreground mt-1 flex items-center text-xs'>
							<div className='border-muted-foreground mr-1 h-3 w-3 animate-spin rounded-full border border-t-transparent'></div>
							Đang gửi...
						</div>
					)
				case EMessageStatus.SENT:
					return (
						<div className='text-muted-foreground mt-1 text-xs'>✓ Đã gửi</div>
					)
				case EMessageStatus.ERROR:
					return (
						<div className='mt-1 flex items-center text-xs text-red-500'>
							<span>⚠ Gửi thất bại</span>
							{msg.retry && (
								<button
									onClick={msg.retry}
									className='ml-2 flex items-center text-blue-500 transition-colors hover:text-blue-600'
								>
									<RefreshCw className='mr-1 h-3 w-3' />
									Thử lại
								</button>
							)}
						</div>
					)
				case EMessageStatus.DELIVERED:
					return null
				default:
					return null
			}
		}

		return (
			<>
				{/* Messages */}
				<div
					ref={ref}
					className='bg-muted messages-container flex max-h-[400px] min-h-[350px] flex-1 flex-col overflow-y-auto px-6 py-4'
				>
					{/* Sentinel ở đầu danh sách cho infinite scroll */}
					{isFetchingNextPage && (
						<Loading
							size='sm'
							color='secondary'
						/>
					)}
					{/* Sentinel cho infinite scroll */}
					{hasNextPage && (
						<div
							ref={sentinelRef}
							style={{ height: '1px' }}
						/>
					)}
					{/* Hiển thị thông báo khi không còn dữ liệu */}
					{isMoreThanLimitMessage && (
						<div className='py-4 text-center'>
							<span className='text-muted-foreground text-sm'>
								Đã hiển thị tất cả tin nhắn
							</span>
						</div>
					)}

					<AnimatePresence>
						{messages.map((msg, i) => (
							<motion.div
								key={`${msg.id}-${i}`}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -10 }}
								transition={{ duration: 0.2 }}
								className={`mb-4 flex ${msg.receiver === 'user' ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`flex flex-col ${
										msg.receiver === 'user' ? 'items-end' : 'items-start'
									} max-w-[60%]`}
								>
									<div
										className={`group relative w-full rounded-2xl px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md ${
											msg.receiver === 'user'
												? 'bg-primary text-primary-foreground rounded-br-md'
												: 'border-border bg-card text-foreground rounded-bl-md border'
										}`}
									>
										<p className='text-sm leading-relaxed break-words'>
											{msg.message}
										</p>
										{/* Hover time tooltip */}
										<div
											className={`pointer-events-none absolute top-1/2 z-10 flex h-full -translate-y-1/2 items-center justify-center rounded-md px-2 text-xs opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 ${
												msg.receiver === 'user'
													? 'right-full mr-1 bg-gray-800 text-white'
													: 'left-full ml-1 bg-gray-800 text-white'
											}`}
										>
											{formatHoverTime(msg.time)}
										</div>
									</div>
									{renderMessageStatus(msg)}
								</div>
							</motion.div>
						))}
					</AnimatePresence>

					{/* Sentinel để đánh dấu cuối danh sách */}
					<div
						ref={messagesEndRef}
						className='h-1'
					/>
				</div>

				{/* Input */}
				<div className='border-border bg-card border-t px-4 py-3'>
					<div className='flex space-x-3'>
						<input
							type='text'
							value={message}
							onChange={e => setMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							className='border-border focus:ring-primary bg-background flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
							placeholder='Nhập tin nhắn...'
						/>
						<button
							onClick={handleSend}
							disabled={!message.trim()}
							className={`bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground flex min-w-[60px] items-center justify-center rounded-xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none`}
						>
							<Send className='h-5 w-5' />
						</button>
					</div>
				</div>
			</>
		)
	}
)

export default ChatMessagesPanel
