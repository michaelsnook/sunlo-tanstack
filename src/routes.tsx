import { useQueryClient } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { useAuth } from 'lib/hooks'

export default function Routes({ router }) {
  const auth = useAuth()
  const queryClient = useQueryClient()
  return <RouterProvider router={router} context={{ auth, queryClient }} />
}
