"use client";

import React, { createContext, useContext, useState } from "react";
import { QuickLink } from "@/constants/types";


type SidebarContextType = {
    quickLinks: QuickLink[];
    setQuickLinks: (quickLinks: QuickLink[]) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = (): SidebarContextType => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider");
    }
    return context;
};

type SidebarProviderProps = {
    children: React.ReactNode;
};

export const SidebarProvider = ({ children }: SidebarProviderProps) => {
    const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

    return (
        <SidebarContext.Provider value={{ quickLinks, setQuickLinks }}>
            {children}
        </SidebarContext.Provider>
    );
};