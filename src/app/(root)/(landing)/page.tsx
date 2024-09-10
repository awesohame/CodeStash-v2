import React from 'react'
import { Button } from '@/components/ui/button'

import Home from '@/components/auth/Home'
import AuthTabs from '@/components/auth/AuthTabs'

export default function Landing() {
    return (
        <div className='flex h-screen'>
            <Home />
            <div className='w-1/2 bg-dark-1 flex justify-center items-center'>
                <AuthTabs />
            </div>
        </div>
    )
}
