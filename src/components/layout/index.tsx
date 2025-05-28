import { Outlet } from 'react-router-dom'

import Navbar from './partials/Navbar'
import Sidebar from './partials/Sidebar'

function LayoutDefault() {
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
