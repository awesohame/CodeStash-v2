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
        <main className="text-light-1 w-full h-full min-h-screen flex">
            <SidebarProvider>
                <Sidebar />
            </SidebarProvider>
            <div className="w-full h-full min-h-screen bg-dark-3 flex flex-col">
                {children}
            </div>
        </main>
    )
}

export default DashboardLayout;