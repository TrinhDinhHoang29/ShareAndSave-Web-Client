import { lazy, Suspense } from 'react'
import { useRoutes } from 'react-router-dom'

import Loading from '@/components/common/Loading'
import PageTitle from '@/components/common/PageTitle'
import LayoutDefault from '@/components/layout'
import Chat from '@/pages/chat'
import Home from '@/pages/home'

import PrivateRoute from './private.route'

// Lazy load các components
const PostAction = lazy(() => import('@/pages/post-action'))
const MyPost = lazy(() => import('@/pages/profile/my-post'))
const Interest = lazy(() => import('@/pages/interest'))
const PostDetail = lazy(() => import('@/pages/post-detail'))
const Post = lazy(() => import('@/pages/post'))
const LoginSession = lazy(() => import('@/pages/login-session'))
const Dowload = lazy(() => import('@/pages/dowload'))
const EditProfile = lazy(() => import('@/pages/profile/edit-profile'))
const Leaderboard = lazy(() => import('@/pages/leader-board'))
const ItemWarehouse = lazy(() => import('@/pages/item-warehouse'))
const Appointment = lazy(() => import('@/pages/appointment'))

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
						<>
							<PageTitle title='Trang chủ' />
							<ErrorBoundary>
								<Home />
							</ErrorBoundary>
						</>
					)
				},
				{
					path: 'phien-dang-nhap',
					element: (
						<>
							<PageTitle title='Phiên đăng nhập' />
							<ErrorBoundary>
								<LoginSession />
							</ErrorBoundary>
						</>
					)
				},
				{
					path: 'bai-dang',
					children: [
						{
							path: ':slug',
							element: (
								<>
									<PageTitle title='Chi tiết bài đăng' />
									<ErrorBoundary>
										<PostDetail />
									</ErrorBoundary>
								</>
							)
						},
						{
							path: '',
							element: (
								<>
									<PageTitle title='Danh sách bài đăng' />
									<ErrorBoundary>
										<Post />
									</ErrorBoundary>
								</>
							)
						}
					]
				},
				{
					path: 'kho-do-cu',
					children: [
						{
							path: ':slug',
							element: (
								<>
									<PageTitle title='Chi tiết bài đăng' />
									<ErrorBoundary>
										<PostDetail />
									</ErrorBoundary>
								</>
							)
						},
						{
							path: '',
							element: (
								<>
									<PageTitle title='Danh sách kho đồ cũ' />
									<ErrorBoundary>
										<ItemWarehouse />
									</ErrorBoundary>
								</>
							)
						}
					]
				},
				{
					path: 'dang-bai/:type?',
					element: (
						<>
							<PageTitle title='Đăng bài' />
							<ErrorBoundary>
								<PostAction />
							</ErrorBoundary>
						</>
					)
				},
				{
					path: 'quan-tam',
					element: (
						<PrivateRoute>
							<PageTitle title='Quan tâm' />
							<ErrorBoundary>
								<Interest />
							</ErrorBoundary>
						</PrivateRoute>
					)
				},
				{
					path: 'tai-xuong',
					element: (
						<>
							<PageTitle title='Tải xuống' />
							<ErrorBoundary>
								<Dowload />
							</ErrorBoundary>
						</>
					)
				},
				{
					path: 'bang-xep-hang',
					element: (
						<>
							<PageTitle title='Bảng xếp hạng' />
							<ErrorBoundary>
								<Leaderboard />
							</ErrorBoundary>
						</>
					)
				},
				{
					path: '/chat/:interestID',
					element: (
						<PrivateRoute>
							<PageTitle title='Trò chuyện' />
							<ErrorBoundary>
								<Chat />
							</ErrorBoundary>
						</PrivateRoute>
					)
				},
				{
					path: 'ho-so',
					children: [
						{
							path: 'chinh-sua-thong-tin',
							element: (
								<PrivateRoute>
									<PageTitle title='Chỉnh sửa thông tin' />
									<ErrorBoundary>
										<EditProfile />
									</ErrorBoundary>
								</PrivateRoute>
							)
						},
						{
							path: 'doi-mat-khau',
							element: (
								<PrivateRoute>
									<PageTitle title='Đổi mật khẩu' />
									<div>Đổi mật khẩu</div>
								</PrivateRoute>
							)
						},
						{
							path: 'bai-dang-cua-toi',
							element: (
								<PrivateRoute>
									<PageTitle title='Bài đăng của tôi' />
									<ErrorBoundary>
										<MyPost />
									</ErrorBoundary>
								</PrivateRoute>
							)
						},
						{
							path: 'lich-hen',
							element: (
								<PrivateRoute>
									<PageTitle title='Lịch hẹn' />
									<ErrorBoundary>
										<Appointment />
									</ErrorBoundary>
								</PrivateRoute>
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
