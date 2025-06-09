// ChatDialog/ChatMessagesPanel.tsx
import { AnimatePresence, motion } from 'framer-motion'
import { Send } from 'lucide-react'
import React from 'react'

interface Message {
	id: number
	sender: string
	text: string
	time: string
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
	return (
		<>
			{/* Messages */}
			<div className='bg-muted max-h-[350px] min-h-[300px] flex-1 overflow-y-auto px-6 py-4'>
				<AnimatePresence>
					{messages.map(msg => (
						<motion.div
							key={msg.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.2 }}
							className={`mb-4 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
						>
							<div
								className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${
									msg.sender === 'user'
										? `bg-primary text-primary-foreground rounded-br-md`
										: 'border-border bg-card text-foreground rounded-bl-md border'
								}`}
							>
								<p className='text-sm leading-relaxed'>{msg.text}</p>
								<p
									className={`mt-2 text-xs ${
										msg.sender === 'user'
											? 'text-primary-foreground/70'
											: 'text-muted-foreground'
									}`}
								>
									{msg.time}
								</p>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Input */}
			<div className='border-border bg-card border-t px-4 py-2'>
				<div className='flex space-x-3'>
					<input
						type='text'
						value={message}
						onChange={e => setMessage(e.target.value)}
						onKeyPress={handleKeyPress}
						className='border-border focus:ring-primary flex-1 rounded-xl border px-3 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
						placeholder='Nhập tin nhắn...'
					/>
					<button
						onClick={handleSend}
						disabled={!message.trim()}
						className={`bg-primary hover:bg-primary/90 focus:ring-primary text-primary-foreground disabled:bg-muted rounded-xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:shadow-none`}
					>
						<Send className='h-5 w-5' />
					</button>
				</div>
			</div>
		</>
	)
}
