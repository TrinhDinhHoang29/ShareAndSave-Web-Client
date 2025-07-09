// main.tsx
import '@/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from '@/App'
import { FontProvider } from '@/context/font-context'
import { ThemeProvider } from '@/context/theme-context'

import ScrollToTop from './components/common/ScrollToTop'
import { AlertModalProvider } from './context/alert-modal-context'
import { AuthDialogProvider } from './context/auth-dialog-context'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false
		}
	}
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<QueryClientProvider client={queryClient}>
		<ThemeProvider
			defaultTheme='light'
			storageKey='vite-ui-theme'
		>
			<FontProvider>
				<AlertModalProvider>
					<AuthDialogProvider>
						<BrowserRouter>
							<ScrollToTop />
							<App />
						</BrowserRouter>
					</AuthDialogProvider>
				</AlertModalProvider>
			</FontProvider>
		</ThemeProvider>
	</QueryClientProvider>
)
