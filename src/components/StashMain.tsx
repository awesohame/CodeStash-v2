'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useStash } from '@/context/StashContext'
import { useAuth } from '@/context/AuthContext'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PencilIcon, TrashIcon, ClockIcon, ArrowLeftIcon, SaveIcon, XIcon, PlusIcon, CodeIcon, TextIcon, CopyIcon, CheckIcon } from 'lucide-react'
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
    const [currentStash, setCurrentStash] = useState<Stash | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [copiedSections, setCopiedSections] = useState<{ [key: number]: boolean }>({})
    const [newTag, setNewTag] = useState('')

    const fetchStashes = useCallback(async () => {
        if (user?.email) {
            await readStashes(user.email)
            setIsLoading(false)
        }
    }, [user])

    useEffect(() => {
        fetchStashes()
        console.log('fetching stashes')
    }, [fetchStashes])

    useEffect(() => {
        if (!isLoading && stashes.length > 0) {
            const foundStash = stashes.find(stash => stash.id === stashId[0])
            setCurrentStash(foundStash || null)
            if (!isEditing) {
                setEditedStash(foundStash ? { ...foundStash } : null)
            }
        }
        console.log('check stash edits')
    }, [stashes, stashId, isLoading, isEditing])

    const handleEdit = useCallback(() => {
        setIsEditing(true)
        setEditedStash(currentStash ? { ...currentStash } : null)
    }, [currentStash])

    const handleSave = useCallback(async () => {
        if (editedStash && user?.email) {
            try {
                await updateStash(user.email, stashId[0] as string, editedStash)
                setIsEditing(false)
                setCurrentStash(editedStash)
                console.log('fetching stashes in handleSave')
                await fetchStashes()
            } catch (error) {
                console.error('Error updating stash:', error)
            }
        }
    }, [editedStash, user?.email, stashId, updateStash])

    const handleCancel = useCallback(() => {
        setIsEditing(false)
        setEditedStash(currentStash ? { ...currentStash } : null)
    }, [currentStash])

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this stash?') && user?.email) {
            try {
                await deleteStash(user.email, stashId[0] as string)
                router.push(`/${username}`)
            } catch (error) {
                console.error('Error deleting stash:', error)
            }
        }
    }

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setEditedStash(prev => prev ? { ...prev, [name]: value } : null)
    }, [])

    const handleSectionChange = useCallback((index: number, content: string) => {
        setEditedStash(prev => {
            if (!prev) return null
            const newSections = [...prev.stashSections]
            newSections[index] = { ...newSections[index], content }
            return { ...prev, stashSections: newSections }
        })
    }, [])

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

    const handleCopyCode = (index: number, content: string) => {
        navigator.clipboard.writeText(content)
            .then(() => {
                setCopiedSections(prev => ({ ...prev, [index]: true }))
                setTimeout(() => {
                    setCopiedSections(prev => ({ ...prev, [index]: false }))
                }, 2000)
            })
            .catch((error) => console.error('Failed to copy code:', error))
    }

    const handleAddTag = useCallback(() => {
        if (newTag.trim() && editedStash && user?.email) {
            const trimmedTag = newTag.trim();
            if (!editedStash.tags.includes(trimmedTag)) {
                const updatedTags = [...editedStash.tags, trimmedTag];
                setEditedStash(prev => prev ? { ...prev, tags: updatedTags } : null);
            }
            setNewTag('');
        }
    }, [newTag, editedStash, user?.email]);

    const handleRemoveTag = useCallback((tagToRemove: string) => {
        if (editedStash) {
            const updatedTags = editedStash.tags.filter(tag => tag !== tagToRemove)
            setEditedStash(prev => prev ? { ...prev, tags: updatedTags } : null)
        }
    }, [editedStash])

    if (isLoading || !currentStash) {
        return <div className="flex justify-center items-center h-screen bg-dark-2">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-light-3"></div>
        </div>
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-dark-0 to-dark-2 text-light-1">
            <div className="container mx-auto px-4 py-8">
                <Link href={`/${username}`} className="flex items-center text-light-3 hover:text-light-1 transition-colors duration-200 mb-6">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="bg-dark-3 rounded-lg shadow-xl p-8 border border-dark-4">
                    <div className="mb-8">
                        {isEditing ? (
                            <Input
                                name="title"
                                value={editedStash?.title || ''}
                                onChange={handleInputChange}
                                className="text-3xl font-bold mb-4 bg-dark-2 text-light-1 border-dark-4 shadow-inner"
                            />
                        ) : (
                            <h1 className="text-4xl font-bold mb-4 text-light-1">{currentStash.title}</h1>
                        )}
                        {isEditing ? (
                            <Textarea
                                name="desc"
                                value={editedStash?.desc || ''}
                                onChange={handleInputChange}
                                className="mb-4 bg-dark-2 text-light-2 border-dark-4 shadow-inner"
                            />
                        ) : (
                            <p className="text-light-2 mb-4 text-lg">{currentStash.desc}</p>
                        )}
                        {isEditing ? (
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {editedStash?.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="bg-dark-5 text-light-1 shadow-md">
                                            {tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-2 text-light-3 hover:text-light-1"
                                            >
                                                <XIcon className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex">
                                    <Input
                                        value={newTag}
                                        onChange={(e) => setNewTag(e.target.value)}
                                        placeholder="Add new tag"
                                        className="mr-2 bg-dark-2 text-light-1 border-dark-4 shadow-inner"
                                    />
                                    <Button onClick={handleAddTag} className="bg-dark-5 hover:bg-dark-4 text-light-1">
                                        Add Tag
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentStash.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="bg-dark-5 text-light-1 shadow-md hover:bg-dark-4 transition-colors duration-200">{tag}</Badge>
                                ))}
                            </div>
                        )}
                        <div className="flex items-center text-sm text-light-3 mb-6">
                            <ClockIcon className="w-4 h-4 mr-2" />
                            <span>Created: {new Date(currentStash.createdAt).toLocaleString()}</span>
                            <span className="mx-2">|</span>
                            <span>Updated: {new Date(currentStash.updatedAt as string).toLocaleString()}</span>
                        </div>
                        <div className="flex gap-4">
                            {isEditing ? (
                                <>
                                    <Button onClick={handleSave} className="bg-dark-5 hover:bg-dark-4 text-light-1 shadow-md transition-all duration-200 transform hover:scale-105">
                                        <SaveIcon className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                    <Button onClick={handleCancel} variant="secondary" className="bg-dark-3 hover:bg-dark-2 text-light-2 shadow-md transition-all duration-200 transform hover:scale-105">
                                        <XIcon className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button onClick={handleEdit} className="bg-dark-5 hover:bg-dark-4 text-light-1 shadow-md transition-all duration-200 transform hover:scale-105">
                                        <PencilIcon className="w-4 h-4 mr-2" />
                                        Edit
                                    </Button>
                                    <Button onClick={handleDelete} variant="destructive" className="bg-red-600 hover:bg-red-700 text-light-1 shadow-md transition-all duration-200 transform hover:scale-105">
                                        <TrashIcon className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="space-y-8 mt-8">
                        {(isEditing && editedStash ? editedStash?.stashSections : currentStash.stashSections).map((section, index) => (
                            <div key={index} className="bg-dark-2 rounded-lg p-6 shadow-lg border border-dark-4">
                                {section.type === 'text' ? (
                                    isEditing ? (
                                        <Textarea
                                            value={section.content}
                                            onChange={(e) => handleSectionChange(index, e.target.value)}
                                            className="w-full min-h-[100px] bg-dark-1 text-light-1 border-dark-4 shadow-inner"
                                        />
                                    ) : (
                                        <div className="prose prose-invert max-w-none">{section.content}</div>
                                    )
                                ) : (
                                    <div className="relative">
                                        <CodeMirror
                                            value={section.content}
                                            height="200px"
                                            theme="dark"
                                            extensions={[javascript({ jsx: true })]}
                                            editable={isEditing}
                                            onChange={(value) => handleSectionChange(index, value)}
                                            className="border border-dark-4 rounded-md overflow-hidden shadow-inner"
                                        />
                                        {!isEditing && (
                                            <Button
                                                onClick={() => handleCopyCode(index, section.content)}
                                                className={`absolute top-2 right-2 ${copiedSections[index] ? 'bg-green-600' : 'bg-dark-5 hover:bg-dark-4'} text-light-1 shadow-md transition-all duration-200`}
                                            >
                                                {copiedSections[index] ? (
                                                    <CheckIcon className="w-4 h-4 mr-2" />
                                                ) : (
                                                    <CopyIcon className="w-4 h-4 mr-2" />
                                                )}
                                                {copiedSections[index] ? 'Copied!' : 'Copy'}
                                            </Button>
                                        )}
                                    </div>
                                )}
                                {isEditing && (
                                    <Button onClick={() => removeSection(index)} variant="destructive" className="mt-4 bg-red-600 hover:bg-red-700 text-light-1 shadow-md transition-all duration-200 transform hover:scale-105">
                                        Remove Section
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                    {isEditing && (
                        <div className="mt-8 flex gap-4">
                            <Button onClick={() => addSection('text')} className="bg-dark-5 hover:bg-dark-4 text-light-1 shadow-md transition-all duration-200 transform hover:scale-105">
                                <PlusIcon className="w-4 h-4 mr-2" />
                                <TextIcon className="w-4 h-4 mr-2" />
                                Add Text Section
                            </Button>
                            <Button onClick={() => addSection('code')} className="bg-dark-5 hover:bg-dark-4 text-light-1 shadow-md transition-all duration-200 transform hover:scale-105">
                                <PlusIcon className="w-4 h-4 mr-2" />
                                <CodeIcon className="w-4 h-4 mr-2" />
                                Add Code Section
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}