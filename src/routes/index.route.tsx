import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import LayoutDefault from '@/components/layout'
// Lazy load các components
const Home = lazy(() => import('@/pages/home'))
const Post = lazy(() => import('@/pages/post'))
const SendRequest = lazy(() => import('@/pages/profile/send-request/send'))
const Interest = lazy(() => import('@/pages/interest'))
// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
	return (
		<Suspense
			fallback={
				<div className='flex h-full w-full items-center justify-center'>
					<Loading />
				</div>
			}
		>
			{children}
		</Suspense>
	)
}

function AppRouter() {
	const routes = [
		{
			path: '/',
			element: <LayoutDefault />,
			children: [
				{
					index: true,
					element: (
						<ErrorBoundary>
							<Home />
						</ErrorBoundary>
					)
				},
				{
					path: 'dang-bai',
					element: (
						<ErrorBoundary>
							<Post />
						</ErrorBoundary>
					)
				},
				{
					path: 'quan-tam',
					element: (
						<ErrorBoundary>
							<Interest />
						</ErrorBoundary>
					)
				},
				{
					path: 'ho-so',
					children: [
						{
							path: 'chinh-sua-thong-tin',
							element: <div>Thông tin cá nhân</div>
						},
						{
							path: 'doi-mat-khau',
							element: <div>Đổi mật khẩu</div>
						},
						{
							path: 'yeu-cau-da-gui',
							element: (
								<ErrorBoundary>
									<SendRequest />
								</ErrorBoundary>
							)
						}
					]
				}
			]
		}
	]
	return useRoutes(routes)
}

export default AppRouter
