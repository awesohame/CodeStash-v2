import React, { ReactNode } from "react";
import { Metadata } from "next";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/context/SidebarContext";
import { StashProvider } from "@/context/StashContext";

export const metadata: Metadata = {
    title: "CodeStash",
    description: "An utility tool for programmers",
};

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <main className="text-light-1 w-full h-screen flex bg-dark-2 overflow-hidden">
            <SidebarProvider>
                <div className="fixed h-screen">
                    <Sidebar />
                </div>
            </SidebarProvider>
            <StashProvider>
                <div className="flex-1 ml-[300px] overflow-y-auto">
                    <div className="min-h-screen bg-dark-3 backdrop-blur-md flex flex-col">
                        {children}
                    </div>
                </div>
            </StashProvider>
        </main>
    )
}

export default DashboardLayout;