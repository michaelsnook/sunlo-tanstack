import { cn } from '../lib/utils'

const Loading = ({ className = '' }) => (
  <div
    className={cn(
      'my-10 flex w-full justify-center place-self-center mx-auto',
      className
    )}
  >
    <progress className="progress w-56"></progress>
  </div>
)

export default Loading
