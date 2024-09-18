import { useState } from 'react'
import { Ellipsis } from 'lucide-react'
import {
  AlertDialog,
  // AlertDialogAction,
  // AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'components/ui/alert-dialog'
import { Button } from 'components/ui/button'

interface ModalWithOpenerProps {
  opener?: string
  title: string
  description: string
  onClose?: () => void
  children: React.ReactNode
}

export default function ModalWithOpener({
  opener,
  title,
  description = '',
  onClose,
  children,
}: ModalWithOpenerProps) {
  const [open, setOpen] = useState(false)

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen && onClose) {
      onClose()
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        {opener ?
          <Button variant="default">{opener}</Button>
        : <Button variant="default" size="icon">
            <Ellipsis className="h-4 w-4" />
            <span className="sr-only">Show more</span>
          </Button>
        }
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
          {children}
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
