import React from 'react'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import Link from 'next/link'

const Header = () => {
    return (
        <header className="xl:px-3 py-3 xl:py-6 text-light-1">
            <div className="flex justify-between items-center mx-3">
                <Link href="/">
                    <h1 className="text-3xl text-primary-1 font-bold">
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