import React from 'react'
import Home from '@/components/auth/Home'
import AuthTabs from '@/components/auth/AuthTabs'

export default function Landing() {
    return (
        <div className='flex flex-col md:flex-row min-h-screen'>
            <div className='w-full md:w-1/2 h-screen md:h-screen'>
                <Home />
            </div>
            <div id="auth-section" className='w-full md:w-1/2 h-screen md:h-screen bg-dark-1 flex justify-center items-center'>
                <AuthTabs />
            </div>
        </div>
    )
}

