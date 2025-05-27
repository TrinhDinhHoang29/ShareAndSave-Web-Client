import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'

import LayoutDefault from '@/components/layout'
// Lazy load các components
const Home = lazy(() => import('@/pages/_authenticated/home'))
const SendItem = lazy(() => import('@/pages/_authenticated/send-item'))

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
	return <Suspense fallback={<div>Loading</div>}>{children}</Suspense>
}

export const routes: RouteObject[] = [
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
				path: 'gui-do-cu',
				element: <SendItem />
			}
		]
	}
]
