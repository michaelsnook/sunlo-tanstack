import { useMutation } from '@tanstack/react-query'
// postReview -- always an upsert
async function postUpsertReview() {}
function cacheReview(): void {}
// anon
function useUpsertReview() {
  return useMutation({})
}
