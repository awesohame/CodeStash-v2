"use client";

import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils';
import axios from 'axios';
import Loader from '../Loader';

const SidebarIcon = ({
    link,
    className
}: {
    link: string,
    className?: string
}) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null)

    // Dont use until api is fixed 

    // useEffect(() => {
    //     const fetchFavicon = async () => {
    //         const res = await axios.post('/api/v1/getfavicon', { url: link })
    //         setLogoUrl(res.data)
    //     }
    //     fetchFavicon()
    // }, [link])

    return (
        <div className={cn(
            'w-6 h-6',
            className
        )}>
            {logoUrl ? <img src={logoUrl} alt='favicon' /> : <Loader />}
        </div>
    )
}

export default SidebarIcon