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


const QuickLinkActions = (
    {
        title,
        url
    }: {
        title: string,
        url: string
    }
) => {
    return (
        <div className='flex flex-col gap-2'>
            <Button className='text-light-1 bg-dark-3 hover:bg-dark-4'>
                <div className='flex justify-center items-center gap-2'>
                    <MdEdit className='text-xl' />
                    <Dialog>
                        <DialogTrigger>
                            <span>Edit</span>
                        </DialogTrigger>
                        <DialogContent
                            className='bg-dark-4 border-none rounded-xl'
                        >
                            <DialogHeader>
                                <DialogTitle className='text-dark-1 text-3xl'>Edit Quicklink</DialogTitle>
                                <DialogDescription>
                                    <EditQuicklinkForm title={title} url={url} />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                </div>
            </Button>
            <Button className='text-light-1 bg-red-600 hover:bg-red-700'>
                <div className='flex justify-center items-center gap-2'>
                    <MdDeleteForever className='text-xl' />
                    <span>Delete</span>
                </div>
            </Button>
        </div>
    )
}

export default QuickLinkActions