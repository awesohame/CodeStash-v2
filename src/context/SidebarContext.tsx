"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { db, auth, storage } from '@/config/firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { QuickLink } from '@/constants/types';

type SidebarContextType = {
    quickLinks: QuickLink[];
    setQuickLinks: (quickLinks: QuickLink[]) => void;
    addQuickLink: (newQuickLink: QuickLink, iconFile?: File) => Promise<void>;
    removeQuickLink: (id: string) => Promise<void>;
    updateQuickLink: (id: string, updatedQuickLink: QuickLink, iconFile?: File) => Promise<void>;
    refreshQuickLinks: () => Promise<void>;
    updateQuickLinks: (newQuickLinks: QuickLink[]) => Promise<void>; // New method
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

    const fetchQuickLinks = useCallback(async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error('User not logged in');
            return;
        }
        const email = user.email;
        const quickLinkRef = doc(db, 'quickLinks', email as string);
        const quickLinkDoc = await getDoc(quickLinkRef);
        if (quickLinkDoc.exists()) {
            let quickLinksData = quickLinkDoc.data().quickLinks ?? [];

            // Migration: Add IDs to existing quicklinks that don't have them
            let needsUpdate = false;
            quickLinksData = quickLinksData.map((link: QuickLink) => {
                if (!link.id) {
                    needsUpdate = true;
                    return {
                        ...link,
                        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                    };
                }
                return link;
            });

            // If we added IDs, update Firestore
            if (needsUpdate) {
                await setDoc(quickLinkRef, { quickLinks: quickLinksData }, { merge: true });
            }

            setQuickLinks(quickLinksData);
            console.log('quicklinks fetched');
        } else {
            console.log('No quicklinks found');
        }
    }, []);

    useEffect(() => {
        fetchQuickLinks();
        console.log('sidebar context');
    }, [fetchQuickLinks]);

    const refreshQuickLinks = useCallback(async () => {
        await fetchQuickLinks();
    }, [fetchQuickLinks]);

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
        // Generate unique ID if not provided
        if (!newQuickLink.id) {
            newQuickLink.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        }

        if (iconFile) {
            const iconUrl = await uploadIcon(iconFile);
            newQuickLink.icon = iconUrl;
        }
        const updatedQuickLinks = [...quickLinks, newQuickLink];
        setQuickLinks(updatedQuickLinks);
        await updateFirestore(updatedQuickLinks);
    };

    const removeQuickLink = async (id: string) => {
        const updatedQuickLinks = quickLinks.filter(link => link.id !== id);
        setQuickLinks(updatedQuickLinks);
        await updateFirestore(updatedQuickLinks);
    };

    const updateQuickLink = async (id: string, updatedQuickLink: QuickLink, iconFile?: File) => {
        if (iconFile) {
            const iconUrl = await uploadIcon(iconFile);
            updatedQuickLink.icon = iconUrl;
        }
        const updatedQuickLinks = quickLinks.map(link =>
            link.id === id ? updatedQuickLink : link
        );
        setQuickLinks(updatedQuickLinks);
        await updateFirestore(updatedQuickLinks);
    };

    // New method to update entire quickLinks array (for reordering)
    const updateQuickLinks = async (newQuickLinks: QuickLink[]) => {
        setQuickLinks(newQuickLinks);
        await updateFirestore(newQuickLinks);
    };

    return (
        <SidebarContext.Provider value={{
            quickLinks,
            setQuickLinks,
            addQuickLink,
            removeQuickLink,
            updateQuickLink,
            refreshQuickLinks,
            updateQuickLinks // Added to the context
        }}>
            {children}
        </SidebarContext.Provider>
    );
};