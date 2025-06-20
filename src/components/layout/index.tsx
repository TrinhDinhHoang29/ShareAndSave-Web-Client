import { Outlet } from 'react-router-dom'

import Footer from './partials/Footer'
import Navbar from './partials/Navbar'

function LayoutDefault() {
	return (
		<div className='bg-background'>
			{/* Navbar hiện đại */}
			<Navbar />
			{/* Nội dung chính */}
			<main>
				<Outlet />
			</main>
			{/* Footer */}
			<Footer />
		</div>
	)
}

export default LayoutDefault
