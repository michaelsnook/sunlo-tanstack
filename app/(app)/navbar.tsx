'use client'

// nextjs: import {
//  useRouter,
//  useSelectedLayoutSegments
// } from 'next/navigation'
// import { useState } from 'react'

export default function Navbar({ title = '', children = null }) {
  const router = useRouter()
  // const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
  // const openContextMenu = () => setIsContextMenuOpen(true)
  return (
    <div className="fixed left-0 right-0 top-0 w-full border-b border-base-100/30">
      <nav className="w-app border-bottom flex flex-row items-center justify-between p-2 text-xl">
        <a
          onClick={() => router.back()}
          className="btn btn-ghost gap-2 rounded-full"
        >
          <LeftArrow /> <span className="sr-only">Go back</span>
        </a>
        <h1 className="my-0 grow px-4 text-2xl">{title}</h1>
        {children}
      </nav>
    </div>
  )
}

/*
  <span
    className="btn btn-ghost rounded-full gap-2"
    onClick={openContextMenu}
  >
    <span className="sr-only">More options</span>
    <ContextMenuIcon />
  </span>

const ContextMenuIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
    />
  </svg>
)
*/

const LeftArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
)
