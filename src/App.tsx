import AppRouter from '@/routes/index.route'

import { AlertModalProvider } from './context/alert-modal-context'

function App() {
	return (
		<AlertModalProvider>
			<AppRouter />
		</AlertModalProvider>
	)
}

export default App
