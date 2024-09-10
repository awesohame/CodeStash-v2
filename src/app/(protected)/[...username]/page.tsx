import StashCards from '@/components/StashCards'
import React from 'react'

const Page = () => {
    return (
        <div className='flex flex-col px-8 py-6 h-full w-full flex-grow'>
            <h2 className='text-3xl text-light-1 font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-light-4 to-light-2'>Your Stashes</h2>
            <div className='flex flex-wrap h-full gap-4'>
                <StashCards className='flex-grow' style={{ flex: '0 0 calc(33.333% - 16px)' }} />
            </div>
        </div>
    )
}

export default Page