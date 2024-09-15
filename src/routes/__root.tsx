import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import type { QueryClient } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { AuthState } from 'components/auth-context'
import Sidebar from 'components/sidebar'

interface MyRouterContext {
  auth: AuthState
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  notFoundComponent: () => {
    return (
      <div>
        <p>This is the notFoundComponent configured on root route</p>
        <Link to="/">Start Over</Link>
      </div>
    )
  },
})

function RootComponent() {
  return (
    <>
      <Sidebar />
      <div className="mx-auto w-full max-w-[1100px] px-[1%] py-1 @container">
        <Outlet />
      </div>
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
      <Toaster position="bottom-center" />
      <div id="modal-root" />
    </>
  )
}
