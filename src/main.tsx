import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'

import { AuthProvider } from '@/components/auth-context'
import { ThemeProvider } from '@/components/theme-provider'
import { ShowError } from '@/components/errors'

import { routeTree } from './routeTree.gen'
import Routes from './routes'

import 'styles/globals.css'

const queryClient = new QueryClient()

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		auth: undefined!, // we'll make this during render
		queryClient,
	},
	defaultPreload: 'intent',
	defaultPreloadStaleTime: 300_000,
	defaultPendingComponent: Loader2,
	defaultErrorComponent: ({ error }) => (
		<ShowError show={!!error}>Error: {error?.message}</ShowError>
	),
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<Routes router={router} />
				</AuthProvider>
			</QueryClientProvider>
		</ThemeProvider>
	</StrictMode>
)
