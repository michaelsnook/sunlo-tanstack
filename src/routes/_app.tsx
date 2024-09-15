import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_app')({
  // Before loading, authenticate the user via our auth context
  // This will also happen during prefetching (e.g. hovering over links, etc)
  beforeLoad: ({ context, location }) => {
    // If the user is logged out, redirect them to the login page
    // console.log(`beforeLoad auth context:`, context.auth)
    if (context.auth?.isAuth === false) {
      throw redirect({
        to: '/login',
        search: {
          // Use the current location to power a redirect after login
          // (Do not use `router.state.resolvedLocation` as it can
          // potentially lag behind the actual current location)
          redirect: location.href,
        },
      })
    }

    // Otherwise, return a pointer to the auth object
    return context.auth || null
  },
  component: Layout,
})

function Layout() {
  return (
    <div className="w-app">
      <Outlet />
    </div>
  )
}
