'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useStash } from '@/context/StashContext'
import { PlusCircle, Code, FileText, Clock, Tag, Trash2, Pin } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'

export default function StashGrid() {
    const router = useRouter()
    const { stashes, createStash, readStashes, deleteStash } = useStash()
    const { user, username } = useAuth()

    useEffect(() => {
        if (user && user.email) {
            readStashes(user.email)
        }
    }, [user, readStashes])

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

    const handlePinStash = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        // Pin functionality to be implemented later
        console.log('Pin functionality not yet implemented')
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {/* New Stash Card */}
            <div
                className="bg-dark-3 border border-dark-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={handleCreateNewStash}
            >
                <div className="flex flex-col items-center justify-center h-full p-8">
                    <PlusCircle className="w-16 h-16 text-light-3 mb-4" />
                    <p className="text-light-2 text-lg font-semibold">Create New Stash</p>
                </div>
            </div>

            {/* Stash Cards */}
            {stashes.map((stash) => (
                <div
                    key={stash.id}
                    className="relative group"
                >
                    <Link
                        href={`/${username}/${stash.id}`}
                        className="block"
                    >
                        <Card
                            className="bg-dark-3 border border-dark-4 shadow-lg transition-all duration-300 h-full"
                        >
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-light-1">{stash.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-light-3 mb-4 line-clamp-2">{stash.desc}</p>
                                <div className="flex items-center text-sm text-light-4 mb-4">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {new Date(stash.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {stash.tags.map((tag, index) => (
                                        <span key={index} className="bg-dark-5 text-light-2 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center">
                                            <Tag className="w-3 h-3 mr-1" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex justify-between text-sm text-light-3">
                                    <div className="flex items-center">
                                        <Code className="w-4 h-4 mr-2" />
                                        {stash.stashSections.filter(section => section.type === 'code').length} code snippets
                                    </div>
                                    <div className="flex items-center">
                                        <FileText className="w-4 h-4 mr-2" />
                                        {stash.stashSections.filter(section => section.type === 'text').length} notes
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                    <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Button
                            className="bg-dark-5 hover:bg-dark-4 text-light-1 p-2 rounded-md shadow-lg"
                            onClick={handlePinStash}
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
            ))}
        </div>
    )
}