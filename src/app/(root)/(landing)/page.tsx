import React from 'react'
import { Button } from '@/components/ui/button'

import Home from '@/components/auth/Home'
import Auth from '@/components/auth/Auth'

export default function Landing() {
    return (
        <div className='flex h-screen'>
            <Home />
            <div className='w-1/2 bg-dark-1 flex justify-center items-center'>
                <Auth />
            </div>
        </div>
    )
}
