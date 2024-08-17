import { useQuery, useMutation } from '@tanstack/react-query'
import supabase from 'lib/supabase-client'
import { uuid, UseSBQuery, CardFull } from 'types/main'

// postNewCard
async function postInsertCard() {}

// cache it
function cacheCard(): void {}

// makeNewCard
function useInsertNewCard() {
  return useMutation({})
}

// updateCardStatus
async function postUpdateCard() {}
// updateStatus
function useUpdateCard() {
  return useMutation({})
}
