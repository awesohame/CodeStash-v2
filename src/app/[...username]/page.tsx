import StashCards from '@/components/StashCards'
import React from 'react'

const page = () => {
    return (
        <div className='flex flex-col px-8 py-4 h-full w-full flex-grow'>
            <h2 className='text-2xl text-light-3 font-medium mb-4'>Your Stashes</h2>
            <div className='flex flex-wrap h-full gap-2 '>
                <StashCards className='flex-grow' style={{ flex: '0 0 calc(33.333% - 8px)' }} />
            </div>
        </div>

    )
}

export default page