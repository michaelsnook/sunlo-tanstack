# README for Data handling

1. We're using the supabase-JS client for everything, client and server/edge alike.
1. Authenticated operations (reading from `user_card`, `user_deck` or `user_profile`) are all client side; we haven't set up the middleware to do authenticated server-side data fetching and rendering.
1. Fetcher functions that are used by both client and server get their own functions in fetchers.js. Postgres RLS is used everywhere so you can write these functions optimistically for authenticated users and they will just not return any rows for protected tables unless the request is properly authenticated.
1. Fetcher functions must always shape the data into something useful, and these return types should use types defined in `types/main.ts`.
1. Supabase-generated types are imported into `main.ts` and either modified or re-exported as-is with more user friendly names.
1. Hooks - client-side hooks that wrap `useQuery` from @tanstack/query.
1. We're hosting the data needs as far up the chain as we can and using `queryClient.prefetchQuery` to unpack a whole deck or language into its component parts and then we use the useQuery select option per [this excellent explanation from TkDodo](https://tkdodo.eu/blog/react-query-render-optimizations).
1. Consequently, we are no longer doing separate cache keys for each phrase and card, we just have phrases or cards, and they're map-able objects so `cards[pid]` returns your card. So we actually access the data-store in localStorage with hooks like:

- useDeckLoaded(lang)
- useDeckMeta(lang)
- useDeckPids(lang)
- useDeckCards(lang)
- useCard(lang, pid)

1. Then use uptimistic updates and stuff the data back in where it goes, or just refetch the whole deck! it's not so expensive to do.
