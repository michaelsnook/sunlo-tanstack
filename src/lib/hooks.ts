import supabase from './supabase-client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useContext } from 'react'
import { AuthContext } from 'components/auth-context'

// Access the context's value from inside a provider
export function useAuth() {
	const context = useContext(AuthContext)

	if (context === null) {
		throw new Error('You need to wrap AuthProvider.')
	}
	return context
}

export const useSignOut = () => {
	const navigate = useNavigate()
	const client = useQueryClient()

	return useMutation({
		mutationFn: async () => await supabase.auth.signOut(),
		onSuccess: () => {
			client.removeQueries({ queryKey: ['user'], exact: false })
			navigate({ to: '/' })
		},
	})
}
