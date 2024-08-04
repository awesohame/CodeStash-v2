'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { navLinks } from '@/constants';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className='flex gap-8'>
            {navLinks.map((link, idx) => {
                return (
                    <Link
                        href={link.path}
                        key={idx}
                        className={cn(
                            "font-medium hover:text-light-3 text-xl",
                            {
                                "text-light-1": link.path !== pathname,
                                "text-light-3": link.path === pathname
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