import { createFileRoute } from '@tanstack/react-router'
import LoginForm from './-login-form'

export const Route = createFileRoute('/_auth/login')({
  component: LoginForm,
})
