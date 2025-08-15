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
                    className={`bg-gradient-to-br from-dark-1/80 to-dark-2/60 backdrop-blur-xl border ${stash.isPinned ? 'border-theme-warning/60 shadow-theme-warning/20' : 'border-dark-3/40'} shadow-xl hover:shadow-2xl transition-all duration-300 h-full hover:scale-[1.02] hover:border-theme-primary/40`}
                >
                    <CardHeader className="pb-3">
                        <CardTitle className="text-2xl xl:text-3xl font-extrabold text-light-1 flex items-center tracking-tight leading-tight">
                            {stash.isPinned && <Pin className="w-5 h-5 mr-3 text-theme-warning" />}
                            {stash.title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <p className="text-base text-light-3/90 mb-5 line-clamp-2 leading-relaxed font-medium tracking-wide">{stash.desc}</p>
                        <div className="flex items-center text-sm text-light-4/80 mb-5">
                            <Clock className="w-4 h-4 mr-2 text-theme-primary/70" />
                            <span className="font-medium tracking-wide">{new Date(stash.updatedAt || stash.createdAt).toLocaleDateString()}</span>
                        </div>
                        {stash.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {stash.tags.slice(0, 3).map((tag: string, index: number) => (
                                    <span key={index} className="bg-dark-2/60 backdrop-blur-sm border border-dark-3/30 text-light-2 text-xs font-semibold px-3 py-2 rounded-full flex items-center hover:bg-theme-primary/20 hover:border-theme-primary/40 transition-all duration-300 tracking-wide">
                                        <Tag className="w-3 h-3 mr-1.5" />
                                        {tag}
                                    </span>
                                ))}
                                {stash.tags.length > 3 && (
                                    <span className="bg-theme-primary/20 backdrop-blur-sm border border-theme-primary/30 text-light-1 text-xs font-bold px-3 py-2 rounded-full tracking-wide">
                                        +{stash.tags.length - 3}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex justify-between text-sm text-light-3 bg-dark-2/30 backdrop-blur-sm rounded-lg p-4 border border-dark-3/20">
                            <div className="flex items-center">
                                <Code className="w-4 h-4 mr-2 text-theme-success/80" />
                                <span className="font-bold text-base text-light-2">{stash.stashSections.filter((section: any) => section.type === 'code').length}</span>
                                <span className="ml-2 font-medium tracking-wide">code snippets</span>
                            </div>
                            <div className="flex items-center">
                                <FileText className="w-4 h-4 mr-2 text-theme-secondary/80" />
                                <span className="font-bold text-base text-light-2">{stash.stashSections.filter((section: any) => section.type === 'text').length}</span>
                                <span className="ml-2 font-medium tracking-wide">notes</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-4px] group-hover:translate-y-0">
                <Button
                    className={`${stash.isPinned ? 'bg-theme-warning/90 hover:bg-theme-warning shadow-theme-warning/30' : 'bg-dark-2/80 hover:bg-dark-3 border border-dark-3/50'} text-white p-2 rounded-lg shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110`}
                    onClick={(e) => handleTogglePinStash(e, stash.id as string)}
                >
                    <Pin className="w-4 h-4" />
                </Button>
                <Button
                    className="bg-theme-error/90 hover:bg-theme-error text-white p-2 rounded-lg shadow-lg backdrop-blur-sm shadow-theme-error/30 transition-all duration-300 hover:scale-110"
                    onClick={(e) => handleDeleteStash(e, stash.id as string)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-8">
                <h2 className="text-3xl xl:text-4xl font-black text-light-1 mb-2 tracking-tight">Your Code Stashes</h2>
                <p className="text-lg text-light-3/80 font-medium tracking-wide">Organize, search, and manage your code snippets</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-grow flex items-center gap-3">
                    <Input
                        type="text"
                        placeholder="Search your stashes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-grow bg-dark-1/80 backdrop-blur-sm border-dark-3/50 text-light-1 placeholder-light-4/70 focus:border-theme-primary/50 focus:ring-theme-primary/20 transition-all duration-300 text-base font-medium"
                    />
                    <Button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="bg-theme-primary/90 hover:bg-theme-primary text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm font-semibold text-base px-6"
                    >
                        {isSearching ? (
                            <span className="flex items-center gap-2">
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Searching...
                            </span>
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                    </Button>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="flex items-center space-x-4 bg-dark-1/50 backdrop-blur-sm rounded-full px-5 py-3 border border-dark-3/30">
                        <span className="text-light-2 text-base font-semibold tracking-wide">Advanced</span>
                        <Switch
                            checked={isAdvancedSearch}
                            onCheckedChange={setIsAdvancedSearch}
                            className="data-[state=checked]:bg-theme-primary data-[state=unchecked]:bg-dark-3"
                        >
                            <span className="sr-only">Advanced search</span>
                            <span
                                className={`${isAdvancedSearch ? 'translate-x-5' : 'translate-x-0'
                                    } inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300`}
                            />
                        </Switch>
                    </div>
                    {searchResults.length > 0 && (
                        <Button
                            onClick={handleViewAllStashes}
                            className="bg-dark-2/80 hover:bg-dark-3 text-light-1 border border-dark-3/50 backdrop-blur-sm transition-all duration-300 font-semibold"
                        >
                            View All Stashes
                        </Button>
                    )}
                </div>
            </div>

            <div
                className={`overflow-hidden transition-all duration-500 ease-in-out mb-10 ${isAdvancedSearch
                    ? 'max-h-96 opacity-100 translate-y-0'
                    : 'max-h-0 opacity-0 -translate-y-4'
                    }`}
            >
                <div className="pt-4">
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="advanced-options"
                        className="w-full"
                    >
                        <AccordionItem value="advanced-options" className="border-none">
                            <AccordionTrigger className="text-light-1 hover:no-underline hover:text-theme-primary transition-colors duration-300 font-bold text-xl tracking-wide">
                                Advanced Search Options
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="bg-dark-1/60 backdrop-blur-xl p-8 rounded-2xl border border-dark-3/40 shadow-2xl">
                                    <div className="space-y-6">
                                        <Label className="text-light-1 text-xl font-bold mb-4 block tracking-wide">Search Location</Label>
                                        <RadioGroup
                                            defaultValue="desc"
                                            onValueChange={(value: 'desc' | 'sections') => setSearchIndex(value)}
                                            className="space-y-4"
                                        >
                                            <div className="flex items-center space-x-4 transition-all duration-200 hover:bg-dark-2/50 hover:backdrop-blur-sm p-4 rounded-xl cursor-pointer group border border-transparent hover:border-dark-3/30">
                                                <RadioGroupItem
                                                    value="desc"
                                                    id="desc"
                                                    className="border-dark-3 text-theme-primary focus:border-theme-primary data-[state=checked]:border-theme-primary data-[state=checked]:bg-theme-primary"
                                                />
                                                <Label
                                                    htmlFor="desc"
                                                    className="text-light-2 group-hover:text-light-1 transition-colors duration-200 cursor-pointer font-semibold text-lg tracking-wide"
                                                >
                                                    Description
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-4 transition-all duration-200 hover:bg-dark-2/50 hover:backdrop-blur-sm p-4 rounded-xl cursor-pointer group border border-transparent hover:border-dark-3/30">
                                                <RadioGroupItem
                                                    value="sections"
                                                    id="sections"
                                                    className="border-dark-3 text-theme-primary focus:border-theme-primary data-[state=checked]:border-theme-primary data-[state=checked]:bg-theme-primary"
                                                />
                                                <Label
                                                    htmlFor="sections"
                                                    className="text-light-2 group-hover:text-light-1 transition-colors duration-200 cursor-pointer font-semibold text-lg tracking-wide"
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
                </div>
            </div>

            {
                searchResults.length > 0 ? (
                    <div>
                        <h2 className="text-3xl font-bold text-light-1 mb-6">Search Results</h2>
                        <Masonry
                            breakpointCols={breakpointColumnsObj}
                            className="flex w-auto -ml-6"
                            columnClassName="pl-6 bg-clip-padding"
                        >
                            <div
                                className="bg-gradient-to-br from-dark-1/60 to-dark-2/40 backdrop-blur-xl border border-dark-3/40 rounded-2xl shadow-xl hover:shadow-2xl hover:border-theme-primary/40 transition-all duration-300 cursor-pointer mb-6 w-full h-[200px] group hover:scale-[1.02]"
                                onClick={handleCreateNewStash}
                            >
                                <div className="flex flex-col items-center justify-center h-full p-8">
                                    <div className="w-20 h-20 bg-theme-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-theme-primary/30 transition-all duration-300 group-hover:scale-110">
                                        <PlusCircle className="w-10 h-10 text-theme-primary" />
                                    </div>
                                    <p className="text-light-1 text-xl font-bold tracking-tight">Create New Stash</p>
                                    <p className="text-light-3/80 text-base mt-2 font-medium tracking-wide">Start organizing your code snippets</p>
                                </div>
                            </div>
                            {searchResults.map(renderStashCard)}
                        </Masonry>
                    </div>
                ) : (
                    <>
                        {pinnedStashes.length > 0 && (
                            <div className="mb-16">
                                <div className="flex justify-between items-center mb-8">
                                    <div className='flex items-center gap-8'>
                                        <h2 className="text-4xl font-black text-light-1 tracking-tight">Pinned Stashes</h2>
                                        <p className="text-light-3/80 text-lg font-medium mt-2 tracking-wide">Your most important code collections</p>
                                    </div>
                                    <Button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="bg-dark-2/80 hover:bg-dark-3 text-light-1 border border-dark-3/50 backdrop-blur-sm transition-all duration-300 hover:border-theme-primary/40 font-semibold px-6"
                                    >
                                        {isRefreshing ? (
                                            <div className="flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Refreshing...
                                            </div>
                                        ) : (
                                            <RefreshCw className="w-5 h-5" />
                                        )}
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
                            <div className="flex justify-between items-center mb-8">
                                <div className='flex items-center gap-8'>
                                    <h2 className="text-4xl font-black text-light-1 tracking-tight">All Stashes</h2>
                                    <p className="text-light-3/80 text-lg font-medium mt-2 tracking-wide">Your complete code collection</p>
                                </div>
                                {!pinnedStashes.length && (
                                    <Button
                                        onClick={handleRefresh}
                                        disabled={isRefreshing}
                                        className="bg-dark-2/80 hover:bg-dark-3 text-light-1 border border-dark-3/50 backdrop-blur-sm transition-all duration-300 hover:border-theme-primary/40 font-semibold px-6"
                                    >
                                        {isRefreshing ? (
                                            <div className="flex items-center gap-2">
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                                Refreshing...
                                            </div>
                                        ) : (
                                            <RefreshCw className="w-5 h-5" />
                                        )}
                                    </Button>
                                )}
                            </div>
                            <Masonry
                                breakpointCols={breakpointColumnsObj}
                                className="flex w-auto -ml-6"
                                columnClassName="pl-6 bg-clip-padding"
                            >
                                <div
                                    className="bg-gradient-to-br from-dark-1/60 to-dark-2/40 backdrop-blur-xl border border-dark-3/40 rounded-2xl shadow-xl hover:shadow-2xl hover:border-theme-primary/40 transition-all duration-300 cursor-pointer mb-6 w-full h-[200px] group hover:scale-[1.02]"
                                    onClick={handleCreateNewStash}
                                >
                                    <div className="flex flex-col items-center justify-center h-full p-8">
                                        <div className="w-20 h-20 bg-theme-primary/20 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-theme-primary/30 transition-all duration-300 group-hover:scale-110">
                                            <PlusCircle className="w-10 h-10 text-theme-primary" />
                                        </div>
                                        <p className="text-light-1 text-xl font-bold tracking-tight">Create New Stash</p>
                                        <p className="text-light-3/80 text-base mt-2 font-medium tracking-wide">Start organizing your code snippets</p>
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