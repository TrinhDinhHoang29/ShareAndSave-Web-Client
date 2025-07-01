import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	base: '/',
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ['react', 'react-dom']
				}
			}
		},
		chunkSizeWarningLimit: 1000
	},
	optimizeDeps: {
		include: ['react', 'react-dom']
	},
	server: {
		port: 3001,
		allowedHosts: ['0.0.0.0', '0.0.0.0']
	},
	preview: {
		port: 3001,
		allowedHosts: ['0.0.0.0', '0.0.0.0']
	}
})
