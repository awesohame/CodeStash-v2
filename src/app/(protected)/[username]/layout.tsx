// import React, { ReactNode } from "react";
// import { Metadata } from "next";
// import Sidebar from "@/components/sidebar/Sidebar";
// import { SidebarProvider } from "@/context/SidebarContext";
// import { StashProvider } from "@/context/StashContext";

// export const metadata: Metadata = {
//     title: "CodeStash",
//     description: "An utility tool for programmers",
// };

// const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
//     return (
//         <main className="text-light-1 w-full h-screen flex bg-dark-2 overflow-hidden">
//             <SidebarProvider>
//                 <div className="fixed h-screen z-50">
//                     <Sidebar />
//                 </div>
//             </SidebarProvider>
//             <StashProvider>
//                 <div className="flex-1 ml-[300px] overflow-y-auto">
//                     <div className="min-h-screen bg-dark-3 backdrop-blur-md flex flex-col">
//                         {children}
//                     </div>
//                 </div>
//             </StashProvider>
//         </main>
//     )
// }

// export default DashboardLayout;

"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { SidebarProvider } from '@/context/SidebarContext';
import { StashProvider } from '@/context/StashContext';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
        checkIfMobile();
        window.addEventListener('resize', checkIfMobile);
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <main className="flex h-screen overflow-hidden bg-dark-2">
            {/* Sidebar */}
            <SidebarProvider>
                <div
                    className={`
                    fixed inset-y-0 left-0 z-50 w-[300px] transform transition-transform duration-300 ease-in-out
                    ${isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'}
                    `}
                >
                    <Sidebar onCloseSidebar={() => setIsSidebarOpen(false)} />
                </div>

            </SidebarProvider>
            {/* Main content */}
            <StashProvider>
                <div className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ease-in-out ${isMobile ? 'ml-0' : 'ml-[300px]'}`}>
                    {isMobile && (
                        <Button
                            onClick={toggleSidebar}
                            className="fixed top-4 left-4 z-40 bg-dark-2 text-light-1 bg-opacity-70 backdrop-blur-md rounded-md"
                        >
                            <Menu size={24} />
                        </Button>
                    )}
                    {children}
                </div>
            </StashProvider>
        </main>
    );
};

export default DashboardLayout;
