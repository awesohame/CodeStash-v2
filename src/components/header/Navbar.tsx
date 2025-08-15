'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className='flex gap-10'>
            {navLinks.map((link, idx) => {
                return (
                    <Link
                        href={link.path}
                        key={idx}
                        className={cn(
                            "font-bold text-lg tracking-wide hover:text-theme-primary transition-all duration-300",
                            {
                                "text-light-1 hover:scale-105": link.path !== pathname,
                                "text-theme-primary scale-105": link.path === pathname
                            }
                        )}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </nav>
    );
};

export default Navbar;