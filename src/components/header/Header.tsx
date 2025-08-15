import React from 'react'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import Link from 'next/link'

const Header = () => {
    return (
        <header className="xl:px-3 py-4 xl:py-8 text-light-1">
            <div className="flex justify-between items-center mx-3">
                <Link href="/">
                    <h1 className="text-4xl xl:text-5xl text-theme-primary font-black tracking-tight hover:text-theme-secondary transition-colors duration-300">
                        CodeStash
                    </h1>
                </Link>

                <div className="hidden xl:flex items-center gap-8">
                    <Navbar />
                </div>

                <div className="xl:hidden">
                    <MobileNav />
                </div>
            </div>
        </header>
    )
}

export default Header