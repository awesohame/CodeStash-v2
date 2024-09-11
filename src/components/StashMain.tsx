'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { useStash } from '@/context/StashContext'
import { useAuth } from '@/context/AuthContext'
import { CodeBlock, CopyBlock, dracula } from 'react-code-blocks'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PencilIcon, TrashIcon, ClockIcon, ArrowLeftIcon, SaveIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Stash } from '@/constants/types'

export default function StashMain() {
    const { stashId } = useParams()
    const { stashes, updateStash, deleteStash, readStashes } = useStash()
    const { user } = useAuth()
    const router = useRouter()
    const [isEditing, setIsEditing] = useState(false)

    const stash = useMemo(() => stashes.find(s => s.id === stashId), [stashes, stashId])
    // console.log(stashes)
    console.log(stash)
    const [editedStash, setEditedStash] = useState<Stash | null>(stash || null)

    useEffect(() => {
        if (user && user.email) {
            readStashes(user.email)
        }
    }, [user])

    useEffect(() => {
        setEditedStash(stash || null)
    }, [stash])

    if (!user || !user.email) {
        return <div className="flex justify-center items-center h-full">Please log in to view stashes.</div>
    }

    if (!stash) {
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
        setEditedStash({ ...stash })
    }

    const handleSave = async () => {
        if (editedStash && user.email) {
            await updateStash(user.email, stashId as string, editedStash)
            setIsEditing(false)
        }
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedStash(stash)
    }

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this stash?') && user.email) {
            await deleteStash(user.email, stashId as string)
            router.push('/dashboard')
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
                    <h1 className="text-3xl font-bold mb-2">{stash.title}</h1>
                )}
                {isEditing ? (
                    <Textarea
                        name="desc"
                        value={editedStash?.desc || ''}
                        onChange={handleInputChange}
                        className="mb-4"
                    />
                ) : (
                    <p className="text-gray-400 mb-4">{stash.desc}</p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                    {stash.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                </div>
                <div className="flex items-center text-sm text-gray-400 mb-4">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    <span>Created: {new Date(stash.createdAt).toLocaleString()}</span>
                    <span className="mx-2">|</span>
                    <span>Updated: {new Date(stash.updatedAt as string).toLocaleString()}</span>
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
                {(isEditing && editedStash?.stashSections ? editedStash?.stashSections : stash.stashSections).map((section, index) => (
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
                            <CopyBlock
                                text={section.content}
                                language="javascript"
                                showLineNumbers={true}
                                theme={dracula}
                                // wrapLines
                                codeBlock={isEditing}
                            // onChanged={(code) => handleSectionChange(index, code)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}