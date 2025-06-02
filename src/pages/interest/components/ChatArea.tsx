import { Dialog, Transition } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { Send, User, X } from 'lucide-react'
import React, { Fragment, useState } from 'react'

export const ChatArea = ({
	userName,
	postTitle,
	onClose,
	activeTab
}: {
	userName: string
	postTitle: string
	onClose: () => void
	activeTab: 'active' | 'completed'
}) => {
	const [message, setMessage] = useState('')
	const [messages, setMessages] = useState([
		{
			id: 1,
			sender: 'other',
			text: 'Xin chào, tôi quan tâm đến bài đăng của bạn.',
			time: '10:30'
		},
		{
			id: 2,
			sender: 'user',
			text: 'Chào bạn! Cảm ơn bạn đã quan tâm. Bạn cần thêm thông tin gì không?',
			time: '10:32'
		}
	])

	const handleSend = () => {
		if (message.trim()) {
			setMessages([
				...messages,
				{
					id: messages.length + 1,
					sender: 'user',
					text: message,
					time: new Date().toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			])
			setMessage('')
		}
	}

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	const headerColor = activeTab === 'active' ? 'bg-primary' : 'bg-chart-1'
	const buttonColor =
		activeTab === 'active'
			? 'bg-primary hover:bg-primary/90 focus:ring-primary'
			: 'bg-chart-1 hover:bg-chart-1/90 focus:ring-chart-1'

	return (
		<Transition
			appear
			show={true}
			as={Fragment}
		>
			<Dialog
				as='div'
				className='relative z-50'
				onClose={onClose}
			>
				{/* Backdrop */}
				<Transition.Child
					as={Fragment}
					enter='ease-out duration-200'
					enterFrom='opacity-0'
					enterTo='opacity-100'
					leave='ease-in duration-200'
					leaveFrom='opacity-100'
					leaveTo='opacity-0'
				>
					<motion.div
						className='fixed inset-0 bg-black/60 backdrop-blur-sm'
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					/>
				</Transition.Child>

				{/* Panel */}
				<div className='fixed inset-0 flex items-center justify-center p-4'>
					<Transition.Child
						as={Fragment}
						enter='ease-out duration-300'
						enterFrom='opacity-0 scale-90 translate-y-5'
						enterTo='opacity-100 scale-100 translate-y-0'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 scale-100 translate-y-0'
						leaveTo='opacity-0 scale-90 translate-y-5'
					>
						<Dialog.Panel
							as={motion.div}
							initial={{ scale: 0.9, y: 20 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 20 }}
							className='bg-card w-full max-w-lg overflow-hidden rounded-2xl shadow-2xl'
						>
							{/* Header */}
							<div className={`${headerColor} text-primary-foreground p-6`}>
								<div className='flex items-start justify-between'>
									<div className='flex items-center space-x-3'>
										<div className='bg-primary-foreground/20 flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm'>
											<User className='h-6 w-6' />
										</div>
										<div>
											<Dialog.Title
												as='h3'
												className='font-manrope text-lg font-semibold'
											>
												{userName}
											</Dialog.Title>
											<p className='text-primary-foreground/90 text-sm'>
												{postTitle}
											</p>
										</div>
									</div>
									<button
										onClick={onClose}
										className='hover:bg-primary-foreground/20 rounded-full p-2 transition-colors duration-200'
										aria-label='Đóng'
									>
										<X className='h-6 w-6' />
									</button>
								</div>
							</div>

							{/* Messages */}
							<div className='bg-muted max-h-[400px] min-h-[350px] flex-1 overflow-y-auto p-6'>
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
														? `${activeTab === 'active' ? 'bg-primary' : 'bg-chart-1'} text-primary-foreground rounded-br-md`
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
							<div className='border-border bg-card border-t p-4'>
								<div className='flex space-x-3'>
									<input
										type='text'
										value={message}
										onChange={e => setMessage(e.target.value)}
										onKeyPress={handleKeyPress}
										className='border-border focus:ring-chart-accent-1 flex-1 rounded-xl border px-4 py-3 text-sm transition-all duration-200 focus:border-transparent focus:ring-2 focus:outline-none'
										placeholder='Nhập tin nhắn...'
									/>
									<button
										onClick={handleSend}
										disabled={!message.trim()}
										className={`${buttonColor} text-primary-foreground disabled:bg-muted rounded-xl px-6 py-3 shadow-lg transition-all duration-200 hover:shadow-xl disabled:shadow-none`}
									>
										<Send className='h-5 w-5' />
									</button>
								</div>
							</div>
						</Dialog.Panel>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	)
}
