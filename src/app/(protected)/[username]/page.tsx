'use client'

import StashGrid from '@/components/StashGrid'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter, useParams } from 'next/navigation'
import Loader from '@/components/Loader'

const Page = () => {
    const { username } = useAuth()
    const router = useRouter()
    const params = useParams()
    const urlUsername = params.username as string

    useEffect(() => {
        // Only redirect if we have a username from auth context and it doesn't match the URL
        if (username && urlUsername && username !== urlUsername) {
            console.log(`Redirecting from /${urlUsername} to /${username}`)
            router.replace(`/${username}`)
        }
    }, [username, urlUsername, router])

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
        <div className='flex flex-col min-h-screen bg-gradient-to-br from-dark-0 to-dark-2'>
            <div className='flex-grow px-4 sm:px-8 py-6'>
                <h2 className='text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-light-4 to-light-2 text-right'>
                    Your Stashes
                </h2>
                <div className='w-full'>
                    <StashGrid />
                </div>
            </div>
        </div>
    )
}

export default Page

