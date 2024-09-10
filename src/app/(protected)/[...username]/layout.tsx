import React, { ReactNode } from "react";
import { Metadata } from "next";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";

export const metadata: Metadata = {
    title: "CodeStash",
    description: "An utility tool for programmers",
};

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <main className="text-light-1 w-full h-full min-h-screen flex bg-gradient-to-br from-dark-2 to-dark-4">
            <SidebarProvider>
                <Sidebar />
            </SidebarProvider>
            <div className="w-full h-full min-h-screen bg-dark-3 bg-opacity-50 backdrop-blur-md flex flex-col">
                {children}
            </div>
        </main>
    )
}

export default DashboardLayout;