'use client'

import StashMain from "@/components/StashMain"
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Loader from '@/components/Loader'

const Page = () => {
    const { username } = useAuth()
    const router = useRouter()
    const params = useParams()
    const urlUsername = params.username as string
    const stashId = params.stashId as string[]

    useEffect(() => {
        // Only redirect if we have a username from auth context and it doesn't match the URL
        if (username && urlUsername && username !== urlUsername) {
            const stashPath = stashId.join('/')
            console.log(`Redirecting from /${urlUsername}/${stashPath} to /${username}/${stashPath}`)
            router.replace(`/${username}/${stashPath}`)
        }
    }, [username, urlUsername, stashId, router])

    // Show loading while username is still loading or if we're redirecting
    if (!username || (username !== urlUsername && urlUsername)) {
        return (
            <div className='flex flex-col min-h-screen bg-gradient-to-br from-dark-0 to-dark-2'>
                <div className='flex-grow flex items-center justify-center'>
                    <Loader />
                </div>
            </div>
        )
    }

    return (
        <StashMain />
    )
}

export default Page