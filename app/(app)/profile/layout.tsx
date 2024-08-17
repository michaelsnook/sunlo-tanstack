import AvatarSection from './avatar-section'

export default function Layout({ children }) {
  return (
    <div className="w-app flex flex-col gap-4">
      <AvatarSection />
      {children}
    </div>
  )
}
