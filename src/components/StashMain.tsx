'use client'

import React, { useState, useEffect } from 'react'
import { useStash } from '@/context/StashContext'
import { useAuth } from '@/context/AuthContext'
import CodeMirror from '@uiw/react-codemirror';
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PencilIcon, TrashIcon, ClockIcon, ArrowLeftIcon, SaveIcon, XIcon, PlusIcon, CodeIcon, TextIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Stash, StashSection } from '@/constants/types'

export default function StashMain() {
    const { stashId } = useParams()
    const { stashes, updateStash, deleteStash, readStashes } = useStash()
    const { user, username } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)
    const [editedStash, setEditedStash] = useState<Stash | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentStash, setCurrentStash] = useState<Stash | null>(null)

    // Fetch stashes when component mounts
    useEffect(() => {
        const fetchStashes = async () => {
            if (user?.email) {
                await readStashes(user.email)
                setIsLoading(false)
            }
        }
        fetchStashes()
    }, [user])

    // Update current stash when stashId[0] or stashes change
    useEffect(() => {
        if (!isLoading && stashes.length > 0) {
            const foundStash = stashes.find(stash => stash.id === stashId[0])
            setCurrentStash(foundStash || null)
            console.log('stashes:', stashes)
            console.log('Current Stash:', foundStash)
        }
    }, [stashes])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!user || !user.email) {
        return <div className="flex justify-center items-center h-full">Please log in to view stashes.</div>
    }

    if (!currentStash) {
        return (
            <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xl mb-4">Stash not found</p>
                <Link href="/dashboard" className="text-blue-500 hover:underline">
                    Return to Dashboard
                </Link>
            </div>
        )
    }

    const handleEdit = () => {
        setIsEditing(true)
        setEditedStash({ ...currentStash })
    }

    const handleSave = async () => {
        if (editedStash && user.email) {
            try {
                await updateStash(user.email, stashId[0] as string, editedStash)
                setIsEditing(false)
                await readStashes(user?.email) // Refresh stashes after update
            } catch (error) {
                console.error('Error updating stash:', error)
            }
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedStash(currentStash)
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this stash?') && user.email) {
            try {
                await deleteStash(user.email, stashId[0] as string)
                router.push(`/${username}`)
            } catch (error) {
                console.error('Error deleting stash:', error)
            }
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditedStash(prev => prev ? ({ ...prev, [name]: value }) : null)
    }

    const handleSectionChange = (index: number, content: string) => {
        setEditedStash(prev => {
            if (!prev) return null
            const newSections = [...prev.stashSections]
            newSections[index] = { ...newSections[index], content }
            return { ...prev, stashSections: newSections }
        })
    }

    const addSection = (type: 'text' | 'code') => {
        setEditedStash(prev => {
            if (!prev) return null
            const newSection: StashSection = { type, content: '' }
            return { ...prev, stashSections: [...prev.stashSections, newSection] }
        })
    }

    const removeSection = (index: number) => {
        setEditedStash(prev => {
            if (!prev) return null
            const newSections = prev.stashSections.filter((_, i) => i !== index)
            return { ...prev, stashSections: newSections }
        })
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link href="/dashboard" className="flex items-center text-blue-500 hover:underline mb-4">
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back to Dashboard
            </Link>
            <div className="mb-6">
                {isEditing ? (
                    <Input
                        name="title"
                        value={editedStash?.title || ''}
                        onChange={handleInputChange}
                        className="text-3xl font-bold mb-2"
                    />
                ) : (
                    <h1 className="text-3xl font-bold mb-2">{currentStash.title}</h1>
                )}
                {isEditing ? (
                    <Textarea
                        name="desc"
                        value={editedStash?.desc || ''}
                        onChange={handleInputChange}
                        className="mb-4"
                    />
                ) : (
                    <p className="text-gray-400 mb-4">{currentStash.desc}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                    {currentStash.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                </div>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>Created: {new Date(currentStash.createdAt).toLocaleString()}</span>
                    <span className="mx-2">|</span>
                    <span>Updated: {new Date(currentStash.updatedAt as string).toLocaleString()}</span>
                </div>
                <div className="flex gap-4">
                    {isEditing ? (
                        <>
                            <Button onClick={handleSave} className="flex items-center">
                                <SaveIcon className="w-4 h-4 mr-2" />
                                Save
                            </Button>
                            <Button onClick={handleCancel} variant="secondary" className="flex items-center">
                                <XIcon className="w-4 h-4 mr-2" />
                                Cancel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleEdit} className="flex items-center">
                                <PencilIcon className="w-4 h-4 mr-2" />
                                Edit
                            </Button>
                            <Button onClick={handleDelete} variant="destructive" className="flex items-center">
                                <TrashIcon className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </>
                    )}
                </div>
            </div>
            <div className="space-y-6">
                {(isEditing && (editedStash) ? editedStash?.stashSections : currentStash.stashSections).map((section, index) => (
                    <div key={index} className="bg-dark-4 rounded-lg p-4">
                        {section.type === 'text' ? (
                            isEditing ? (
                                <Textarea
                                    value={section.content}
                                    onChange={(e) => handleSectionChange(index, e.target.value)}
                                    className="w-full min-h-[100px]"
                                />
                            ) : (
                                <div className="prose prose-invert">{section.content}</div>
                            )
                        ) : (
                            <CodeMirror
                                value={section.content}
                                editable={isEditing}
                            />
                        )}
                        {isEditing && (
                            <Button onClick={() => removeSection(index)} variant="destructive" className="mt-2">
                                Remove Section
                            </Button>
                        )}
                    </div>
                ))}
            </div>
            {isEditing && (
                <div className="mt-4 flex gap-2">
                    <Button onClick={() => addSection('text')} className="flex items-center">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        <TextIcon className="w-4 h-4 mr-2" />
                        Add Text Section
                    </Button>
                    <Button onClick={() => addSection('code')} className="flex items-center">
                        <PlusIcon className="w-4 h-4 mr-2" />
                        <CodeIcon className="w-4 h-4 mr-2" />
                        Add Code Section
                    </Button>
                </div>
            )}
        </div>
    )
}
