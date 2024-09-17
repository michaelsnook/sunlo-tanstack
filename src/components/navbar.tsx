import type { NavbarData } from 'types/main'
import { useCallback, useState } from 'react'
import {
  ChevronLeft,
  FolderPlus,
  MoreVertical,
  Search,
  SquarePlus,
  WalletCards,
} from 'lucide-react'
import { Button } from 'components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu'
import { Link, useNavigate } from '@tanstack/react-router'

interface NavbarProps {
  data?: NavbarData
}

export default function Navbar({ data }: NavbarProps) {
  const navigate = useNavigate()
  const goBack = useCallback(() => {
    navigate({ to: '..' })
  }, [navigate])
  const onBackClick = data?.onBackClick ?? goBack

  const [isOpen, setIsOpen] = useState(false)
  return (
    <nav className="flex items-center justify-between px-4 py-3 shadow-xl mb-4 bg-white/10">
      <div className="flex items-center space-x-4">
        <Button variant="default" size="icon" onClick={onBackClick}>
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Back</span>
        </Button>
        <div className="">
          <h1 className="text-lg font-bold">{data?.title}</h1>
          <p className="text-sm">{data?.subtitle}</p>
        </div>
      </div>

      {!(data?.contextMenu?.length > 0) ? null : (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <MoreVertical className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {data?.contextMenu.map(({ href, name, icon }, index) => (
              <DropdownMenuItem key={index}>
                <Link
                  to={href}
                  className="w-full flex flex-row gap-2 justify-content-center"
                >
                  {renderIcon(icon)}
                  {name}
                </Link>
              </DropdownMenuItem>
            )) || (
              <DropdownMenuItem disabled>No options available</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  )
}

// TODO move this to utils?
function renderIcon(icon: string) {
  switch (icon) {
    case 'folder-plus':
      return <FolderPlus size={20} />
    case 'square-plus':
      return <SquarePlus size={20} />
    case 'search':
      return <Search size={20} />
    case 'wallet-cards':
      return <WalletCards size={20} />
    default:
      return null
  }
}
