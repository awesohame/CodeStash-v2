'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStash } from '@/context/StashContext'
import { PlusCircle, Code, FileText, Clock, Tag, Trash2, Pin, Search, RefreshCw } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import {
    RadioGroup,
    RadioGroupItem
} from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import Masonry from 'react-masonry-css'
import { Stash } from '@/constants/types'

export default function Component() {
    const router = useRouter()
    const { stashes, createStash, readStashes, deleteStash, togglePinStash, searchStashes, searchResults, setSearchResults } = useStash()
    const { user, username } = useAuth()
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [isAdvancedSearch, setIsAdvancedSearch] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [searchIndex, setSearchIndex] = useState<'desc' | 'sections'>('desc')

    useEffect(() => {
        if (user && user.email) {
            readStashes(user.email)
            console.log('Reading stashes...')
        }
    }, []) // dont put readStashes and user in the dependency array as it will cause infinite loop

    const handleRefresh = async () => {
        if (user && user.email) {
            setIsRefreshing(true)
            await readStashes(user.email)
            setIsRefreshing(false)
            console.log('Stashes refreshed')
        }
    }

    const handleCreateNewStash = async () => {
        if (user?.email) {
            const newStash = await createStash(user.email, {
                title: 'New Stash',
                desc: '',
                tags: [],
                stashSections: []
            })

            if (newStash && newStash.id) {
                router.push(`/${username}/${newStash.id}`)
            }
        }
    }

    const handleDeleteStash = async (e: React.MouseEvent, stashId: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (user?.email && window.confirm('Are you sure you want to delete this stash?')) {
            await deleteStash(user.email, stashId)
        }
    }

    const handleTogglePinStash = async (e: React.MouseEvent, stashId: string) => {
        e.preventDefault()
        e.stopPropagation()
        if (user?.email) {
            await togglePinStash(user.email, stashId)
        }
    }

    const handleSearch = async () => {
        if (user?.email && searchQuery.trim()) {
            setIsSearching(true);
            try {
                if (isAdvancedSearch) {
                    const results = await searchStashes(searchQuery, user.email, searchIndex);

                    // If results are empty, retry once
                    if (results.length === 0) {
                        console.warn('Empty search results, retrying...');
                        const retryResults = await searchStashes(searchQuery, user.email, searchIndex);
                        setSearchResults(retryResults);
                    } else {
                        setSearchResults(results);
                    }
                } else {
                    const results = stashes.filter(stash =>
                        stash.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        stash.desc.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                    setSearchResults(results);
                }
            } catch (error) {
                console.error('Error searching stashes:', error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleViewAllStashes = () => {
        setSearchResults([])
        setSearchQuery('')
    }

    const pinnedStashes = stashes.filter(stash => stash.isPinned)
    const normalStashes = stashes.filter(stash => !stash.isPinned)

    const breakpointColumnsObj = {
        default: 3,
        1100: 2,
        700: 1
    }

    const renderStashCard = (stash: Stash) => (
        <div key={stash.id} className="mb-6 w-full relative group">
            <Link href={`/${username}/${stash.id}`} className="block">
                <Card
                    className={`bg-dark-3 border ${stash.isPinned ? 'border-yellow-500' : 'border-dark-4'} shadow-lg transition-all duration-300 h-full`}
                >
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-light-1 flex items-center">
                            {stash.isPinned && <Pin className="w-4 h-4 mr-2 text-yellow-500" />}
                            {stash.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-light-3 mb-4 line-clamp-2">{stash.desc}</p>
                        <div className="flex items-center text-sm text-light-4 mb-4">
                            <Clock className="w-4 h-4 mr-2" />
                            {new Date(stash.updatedAt || stash.createdAt).toLocaleDateString()}
                        </div>
                        {stash.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {stash.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <span key={index} className="bg-dark-5 text-light-2 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </span>
                                ))}
                                {stash.tags.length > 3 && (
                                    <span className="bg-dark-5 text-light-2 text-xs font-semibold px-2.5 py-1 rounded-full">
                                        +{stash.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-light-3">
                            <div className="flex items-center">
                                <Code className="w-4 h-4 mr-2" />
                                {stash.stashSections.filter((section: any) => section.type === 'code').length} code snippets
                            </div>
                            <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                {stash.stashSections.filter((section: any) => section.type === 'text').length} notes
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                    className={`${stash.isPinned ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-dark-5 hover:bg-dark-4'} text-light-1 p-2 rounded-md shadow-lg`}
                    onClick={(e) => handleTogglePinStash(e, stash.id as string)}
                >
                    <Pin className="w-4 h-4" />
                </Button>
                <Button
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-md shadow-lg"
                    onClick={(e) => handleDeleteStash(e, stash.id as string)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex-grow flex items-center gap-2">
                    <Input
                        type="text"
                        placeholder="Search stashes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow bg-dark-2 border-dark-4 text-light-1 placeholder-light-4"
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-dark-4 hover:bg-dark-5 text-light-1"
                    >
                        {isSearching ? 'Searching...' : <Search className="w-4 h-4" />}
                    </Button>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center space-x-2">
                        <span className="text-light-2 text-sm">Advanced</span>
                        <Switch
                            checked={isAdvancedSearch}
                            onCheckedChange={setIsAdvancedSearch}
                            className="data-[state=checked]:bg-dark-5 data-[state=unchecked]:bg-dark-3"
                        >
                            <span className="sr-only">Advanced search</span>
                            <span
                                className={`${isAdvancedSearch ? 'translate-x-5' : 'translate-x-0'
                                    } inline-block h-4 w-4 transform rounded-full bg-light-1 transition`}
                            />
                        </Switch>
                    </div>
                    {searchResults.length > 0 && (
                        <Button
                            onClick={handleViewAllStashes}
                            className="bg-dark-4 hover:bg-dark-5 text-light-1"
                        >
                            View All
                        </Button>
                    )}
                </div>

                {isAdvancedSearch && (
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="advanced-options"
                        className="w-full"
                    >
                        <AccordionItem value="advanced-options" className="border-none">
                            <AccordionTrigger className="text-light-2 hover:no-underline">
                                Advanced Search Options
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="bg-dark-3 bg-opacity-50 p-6 rounded-xl border border-dark-4 shadow-lg backdrop-blur-sm">
                                    <div className="space-y-5">
                                        <Label className="text-light-1 text-lg font-semibold mb-3 block">Search In</Label>
                                        <RadioGroup
                                            defaultValue="desc"
                                            onValueChange={(value: 'desc' | 'sections') => setSearchIndex(value)}
                                            className="space-y-3"
                                        >
                                            <div className="flex items-center space-x-3 transition-all duration-200 hover:bg-dark-4 hover:bg-opacity-30 p-2 rounded-lg cursor-pointer group">
                                                <RadioGroupItem
                                                    value="desc"
                                                    id="desc"
                                                    className="border-light-3 text-light-1 focus:border-light-1"
                                                />
                                                <Label
                                                    htmlFor="desc"
                                                    className="text-light-2 group-hover:text-light-1 transition-colors duration-200 cursor-pointer"
                                                >
                                                    Description
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-3 transition-all duration-200 hover:bg-dark-4 hover:bg-opacity-30 p-2 rounded-lg cursor-pointer group">
                                                <RadioGroupItem
                                                    value="sections"
                                                    id="sections"
                                                    className="border-light-3 text-light-1 focus:border-light-1"
                                                />
                                                <Label
                                                    htmlFor="sections"
                                                    className="text-light-2 group-hover:text-light-1 transition-colors duration-200 cursor-pointer"
                                                >
                                                    Stash Contents
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </div>

            {
                searchResults.length > 0 ? (
                    <div>
                        <h2 className="text-2xl font-bold text-light-1 mb-4">Search Results</h2>
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="flex w-auto -ml-6"
                            columnClassName="pl-6 bg-clip-padding"
                        >
                            <div
                                className="bg-dark-3 border border-dark-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer mb-6 w-full h-[200px]"
                                onClick={handleCreateNewStash}
                            >
                                <div className="flex flex-col items-center justify-center h-full p-8">
                                    <PlusCircle className="w-16 h-16 text-light-3 mb-4" />
                                    <p className="text-light-2 text-lg font-semibold">Create New Stash</p>
                                </div>
                            </div>
                            {searchResults.map(renderStashCard)}
                        </Masonry>
                    </div>
                ) : (
                    <>
                        {pinnedStashes.length > 0 && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-light-1">Pinned Stashes</h2>
                                    <Button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="bg-dark-4 hover:bg-dark-5 text-light-1"
                                    >
                                        {isRefreshing ? 'Refreshing...' : <RefreshCw className="w-4 h-4" />}
                                    </Button>
                                </div>
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="flex w-auto -ml-6"
                                    columnClassName="pl-6 bg-clip-padding"
                                >
                                    {pinnedStashes.map(renderStashCard)}
                                </Masonry>
                            </div>
                        )}

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-light-1">All Stashes</h2>
                                {!pinnedStashes.length && (
                                    <Button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="bg-dark-4 hover:bg-dark-5 text-light-1"
                                    >
                                        {isRefreshing ? 'Refreshing...' : <RefreshCw className="w-4 h-4" />}
                                    </Button>
                                )}
                            </div>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="flex w-auto -ml-6"
                                columnClassName="pl-6 bg-clip-padding"
                            >
                                <div
                                    className="bg-dark-3 border border-dark-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer mb-6 w-full h-[200px]"
                                    onClick={handleCreateNewStash}
                                >
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <PlusCircle className="w-16 h-16 text-light-3 mb-4" />
                                        <p className="text-light-2 text-lg font-semibold">Create New Stash</p>
                                    </div>
                                </div>
                                {normalStashes.map(renderStashCard)}
                            </Masonry>
                        </div>
                    </>
                )
            }
        </div >
    )
}