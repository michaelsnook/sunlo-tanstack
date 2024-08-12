import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: () => (
    <div className="mx-auto mt-[10cqh] w-full max-w-md">
      <Outlet />
    </div>
  ),
})
