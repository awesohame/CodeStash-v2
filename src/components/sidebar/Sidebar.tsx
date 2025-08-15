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
        <div className='w-full h-screen flex flex-col bg-gradient-to-br from-dark-0/95 via-dark-1/90 to-dark-2/85 backdrop-blur-xl border-r border-dark-3/30'>
            <div className='w-full bg-gradient-to-r from-dark-1/80 to-dark-2/60 backdrop-blur-xl flex items-center justify-between px-6 py-5 border-b border-dark-3/30'>
                <h1 className='text-light-1 text-3xl font-bold'>CodeStash</h1>
                <Button
                    onClick={onCloseSidebar}
                    className="md:hidden bg-dark-2/80 text-light-1 hover:bg-dark-3/80 border border-dark-3/40 backdrop-blur-sm transition-all duration-300"
                >
                    <X size={24} />
                </Button>
            </div>
            <div className='flex flex-col flex-grow overflow-hidden'>
                <div className='px-6 py-6'>
                    <div className='text-xl text-light-1 flex justify-between items-center mb-6'>
                        <span className='font-semibold text-light-1'>Quick Links</span>
                        <div className='flex items-center'>
                            {!isReorderMode ? (
                                <>
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={handleRefresh}
                                                    disabled={isRefreshing}
                                                    className='mr-2 rounded-full hover:bg-dark-2/60 hover:backdrop-blur-sm text-light-3 hover:text-theme-primary p-2 h-auto bg-transparent cursor-pointer transition-all duration-300 border border-transparent hover:border-dark-3/40'
                                                >
                                                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className='bg-dark-2/90 backdrop-blur-xl text-light-1 border border-dark-3/40 shadow-xl'>
                                                <span>Refresh Quick Links</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={handleStartReordering}
                                                    className='mr-2 rounded-full hover:bg-dark-2/60 hover:backdrop-blur-sm text-light-3 hover:text-theme-primary p-2 h-auto bg-transparent cursor-pointer transition-all duration-300 border border-transparent hover:border-dark-3/40'
                                                >
                                                    <GripVertical className='w-5 h-5' />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent className='bg-dark-2/90 backdrop-blur-xl text-light-1 border border-dark-3/40 shadow-xl'>
                                                <span>Reorder Quick Links</span>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>

                                    <Dialog>
                                        <DialogTrigger>
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className='rounded-full hover:bg-dark-2/60 hover:backdrop-blur-sm text-light-3 hover:text-theme-primary p-2 h-auto bg-transparent cursor-pointer transition-all duration-300 border border-transparent hover:border-dark-3/40'>
                                                            <FaPlus className='text-lg' />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent className='bg-dark-2/90 backdrop-blur-xl text-light-1 border border-dark-3/40 shadow-xl'>
                                                        <span>Add a Quick Link</span>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </DialogTrigger>
                                        <DialogContent className='bg-dark-1/95 backdrop-blur-xl border border-dark-3/40 rounded-2xl shadow-2xl'>
                                            <DialogHeader>
                                                <DialogTitle className='text-light-1 text-2xl font-semibold'>Create Quicklink</DialogTitle>
                                                <DialogDescription className='text-light-3'>
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
                                        className='mr-2 rounded-full hover:bg-theme-success/20 text-theme-success hover:text-theme-success p-2 h-auto bg-transparent cursor-pointer transition-all duration-300 border border-transparent hover:border-theme-success/40'
                                    >
                                        <Check className="w-5 h-5" />
                                    </Button>
                                    <Button
                                        onClick={handleCancelReordering}
                                        className='rounded-full hover:bg-theme-error/20 text-theme-error hover:text-theme-error p-2 h-auto bg-transparent cursor-pointer transition-all duration-300 border border-transparent hover:border-theme-error/40'
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className='flex-grow overflow-y-auto px-6'>
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
                                                        bg-dark-2/40 backdrop-blur-sm
                                                        rounded-xl border border-dark-3/30
                                                        hover:bg-dark-2/60 hover:border-theme-primary/40
                                                        transition-all 
                                                        duration-300
                                                        ${snapshot.isDragging ? 'shadow-2xl shadow-theme-primary/20 scale-105' : 'hover:scale-[1.02]'}
                                                    `}
                                                >
                                                    <Link
                                                        href={quicklink.url}
                                                        target="_blank" rel="noopener noreferrer"
                                                        className='grow py-3 px-4 flex gap-3 text-light-3 hover:text-light-1 transition-colors duration-300'
                                                    >
                                                        {/* {quicklink.icon ? (
                                                            <Image
                                                                src={quicklink.icon}
                                                                alt={quicklink.title}
                                                                width={20}
                                                                height={20}
                                                                className="rounded-md"
                                                            />
                                                        ) : ( */}
                                                        {/* <SidebarIcon link={quicklink.url} className='w-5 h-5 text-theme-primary/80' /> */}
                                                        {/* )} */}
                                                        <span className='text-sm font-medium'>
                                                            {quicklink.title}
                                                        </span>
                                                    </Link>
                                                    {!isReorderMode && (
                                                        <div className='flex justify-end pr-3'>
                                                            <Popover>
                                                                <PopoverTrigger>
                                                                    <div className='rounded-full p-2 text-light-4 hover:text-light-1 hover:bg-dark-3/60 transition-all duration-300'>
                                                                        <FiMoreVertical className='text-lg' />
                                                                    </div>
                                                                </PopoverTrigger>
                                                                <PopoverContent className='bg-dark-1/95 backdrop-blur-xl border border-dark-3/40 transform -translate-y-1 -translate-x-18 rounded-xl w-auto p-2 shadow-2xl'>
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
                                                            className='p-3 cursor-move flex justify-end'
                                                        >
                                                            <GripVertical className='text-light-4 hover:text-theme-primary w-5 h-5 transition-colors duration-300' />
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

            <div className='px-6 py-6 flex justify-between items-center bg-dark-2/40 backdrop-blur-sm mt-auto border-t border-dark-3/30'>
                <span className='text-xl text-light-1 font-semibold'>{user?.displayName || user?.email?.split("@")[0]}</span>

                <Popover>
                    <PopoverTrigger>
                        <div className='rounded-full p-2 text-light-4 hover:text-light-1 hover:bg-dark-3/60 backdrop-blur-sm transition-all duration-300 border border-transparent hover:border-dark-3/40'>
                            <FiMoreVertical className='text-xl' />
                        </div>
                    </PopoverTrigger>
                    <PopoverContent className='bg-dark-1/95 backdrop-blur-xl border border-dark-3/40 w-auto transform -translate-y-3 -translate-x-18 rounded-xl shadow-2xl'>
                        <div className='flex flex-col gap-2'>
                            <Button className='text-dark-0 bg-theme-primary hover:bg-theme-primary/80 transition-all duration-300 font-medium'>
                                <Link href='/settings' className='h-full w-full flex justify-center items-center'>Settings</Link>
                            </Button>
                            <Button className='text-white bg-theme-error hover:bg-theme-error/80 transition-all duration-300 font-medium'>Logout</Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default Sidebar
