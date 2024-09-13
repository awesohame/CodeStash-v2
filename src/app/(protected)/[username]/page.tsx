import StashGrid from '@/components/StashGrid'
import React from 'react'

const Page = () => {
    return (
        <div className='flex flex-col px-8 py-6 h-full w-full flex-grow bg-gradient-to-br from-dark-0 to-dark-2'>
            <h2 className='text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-light-4 to-light-2'>
                Your Stashes
            </h2>
            <div className='flex flex-wrap h-full gap-6'>
                <StashGrid />
            </div>
        </div>
    )
}

export default Page