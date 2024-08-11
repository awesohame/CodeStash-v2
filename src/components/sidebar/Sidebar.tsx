"use client";

import React, { useEffect, useState } from 'react'
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

import { db, auth } from '@/config/firebase';
import { getDoc, doc } from 'firebase/firestore';
import QuickLinkActions from '../QuickLinkActions';

const Sidebar = () => {
    const [quickLinks, setQuickLinks] = useState<{ title: string, url: string }[]>([])

    useEffect(() => {
        const fetchQuickLinks = async () => {
            // fetch quick links

            // setQuickLinks([
            //     { title: 'Google', url: 'https://google.com' },
            //     { title: 'Facebook', url: 'https://facebook.com' },
            //     { title: 'Twitter', url: 'https://twitter.com' },
            // ])

            const user = auth.currentUser;
            if (!user) {
                console.error('User not logged in');
                return;
            }
            const email = user.email;
            const quickLinkRef = doc(db, 'quickLinks', email as string);
            const quickLinkDoc = await getDoc(quickLinkRef);
            if (quickLinkDoc.exists()) {
                const quickLinksData = quickLinkDoc.data().quickLinks ?? [];
                // console.log(quickLinksData);
                setQuickLinks(quickLinksData);
            }
            else {
                console.log('No quicklinks found');
            }
        }
        fetchQuickLinks()
    }, [])

    return (
        <div className='h-screen w-[300px] flex flex-col bg-dark-0'>
            <div className='w-full bg-primary-1 flex items-center justify-center px-4 py-3'>
                <h1 className='text-light-4 text-3xl'>CodeStash</h1>
            </div>
            <div className='px-4 grow w-full bg-primary-2 mt-2'>
                <div className='text-xl text-light-2 flex justify-between items-center'>
                    <span>Quick Links</span>

                    <Dialog>
                        <DialogTrigger>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className='rounded-full hover:bg-dark-2 text-light-4 hover:text-light-1 p-2 h-auto bg-transparent cursor-pointer'>
                                            <FaPlus className='text-xl' />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent className='bg-light-1 text-dark-0 border-none'>
                                        <span>Add a Quick Link</span>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </DialogTrigger>
                        <DialogContent
                            className='bg-dark-4 border-none rounded-xl'
                        >
                            <DialogHeader>
                                <DialogTitle className='text-dark-1 text-3xl'>Create Quicklink</DialogTitle>
                                <DialogDescription>
                                    <QuickLinkForm />
                                </DialogDescription>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>



                </div>

                <div className='flex flex-col gap-2 mt-2'>
                    {quickLinks.map((quicklink, index) => (
                        <div key={index} className='flex'>
                            <Link href={quicklink.url} className='grow py-1 px-2 flex gap-2 text-light-2 hover:text-light-3 hover:underline'>
                                <SidebarIcon link={quicklink.url} className='w-6 h-6' />
                                <span>
                                    {quicklink.title}
                                </span>
                            </Link>
                            <div className='flex justify-end'>
                                <Popover>
                                    <PopoverTrigger>
                                        <div className='rounded-full p-1 text-light-4 hover:text-light-1 hover:bg-dark-2'>
                                            <FiMoreVertical className='text-xl' />
                                        </div>
                                    </PopoverTrigger>
                                    <PopoverContent className='bg-dark-2 border-none w-[180px] transform translate-y-2 -translate-x-18 rounded-xl'>
                                        <QuickLinkActions
                                            title={quicklink.title}
                                            url={quicklink.url}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='px-4 py-4 flex justify-between items-center'>
                <span className='text-xl'>Username</span>
                <Popover>
                    <PopoverTrigger>
                        <div className='rounded-full p-1 text-light-4 hover:text-light-1 hover:bg-dark-2'>
                            <FiMoreVertical className=' text-xl' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='bg-dark-2 border-none w-[200px] transform -translate-y-3 -translate-x-18 rounded-xl'>
                        <div className='flex flex-col gap-2'>
                            <Button className='text-dark-0 bg-light-4 hover:bg-dark-4 p-0'>
                                <Link href='/settings' className='h-full w-full flex justify-center items-center'>Settings</Link></Button>
                            <Button className='text-light-1 bg-red-600 hover:bg-red-700'>Logout</Button>
                        </div>
                    </PopoverContent>
                </Popover>


            </div>
        </div>
    )
}

export default Sidebar