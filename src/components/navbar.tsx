import { useCallback, useState } from 'react'
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
  title?: string
  subtitle?: string
  onBackClick?: () => void
}

export default function Navbar({ title, subtitle, onBackClick }: NavbarProps) {
  const navigate = useNavigate()
  const goBack = useCallback(() => {
    console.log(`Go back, maybe?`)
    navigate({ to: '..' })
  }, [navigate])

  onBackClick ??= goBack

  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-lg">
      <div className="flex items-center space-x-4">
        <Button variant="default" size="icon" onClick={onBackClick}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="">
          <h1 className="text-lg font-bold">{title}</h1>
          <p className="text-sm">{subtitle}</p>
        </div>
      </div>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="default" size="icon">
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
