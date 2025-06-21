import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import LayoutDefault from '@/components/layout'
import Chat from '@/pages/chat'
import Home from '@/pages/home'

import PrivateRoute from './private.route'
// Lazy load các components
const PostAction = lazy(() => import('@/pages/post-action'))
const SendRequest = lazy(() => import('@/pages/profile/send-request/send'))
const Interest = lazy(() => import('@/pages/interest'))
const PostDetail = lazy(() => import('@/pages/post-detail'))
const Post = lazy(() => import('@/pages/post'))
const LoginSession = lazy(() => import('@/pages/login-session'))
const Dowload = lazy(() => import('@/pages/dowload'))
const EditProfile = lazy(() => import('@/pages/profile/edit-profile'))
const Leaderboard = lazy(() => import('@/pages/leader-board'))

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
	return (
		<Suspense
			fallback={
				<div className='flex items-center justify-center py-12'>
					<Loading
						size='lg'
						color='primary'
						text='Đang tải...'
					/>
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
					path: 'phien-dang-nhap',
					element: (
						<ErrorBoundary>
							<LoginSession />
						</ErrorBoundary>
					)
				},
				{
					path: 'bai-dang',
					children: [
						{
							path: ':slug',
							element: (
								<ErrorBoundary>
									<PostDetail />
								</ErrorBoundary>
							)
						},
						{
							path: '',
							element: (
								<ErrorBoundary>
									<Post />
								</ErrorBoundary>
							)
						}
					]
				},
				{
					path: 'dang-bai',
					element: (
						<ErrorBoundary>
							<PostAction />
						</ErrorBoundary>
					)
				},
				{
					path: 'quan-tam',
					element: (
						<PrivateRoute>
							<ErrorBoundary>
								<Interest />
							</ErrorBoundary>
						</PrivateRoute>
					)
				},
				{
					path: 'tai-xuong',
					element: (
						<ErrorBoundary>
							<Dowload />
						</ErrorBoundary>
					)
				},
				{
					path: 'bang-xep-hang',
					element: (
						<ErrorBoundary>
							<Leaderboard />
						</ErrorBoundary>
					)
				},
				{
					path: '/chat/:interestID',
					element: (
						<PrivateRoute>
							<Chat />
						</PrivateRoute>
					)
				},
				{
					path: 'ho-so',
					children: [
						{
							path: 'chinh-sua-thong-tin',
							element: (
								<ErrorBoundary>
									<EditProfile />
								</ErrorBoundary>
							)
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
