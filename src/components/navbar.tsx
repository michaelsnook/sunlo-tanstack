import { useState } from 'react'
import { ChevronLeft, MoreVertical } from 'lucide-react'
import { Button } from 'components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import { useNavigate } from '@tanstack/react-router'

interface NavbarProps {
  title: string
  onBackClick?: () => void
}

export default function Navbar({ title, onBackClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  onBackClick ??= () => {
    console.log(`Go back, maybe?`)
    navigate({ to: '..' })
  }
  return (
    <nav className="flex items-center justify-between px-4 py-3">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onBackClick}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-6 w-6" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem>Lessons</DropdownMenuItem>
          <DropdownMenuItem>Vocabulary</DropdownMenuItem>
          <DropdownMenuItem>Practice</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  )
}
