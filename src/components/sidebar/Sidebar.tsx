"use client";

import React from 'react'
import { FaPlus } from "react-icons/fa6";
import { Button } from '../ui/button';
import { FiMoreVertical } from "react-icons/fi";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import Link from 'next/link';
import SidebarIcon from './SidebarIcon';
import QuickLinkForm from '../QuickLinkForm';
import QuickLinkActions from '../QuickLinkActions';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

const Sidebar = () => {
    const { user } = useAuth();
    const { quickLinks } = useSidebar();

    return (
        <div className='w-[300px] h-screen flex flex-col bg-dark-1 bg-opacity-80 backdrop-blur-lg'>
            <div className='w-full bg-gradient-to-r from-dark-4 to-dark-5 flex items-center justify-center px-4 py-5'>
                <h1 className='text-light-1 text-3xl font-bold'>CodeStash</h1>
            </div>
            <div className='flex flex-col flex-grow overflow-hidden'>
                <div className='px-4 py-4'>
                    <div className='text-xl text-light-1 flex justify-between items-center mb-4'>
                        <span className='font-semibold'>Quick Links</span>

                        <Dialog>
                            <DialogTrigger>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className='rounded-full hover:bg-dark-4 text-light-2 hover:text-light-1 p-2 h-auto bg-transparent cursor-pointer transition-colors duration-200'>
                                                <FaPlus className='text-xl' />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent className='bg-light-1 text-dark-0 border-none'>
                                            <span>Add a Quick Link</span>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </DialogTrigger>
                            <DialogContent className='bg-dark-3 border-none rounded-xl'>
                                <DialogHeader>
                                    <DialogTitle className='text-light-1 text-2xl font-semibold'>Create Quicklink</DialogTitle>
                                    <DialogDescription>
                                        <QuickLinkForm />
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className='flex-grow overflow-y-auto px-4'>
                    <div className='flex flex-col gap-2'>
                        {quickLinks.map((quicklink, index) => (
                            <div key={index} className='flex items-center bg-dark-3 bg-opacity-30 rounded-lg hover:bg-opacity-50 transition-all duration-200'>
                                <Link href={quicklink.url} className='grow py-2 px-3 flex gap-2 text-light-2 hover:text-light-1'>
                                    {quicklink.icon ? (
                                        <Image
                                            src={quicklink.icon}
                                            alt={quicklink.title}
                                            width={20}
                                            height={20}
                                            className="rounded"
                                        />
                                    ) : (
                                        <SidebarIcon link={quicklink.url} className='w-5 h-5' />
                                    )}
                                    <span className='text-sm'>
                                        {quicklink.title}
                                    </span>
                                </Link>
                                <div className='flex justify-end pr-2'>
                                    <Popover>
                                        <PopoverTrigger>
                                            <div className='rounded-full p-1 text-light-3 hover:text-light-1 hover:bg-dark-4 transition-colors duration-200'>
                                                <FiMoreVertical className='text-lg' />
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className='bg-dark-2 border-none w-[180px] transform translate-y-2 -translate-x-18 rounded-xl'>
                                            <QuickLinkActions
                                                title={quicklink.title}
                                                url={quicklink.url}
                                                icon={quicklink.icon}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='px-4 py-4 flex justify-between items-center bg-dark-3 bg-opacity-30 mt-auto'>
                <span className='text-xl text-light-1 font-semibold'>{user?.displayName || user?.email?.split("@")[0]}</span>

                <Popover>
                    <PopoverTrigger>
                        <div className='rounded-full p-2 text-light-3 hover:text-light-1 hover:bg-dark-4 transition-colors duration-200'>
                            <FiMoreVertical className='text-xl' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='bg-dark-2 border-none w-[200px] transform -translate-y-3 -translate-x-18 rounded-xl'>
                        <div className='flex flex-col gap-2'>
                            <Button className='text-dark-0 bg-light-2 hover:bg-light-3 transition-colors duration-200'>
                                <Link href='/settings' className='h-full w-full flex justify-center items-center'>Settings</Link>
                            </Button>
                            <Button className='text-light-1 bg-red-600 hover:bg-red-700 transition-colors duration-200'>Logout</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default Sidebar