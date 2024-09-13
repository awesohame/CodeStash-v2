"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth, storage } from '@/config/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QuickLink } from '@/constants/types';

type SidebarContextType = {
    quickLinks: QuickLink[];
    setQuickLinks: (quickLinks: QuickLink[]) => void;
    addQuickLink: (newQuickLink: QuickLink, iconFile?: File) => Promise<void>;
    removeQuickLink: (url: string) => Promise<void>;
    updateQuickLink: (oldUrl: string, updatedQuickLink: QuickLink, iconFile?: File) => Promise<void>;
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

    useEffect(() => {
        const fetchQuickLinks = async () => {
            const user = auth.currentUser;
            if (!user) {
                console.error('User not logged in');
                return;
            }
            const email = user.email;
            const quickLinkRef = doc(db, 'quickLinks', email as string);
            const quickLinkDoc = await getDoc(quickLinkRef);
            if (quickLinkDoc.exists()) {
                const quickLinksData = quickLinkDoc.data().quickLinks ?? [];
                setQuickLinks(quickLinksData);
            } else {
                console.log('No quicklinks found');
            }
        };

        fetchQuickLinks();
    }, []);

    const updateFirestore = async (newQuickLinks: QuickLink[]) => {
        const user = auth.currentUser;
        if (!user) {
            console.error('User not logged in');
            return;
        }
        const email = user.email;
        const quickLinkRef = doc(db, 'quickLinks', email as string);
        await setDoc(quickLinkRef, { quickLinks: newQuickLinks }, { merge: true });
    };

    const uploadIcon = async (file: File): Promise<string> => {
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');

        const iconRef = ref(storage, `quickLinkIcons/${user.uid}/${file.name}`);
        await uploadBytes(iconRef, file);
        return await getDownloadURL(iconRef);
    };

    const addQuickLink = async (newQuickLink: QuickLink, iconFile?: File) => {
        if (iconFile) {
            const iconUrl = await uploadIcon(iconFile);
            newQuickLink.icon = iconUrl;
        }
        const updatedQuickLinks = [...quickLinks, newQuickLink];
        setQuickLinks(updatedQuickLinks);
        await updateFirestore(updatedQuickLinks);
    };

    const removeQuickLink = async (url: string) => {
        const updatedQuickLinks = quickLinks.filter(link => link.url !== url);
        setQuickLinks(updatedQuickLinks);
        await updateFirestore(updatedQuickLinks);
    };

    const updateQuickLink = async (oldUrl: string, updatedQuickLink: QuickLink, iconFile?: File) => {
        if (iconFile) {
            const iconUrl = await uploadIcon(iconFile);
            updatedQuickLink.icon = iconUrl;
        }
        const updatedQuickLinks = quickLinks.map(link =>
            link.url === oldUrl ? updatedQuickLink : link
        );
        setQuickLinks(updatedQuickLinks);
        await updateFirestore(updatedQuickLinks);
    };

    return (
        <SidebarContext.Provider value={{ quickLinks, setQuickLinks, addQuickLink, removeQuickLink, updateQuickLink }}>
            {children}
        </SidebarContext.Provider>
    );
};