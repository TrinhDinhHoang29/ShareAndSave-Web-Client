import { AnimatePresence, motion } from 'framer-motion'
import { RefreshCw, Send } from 'lucide-react'
import React, { useEffect, useRef } from 'react'

enum EMessageStatus {
	SENDING = 'sending',
	SENT = 'sent',
	ERROR = 'error',
	DELIVERED = 'delivered'
}

interface Message {
	id: string
	receiver: 'user' | 'other'
	text: string
	time: string
	status: EMessageStatus
	retry?: () => void
}

interface Props {
	messages: Message[]
	message: string
	setMessage: (val: string) => void
	handleSend: () => void
	handleKeyPress: (e: React.KeyboardEvent) => void
}

export const ChatMessagesPanel = ({
	messages,
	message,
	setMessage,
	handleSend,
	handleKeyPress
}: Props) => {
	const messagesEndRef = useRef<HTMLDivElement>(null)

	// Auto scroll to bottom when new messages arrive
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	// Hàm định dạng thời gian hiển thị
	const formatDisplayTime = (dateString: string): string => {
		try {
			const now = new Date()
			const date = new Date(dateString)
			const diffMs = now.getTime() - date.getTime()
			const diffMinutes = Math.floor(diffMs / (1000 * 60))
			const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
			const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

			if (diffMinutes < 1) {
				return 'Vừa xong'
			} else if (diffMinutes < 60) {
				return `${diffMinutes} phút trước`
			} else if (diffHours < 24) {
				return date.toLocaleTimeString('vi-VN', {
					hour: '2-digit',
					minute: '2-digit'
				})
			} else if (diffDays < 7) {
				return date.toLocaleDateString('vi-VN', {
					weekday: 'short',
					hour: '2-digit',
					minute: '2-digit'
				})
			} else {
				return date.toLocaleDateString('vi-VN', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric',
					hour: '2-digit',
					minute: '2-digit'
				})
			}
		} catch {
			return dateString
		}
	}

	// Hàm render status message
	const renderMessageStatus = (msg: Message) => {
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
			<div className='bg-muted max-h-[400px] min-h-[350px] flex-1 overflow-y-auto px-6 py-4'>
				<AnimatePresence>
					{messages.map(msg => (
						<motion.div
							key={msg.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className={`mb-4 flex ${msg.receiver === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`flex flex-col ${msg.receiver === 'user' ? 'items-end' : 'items-start'} max-w-[80%]`}
							>
								<div
									className={`group relative rounded-2xl px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-md ${
										msg.receiver === 'user'
											? 'bg-primary text-primary-foreground rounded-br-md'
											: 'border-border bg-card text-foreground rounded-bl-md border'
									}`}
								>
									<p className='text-sm leading-relaxed break-words'>
										{msg.text}
									</p>

									{/* Hover time tooltip */}
									<div
										className={`pointer-events-none absolute top-1/2 z-10 flex h-full max-w-64 min-w-20 -translate-y-1/2 items-center justify-center rounded-md text-xs opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 ${
											msg.receiver === 'user'
												? 'right-full mr-1 bg-gray-800 text-white'
												: 'left-full ml-1 bg-gray-800 text-white'
										}`}
									>
										{formatDisplayTime(msg.time)}
									</div>
								</div>

								{/* Message status - hiển thị dưới tin nhắn */}
								{renderMessageStatus(msg)}
							</div>
						</motion.div>
					))}
				</AnimatePresence>
				<div ref={messagesEndRef} />
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
