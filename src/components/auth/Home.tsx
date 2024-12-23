"use client"

import React from 'react'
import { Button } from '@/components/ui/button'

const Home = () => {
    const handleGetStarted = () => {
        const authSection = document.getElementById('auth-section')
        authSection?.scrollIntoView({ behavior: 'smooth' })
    }

    return (
        <div className='flex flex-col justify-center items-center md:items-start w-full h-full p-8 bg-dark-2 text-light-3'>
            <h1 className='text-5xl md:text-7xl font-bold mb-4 text-center md:text-left'>CodeStash</h1>
            <p className='text-light-1 text-2xl md:text-3xl text-center md:text-left mb-2'>An utility tool for programmers and developers.</p>
            <p className='text-dark-5 text-lg md:text-xl text-center md:text-left mb-6'>Store Snippets, Quick links, Notes and more.</p>
            <Button
                onClick={handleGetStarted}
                className="bg-light-4 text-dark-1 hover:bg-light-3 transition-colors duration-300 md:hidden"
            >
                Get Started
            </Button>
        </div>
    )
}

export default Home

