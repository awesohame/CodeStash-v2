"use client";

import { Stash } from "@/constants/types";
import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "@/config/firebase";

type StashContextType = {
    stashes: Stash[];
    setStashes: React.Dispatch<React.SetStateAction<Stash[]>>;
    createStash: (userEmail: string, stash: Omit<Stash, 'createdAt'>) => Promise<Stash | null>;
    readStashes: (userEmail: string) => Promise<void>;
    updateStash: (userEmail: string, id: string, stash: Partial<Stash>) => Promise<Stash | null>;
    deleteStash: (userEmail: string, id: string) => Promise<void>;
};

const StashContext = createContext<StashContextType | undefined>(undefined);

export const useStash = (): StashContextType => {
    const context = useContext(StashContext);
    if (!context) {
        throw new Error("useStash must be used within a StashProvider");
    }
    return context;
};

type StashProviderProps = {
    children: React.ReactNode;
};

export const StashProvider = ({ children }: StashProviderProps) => {
    const [stashes, setStashes] = useState<Stash[]>([]);

    // Create a stash under the user's document and stash collection
    const createStash = async (userEmail: string, stash: Omit<Stash, 'createdAt'>): Promise<Stash | null> => {
        try {
            const userStashesCollection = collection(db, "stashes", userEmail, "userStashes");
            const docRef = await addDoc(userStashesCollection, {
                ...stash,
                createdAt: Timestamp.now()
            });
            const newStash: Stash = { ...stash, id: docRef.id, createdAt: new Date().toISOString() };
            setStashes(prevStashes => [...prevStashes, newStash]);
            return newStash;
        } catch (error) {
            console.error("Error creating stash: ", error);
            return null;
        }
    };

    // Read all stashes under the user's document and stash collection
    const readStashes = async (userEmail: string) => {
        try {
            const userStashesCollection = collection(db, "stashes", userEmail, "userStashes");
            const querySnapshot = await getDocs(userStashesCollection);
            const stashesData = querySnapshot.docs.map(doc => ({
                ...(doc.data() as Stash),
                id: doc.id,
                createdAt: doc.data().createdAt.toDate().toISOString()
            }));
            setStashes(stashesData);
        } catch (error) {
            console.error("Error reading stashes: ", error);
        }
    };

    // Update a specific stash under the user's document and stash collection
    const updateStash = async (userEmail: string, id: string, stashUpdate: Partial<Stash>): Promise<Stash | null> => {
        try {
            const stashRef = doc(db, "stashes", userEmail, "userStashes", id);
            await updateDoc(stashRef, stashUpdate);
            const updatedStash = stashes.find(stash => stash.id === id);
            const updatedData = updatedStash ? { ...updatedStash, ...stashUpdate } : null;

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

    // Delete a specific stash under the user's document and stash collection
    const deleteStash = async (userEmail: string, id: string) => {
        try {
            await deleteDoc(doc(db, "stashes", userEmail, "userStashes", id));
            setStashes(prevStashes => prevStashes.filter(stash => stash.id !== id));
        } catch (error) {
            console.error("Error deleting stash: ", error);
        }
    };

    return (
        <StashContext.Provider value={{ stashes, setStashes, createStash, readStashes, updateStash, deleteStash }}>
            {children}
        </StashContext.Provider>
    );
};
