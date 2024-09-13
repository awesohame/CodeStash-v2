'use client'

import { Stash } from "@/constants/types";
import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";

type StashContextType = {
    stashes: Stash[];
    setStashes: React.Dispatch<React.SetStateAction<Stash[]>>;
    createStash: (userEmail: string, stash: Omit<Stash, 'createdAt' | 'updatedAt' | 'isPinned' | 'id'>) => Promise<Stash | null>;
    readStashes: (userEmail: string) => Promise<void>;
    updateStash: (userEmail: string, id: string, stash: Partial<Stash>) => Promise<Stash | null>;
    deleteStash: (userEmail: string, id: string) => Promise<void>;
    togglePinStash: (userEmail: string, id: string) => Promise<void>;
    addTag: (userEmail: string, id: string, tag: string) => Promise<void>;
    removeTag: (userEmail: string, id: string, tag: string) => Promise<void>;
};

const StashContext = createContext<StashContextType | undefined>(undefined);

export const useStash = (): StashContextType => {
    const context = useContext(StashContext);
    if (!context) {
        throw new Error("useStash must be used within a StashProvider");
    }
    return context;
};

export const StashProvider = ({ children }: { children: React.ReactNode }) => {
    const [stashes, setStashes] = useState<Stash[]>([]);

    const createStash = async (userEmail: string, stash: Omit<Stash, 'createdAt' | 'updatedAt' | 'isPinned' | 'id'>): Promise<Stash | null> => {
        try {
            const now = Timestamp.now();
            const userStashesCollection = collection(db, "stashes", userEmail, "userStashes");
            const docRef = await addDoc(userStashesCollection, {
                ...stash,
                createdAt: now,
                updatedAt: now,
                isPinned: false
            });
            const newStash: Stash = {
                ...stash,
                id: docRef.id,
                createdAt: now.toDate().toISOString(),
                updatedAt: now.toDate().toISOString(),
                isPinned: false
            };
            setStashes(prevStashes => [...prevStashes, newStash]);
            return newStash;
        } catch (error) {
            console.error("Error creating stash: ", error);
            return null;
        }
    };
    const formatDate = (date: Timestamp | string | undefined): string => {
        if (!date) return new Date().toISOString();
        if (date instanceof Timestamp) {
            return date.toDate().toISOString();
        }
        if (typeof date === 'string') {
            return new Date(date).toISOString();
        }
        return new Date().toISOString();
    };

    const readStashes = async (userEmail: string) => {
        try {
            const userStashesCollection = collection(db, "stashes", userEmail, "userStashes");
            const q = query(userStashesCollection, orderBy("isPinned", "desc"), orderBy("updatedAt", "desc"));
            const querySnapshot = await getDocs(q);
            const stashesData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    ...data,
                    id: doc.id,
                    createdAt: formatDate(data.createdAt),
                    updatedAt: formatDate(data.updatedAt)
                } as Stash;
            });
            setStashes(stashesData);
        } catch (error) {
            console.error("Error reading stashes: ", error);
        }
    };

    const updateStash = async (userEmail: string, id: string, stashUpdate: Partial<Stash>): Promise<Stash | null> => {
        try {
            const stashRef = doc(db, "stashes", userEmail, "userStashes", id);
            const now = Timestamp.now();
            const updatedFields = { ...stashUpdate, updatedAt: now };
            await updateDoc(stashRef, updatedFields);
            const updatedStash = stashes.find(stash => stash.id === id);
            const updatedData = updatedStash
                ? { ...updatedStash, ...stashUpdate, updatedAt: now.toDate().toISOString() }
                : null;

            if (updatedData) {
                setStashes(prevStashes =>
                    prevStashes.map(stash => stash.id === id ? updatedData : stash)
                );
            }
            return updatedData;
        } catch (error) {
            console.error("Error updating stash: ", error);
            return null;
        }
    };

    const deleteStash = async (userEmail: string, id: string) => {
        try {
            await deleteDoc(doc(db, "stashes", userEmail, "userStashes", id));
            setStashes(prevStashes => prevStashes.filter(stash => stash.id !== id));
        } catch (error) {
            console.error("Error deleting stash: ", error);
        }
    };

    const togglePinStash = async (userEmail: string, id: string) => {
        try {
            const stashToUpdate = stashes.find(stash => stash.id === id);
            if (stashToUpdate) {
                const newPinnedState = !stashToUpdate.isPinned;
                await updateStash(userEmail, id, { isPinned: newPinnedState });
            }
        } catch (error) {
            console.error("Error toggling pin status: ", error);
        }
    };

    const addTag = async (userEmail: string, id: string, tag: string) => {
        try {
            const stashRef = doc(db, "stashes", userEmail, "userStashes", id);
            const stashToUpdate = stashes.find(stash => stash.id === id);
            if (stashToUpdate) {
                const updatedTags = stashToUpdate.tags.includes(tag)
                    ? stashToUpdate.tags
                    : [...stashToUpdate.tags, tag];
                await updateDoc(stashRef, { tags: updatedTags, updatedAt: Timestamp.now() });
                setStashes(prevStashes =>
                    prevStashes.map(stash =>
                        stash.id === id ? { ...stash, tags: updatedTags } : stash
                    )
                );
            }
        } catch (error) {
            console.error("Error adding tag: ", error);
        }
    };

    const removeTag = async (userEmail: string, id: string, tag: string) => {
        try {
            const stashRef = doc(db, "stashes", userEmail, "userStashes", id);
            const stashToUpdate = stashes.find(stash => stash.id === id);
            if (stashToUpdate) {
                const updatedTags = stashToUpdate.tags.filter(t => t !== tag);
                await updateDoc(stashRef, { tags: updatedTags, updatedAt: Timestamp.now() });
                setStashes(prevStashes =>
                    prevStashes.map(stash =>
                        stash.id === id ? { ...stash, tags: updatedTags } : stash
                    )
                );
            }
        } catch (error) {
            console.error("Error removing tag: ", error);
        }
    };

    return (
        <StashContext.Provider value={{
            stashes,
            setStashes,
            createStash,
            readStashes,
            updateStash,
            deleteStash,
            togglePinStash,
            addTag,
            removeTag
        }}>
            {children}
        </StashContext.Provider>
    );
};