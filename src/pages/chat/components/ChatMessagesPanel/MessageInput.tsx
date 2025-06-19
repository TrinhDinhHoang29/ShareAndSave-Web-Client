import { Send } from 'lucide-react'
import React from 'react'

const MessageInput = React.memo(
	({
		message,
		onMessageChange,
		onSend,
		onKeyPress
	}: {
		message: string
		onMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
		onSend: () => void
		onKeyPress: (e: React.KeyboardEvent) => void
	}) => (
		<div className='border-border bg-card border-t px-4 py-3'>
			<div className='flex space-x-3'>
				<input
					type='text'
					value={message}
					onChange={onMessageChange}
					onKeyPress={onKeyPress}
					className='border-border focus:ring-primary bg-background flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
					placeholder='Nhập tin nhắn...'
				/>
				<button
					onClick={onSend}
					disabled={!message.trim()}
					className='bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground disabled:bg-muted disabled:text-muted-foreground flex min-w-[60px] items-center justify-center rounded-xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none'
				>
					<Send className='h-5 w-5' />
				</button>
			</div>
		</div>
	)
)

export default MessageInput
