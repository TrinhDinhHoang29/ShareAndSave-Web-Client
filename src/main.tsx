import '@/index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from '@/App'
import { FontProvider } from '@/context/font-context'
import { ThemeProvider } from '@/context/theme-context'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false
		}
	}
})

ReactDOM.createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				defaultTheme='light'
				storageKey='vite-ui-theme'
			>
				<FontProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</FontProvider>
			</ThemeProvider>
		</QueryClientProvider>
	</StrictMode>
)
