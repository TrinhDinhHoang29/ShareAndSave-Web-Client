import { lazy, Suspense } from 'react'
import { RouteObject } from 'react-router-dom'

import LayoutDefault from '@/components/layout'
import LoadingSpinner from '@/components/ui/loading-spinner'
import { ProtectedRoute } from '@/pages/_authenticated/_protected.route'

// Lazy load các components
const Home = lazy(() => import('@/pages/_authenticated/home'))

// Error Boundary Component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
	return <Suspense fallback={<LoadingSpinner />}>{children}</Suspense>
}

export const routes: RouteObject[] = [
	{
		path: '/',
		element: <LayoutDefault />,
		children: [
			{
				index: true,
				element: (
					<ProtectedRoute>
						<ErrorBoundary>
							<Home />
						</ErrorBoundary>
					</ProtectedRoute>
				)
			}
		]
	}
]
