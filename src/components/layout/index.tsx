import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

import { useChatNotification } from '@/context/chat-noti-context'

import Navbar from './partials/Navbar'
import Sidebar from './partials/Sidebar'

function LayoutDefault() {
	const { followedByNotifications, followingNotifications } =
		useChatNotification()

	useEffect(() => {
		// joinNotiRoom(); // Tham gia room khi component mount

		// Xử lý thông báo nhận được
		const handleNotifications = () => {
			//   notifications.forEach((noti) => {
			//     if (noti.event === 'send_message_response') {
			//       console.log(`[🔔] New message from user ${noti.data.userID}`);
			//     } else if (noti.event === 'join_noti_room_response') {
			//       console.log(`[🔔] Joined room ${noti.data.roomID}`);
			//     }
			//   });
			console.log('followedByNotifications', followedByNotifications)
			console.log('followingNotifications', followingNotifications)
		}
		handleNotifications()
	}, [followedByNotifications, followingNotifications])
	return (
		<div className='relative min-h-screen'>
			{/* Navbar luôn trên cùng, phủ toàn bộ chiều ngang */}
			<Navbar />
			<div className='flex'>
				{/* Sidebar cố định bên trái, nằm dưới navbar */}
				<Sidebar />
				{/* Nội dung chính: margin-left để tránh bị Sidebar che, padding-top tránh bị Navbar che */}
				<main className='relative ml-64 min-h-[calc(100vh-5rem)] flex-1 p-12'>
					<Outlet />
				</main>
			</div>
		</div>
	)
}

export default LayoutDefault
