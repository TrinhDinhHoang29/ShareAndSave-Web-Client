import { Route, Routes } from 'react-router-dom'

import LoadingSpinner from '@/components/ui/loading-spinner'
import { useAuth } from '@/context/auth-context'
import { routes } from '@/routes/index.route'

function App() {
	const { isAuthLoading } = useAuth()
	if (isAuthLoading) {
		return <LoadingSpinner />
	}
	return (
		<Routes>
			{routes.map(route => (
				<Route
					key={route.path}
					path={route.path}
					element={route.element}
				>
					{route.children?.map(child => (
						<Route
							key={child.path || 'index'}
							index={child.index}
							path={child.path}
							element={child.element}
						/>
					))}
				</Route>
			))}
		</Routes>
	)
}

export default App
