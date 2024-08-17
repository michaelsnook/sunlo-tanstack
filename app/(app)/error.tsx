import ShowError from 'components/show-error'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="card-white space-y-6">
      <h2 className="text-2xl">⚠️ Something went wrong... 😵‍💫</h2>
      <ShowError>{error.message}</ShowError>
      <button
        className="btn btn-primary btn-lg"
        type="button"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  )
}
