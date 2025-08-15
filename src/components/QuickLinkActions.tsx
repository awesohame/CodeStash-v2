import React from 'react'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Pencil, Trash2 } from 'lucide-react'
import EditQuicklinkForm from './EditQuicklinkForm'
import { useSidebar } from '@/context/SidebarContext'
import toast from 'react-hot-toast'

const QuickLinkActions = ({
    title,
    url,
    icon
}: {
    title: string,
    url: string,
    icon?: string
}) => {
    const { removeQuickLink } = useSidebar()

    const handleDelete = async () => {
        try {
            await removeQuickLink(url)
            toast.success('Quicklink deleted successfully')
        } catch (error) {
            console.error(error)
            toast.error('An error occurred while deleting the quicklink')
        }
    }

    return (
        <div className="flex items-center space-x-1 w-full">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-light-4 hover:text-light-1 hover:bg-dark-3/60 transition-all duration-300">
                        <Pencil className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent className='bg-dark-1/95 backdrop-blur-xl border border-dark-3/40 rounded-2xl shadow-2xl'>
                    <EditQuicklinkForm title={title} url={url} icon={icon} />
                </DialogContent>
            </Dialog>
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="text-light-4 hover:text-theme-error hover:bg-dark-3/60 transition-all duration-300"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default QuickLinkActions
