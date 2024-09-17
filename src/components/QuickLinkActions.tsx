import React from 'react'
import { Button } from './ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"

import { MdEdit, MdDeleteForever } from "react-icons/md";
import EditQuicklinkForm from './EditQuicklinkForm';
import { useSidebar } from '@/context/SidebarContext'
import toast from 'react-hot-toast'

const QuickLinkActions = (
    {
        title,
        url,
        icon
    }: {
        title: string,
        url: string,
        icon?: string
    }
) => {
    const { removeQuickLink } = useSidebar();

    const handleDelete = async () => {
        try {
            await removeQuickLink(url);
            toast.success('Quicklink deleted successfully');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting the quicklink');
        }
    };

    return (
        <div className='flex flex-col gap-2'>
            <Dialog>
                <DialogTrigger asChild>
                    <Button className='text-light-1 bg-dark-3 hover:bg-dark-4 w-full'>
                        <div className='flex justify-center items-center gap-2'>
                            <MdEdit className='text-xl' />
                            <span>Edit</span>
                        </div>
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className='bg-dark-4 border-none rounded-xl'
                >
                    <DialogHeader>
                        <DialogTitle className='text-dark-1 text-3xl'>Edit Quicklink</DialogTitle>
                        <DialogDescription>
                            <EditQuicklinkForm title={title} url={url} icon={icon} />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
            <Button className='text-light-1 bg-red-600 hover:bg-red-700' onClick={handleDelete}>
                <div className='flex justify-center items-center gap-2'>
                    <MdDeleteForever className='text-xl' />
                    <span>Delete</span>
                </div>
            </Button>
        </div>
    )
}

export default QuickLinkActions