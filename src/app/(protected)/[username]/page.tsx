import StashGrid from '@/components/StashGrid'
import React from 'react'

const Page = () => {
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

