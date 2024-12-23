"use client";

import React, { useState } from 'react'
import { FaPlus } from "react-icons/fa6";
import { Button } from '../ui/button';
import { FiMoreVertical } from "react-icons/fi";
import { RefreshCw, GripVertical, Check, X } from 'lucide-react';
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
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult
} from '@hello-pangea/dnd';
import Link from 'next/link';
import SidebarIcon from './SidebarIcon';
import QuickLinkForm from '../QuickLinkForm';
import QuickLinkActions from '../QuickLinkActions';
import { useSidebar } from '@/context/SidebarContext';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';

interface SidebarProps {
    onCloseSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCloseSidebar }) => {
    const { user } = useAuth();
    const { quickLinks, refreshQuickLinks, updateQuickLinks } = useSidebar();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isReorderMode, setIsReorderMode] = useState(false);
    const [reorderLinks, setReorderLinks] = useState([...quickLinks]);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refreshQuickLinks();
        setIsRefreshing(false);
    };

    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result;

        // If dropped outside the list or in the same position
        if (!destination ||
            (destination.droppableId === source.droppableId &&
                destination.index === source.index)) {
            return;
        }

        // Create a copy of the links and reorder
        const newLinks = Array.from(reorderLinks);
        const [reorderedItem] = newLinks.splice(source.index, 1);
        newLinks.splice(destination.index, 0, reorderedItem);

        setReorderLinks(newLinks);
    };

    const handleStartReordering = () => {
        setReorderLinks([...quickLinks]);
        setIsReorderMode(true);
    };

    const handleCancelReordering = () => {
        setIsReorderMode(false);
    };

    const handleSaveReordering = () => {
        updateQuickLinks(reorderLinks);
        setIsReorderMode(false);
    };

    return (
        <div className='w-full h-screen flex flex-col bg-dark-1 bg-opacity-80 backdrop-blur-lg'>
            <div className='w-full bg-gradient-to-r from-dark-4 to-dark-5 flex items-center justify-between px-4 py-5'>
                <h1 className='text-light-1 text-3xl font-bold'>CodeStash</h1>
                <Button
                    onClick={onCloseSidebar}
                    className="md:hidden bg-dark-3 text-light-1 hover:bg-dark-2"
                >
                    <X size={24} />
                </Button>
            </div>
            <div className='flex flex-col flex-grow overflow-hidden'>
                <div className='px-4 py-4'>
                    <div className='text-xl text-light-1 flex justify-between items-center mb-4'>
                        <span className='font-semibold'>Quick Links</span>
                        <div className='flex items-center'>
                            {!isReorderMode ? (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={handleRefresh}
                                                    disabled={isRefreshing}
                                                    className='mr-2 rounded-full hover:bg-dark-4 text-light-2 hover:text-light-1 p-2 h-auto bg-transparent cursor-pointer transition-colors duration-200'
                                                >
                                                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className='bg-light-1 text-dark-0 border-none'>
                                                <span>Refresh Quick Links</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={handleStartReordering}
                                                    className='mr-2 rounded-full hover:bg-dark-4 text-light-2 hover:text-light-1 p-2 h-auto bg-transparent cursor-pointer transition-colors duration-200'
                                                >
                                                    <GripVertical className='w-5 h-5' />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className='bg-light-1 text-dark-0 border-none'>
                                                <span>Reorder Quick Links</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

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
                                                <DialogDescription className='text-light-2'>
                                                    Add a new quick link to your sidebar for easy access to your favorite websites.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <QuickLinkForm />
                                        </DialogContent>
                                    </Dialog>
                                </>
                            ) : (
                                <div className='flex items-center'>
                                    <Button
                                        onClick={handleSaveReordering}
                                        className='mr-2 rounded-full hover:bg-dark-4 text-light-2 hover:text-light-1 p-2 h-auto bg-transparent cursor-pointer transition-colors duration-200'
                                    >
                                        <Check className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        onClick={handleCancelReordering}
                                        className='rounded-full hover:bg-dark-4 text-light-2 hover:text-light-1 p-2 h-auto bg-transparent cursor-pointer transition-colors duration-200'
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex-grow overflow-y-auto px-4'>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Droppable droppableId="quicklinks">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className='flex flex-col gap-2'
                                >
                                    {(isReorderMode ? reorderLinks : quickLinks).map((quicklink, index) => (
                                        <Draggable
                                            key={`${quicklink.title}-${index}`}
                                            draggableId={`${quicklink.title}-${index}`}
                                            index={index}
                                            isDragDisabled={!isReorderMode}
                                        >
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className={`
                                                        flex items-center 
                                                        bg-dark-3 bg-opacity-30 
                                                        rounded-lg 
                                                        hover:bg-opacity-50 
                                                        transition-all 
                                                        duration-200
                                                        ${snapshot.isDragging ? 'shadow-lg' : ''}
                                                    `}
                                                >
                                                    <Link
                                                        href={quicklink.url}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className='grow py-2 px-3 flex gap-2 text-light-2 hover:text-light-1'
                                                    >
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
                                                    {!isReorderMode && (
                                                        <div className='flex justify-end pr-2'>
                                                            <Popover>
                                                                <PopoverTrigger>
                                                                    <div className='rounded-full p-1 text-light-3 hover:text-light-1 hover:bg-dark-4 transition-colors duration-200'>
                                                                        <FiMoreVertical className='text-lg' />
                                                                    </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className='bg-dark-3 bg-opacity-70 backdrop-blur-lg border-none transform -translate-y-1 -translate-x-18 rounded-xl w-auto p-2'>
                                                                    <QuickLinkActions
                                                                        title={quicklink.title}
                                                                        url={quicklink.url}
                                                                        icon={quicklink.icon}
                                                                    />
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    )}
                                                    {isReorderMode && (
                                                        <div
                                                            {...provided.dragHandleProps}
                                                            className='p-2 cursor-move flex justify-end'
                                                        >
                                                            <GripVertical className='text-light-2 w-5 h-5' />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
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
                    <PopoverContent className='bg-dark-2 bg-opacity-70 backdrop-blur-lg border-none w-auto transform -translate-y-3 -translate-x-18 rounded-xl'>
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
