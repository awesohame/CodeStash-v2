'use client'

import { Stash } from "@/constants/types";
import React, { createContext, useContext, useState } from "react";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, Timestamp, query, orderBy } from "firebase/firestore";
import { db } from "@/config/firebase";

type StashContextType = {
    stashes: Stash[];
    setStashes: React.Dispatch<React.SetStateAction<Stash[]>>;
    searchResults: Stash[];
    setSearchResults: React.Dispatch<React.SetStateAction<Stash[]>>;
    createStash: (userEmail: string, stash: Omit<Stash, 'createdAt' | 'updatedAt' | 'isPinned' | 'id'>) => Promise<Stash | null>;
    readStashes: (userEmail: string) => Promise<void>;
    updateStash: (userEmail: string, id: string, stash: Partial<Stash>) => Promise<Stash | null>;
    deleteStash: (userEmail: string, id: string) => Promise<void>;
    togglePinStash: (userEmail: string, id: string) => Promise<void>;
    addTag: (userEmail: string, id: string, tag: string) => Promise<void>;
    removeTag: (userEmail: string, id: string, tag: string) => Promise<void>;
    searchStashes: (query: string, userEmail: string, searchIndex?: 'desc' | 'sections') => Promise<Stash[]>;
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
    const [searchResults, setSearchResults] = useState<Stash[]>([]);

    const createStash = async (userEmail: string, stash: Omit<Stash, 'id' | 'createdAt' | 'updatedAt' | 'isPinned'>): Promise<Stash | null> => {
        try {
            const now = Timestamp.now();

            // Store main data in Firestore
            const userStashesCollection = collection(db, "stashes", userEmail, "userStashes");
            const docRef = await addDoc(userStashesCollection, {
                ...stash,
                createdAt: now,
                updatedAt: now,
                isPinned: false
            });

            // Call API to store embeddings in MongoDB
            const response = await fetch('/api/v1/stash', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userEmail, stash: { ...stash, id: docRef.id } }),
            });
            // console.log('response', response);
            if (!response.ok) {
                throw new Error('Failed to store embeddings');
            }

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
            const now = Timestamp.now();
            const stashRef = doc(db, "stashes", userEmail, "userStashes", id);
            const updatedFields = { ...stashUpdate, updatedAt: now };
            await updateDoc(stashRef, updatedFields);

            // Call API to update embeddings in MongoDB
            if (stashUpdate.desc || stashUpdate.stashSections) {
                const response = await fetch('/api/v1/stash', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userEmail, id, stashUpdate }),
                });

                if (!response.ok) {
                    throw new Error('Failed to update embeddings');
                }
            }

            const updatedStash = { ...stashUpdate, id, updatedAt: now.toDate().toISOString() } as Stash;
            setStashes(prevStashes =>
                prevStashes.map(stash => stash.id === id ? { ...stash, ...updatedStash } : stash)
            );
            return updatedStash;
        } catch (error) {
            console.error("Error updating stash: ", error);
            return null;
        }
    };

    const deleteStash = async (userEmail: string, id: string) => {
        try {
            // Delete from Firestore
            await deleteDoc(doc(db, "stashes", userEmail, "userStashes", id));

            // Call API to delete from MongoDB
            const response = await fetch(`/api/v1/stash?userEmail=${userEmail}&id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete embeddings');
            }

            setStashes(prevStashes => prevStashes.filter(stash => stash.id !== id));
        } catch (error) {
            console.error("Error deleting stash: ", error);
        }
    };

    const togglePinStash = async (userEmail: string, id: string) => {
        try {
            // Find the stash to update, prioritizing search results if they exist
            const stashToUpdate =
                searchResults.find(stash => stash.id === id) ||
                stashes.find(stash => stash.id === id);

            if (stashToUpdate) {
                const newPinnedState = !stashToUpdate.isPinned;

                // Update stashes
                setStashes(prevStashes =>
                    prevStashes.map(stash =>
                        stash.id === id ? { ...stash, isPinned: newPinnedState } : stash
                    )
                );

                // If search results exist, update them as well
                if (searchResults.length > 0) {
                    setSearchResults(prevResults =>
                        prevResults.map(stash =>
                            stash.id === id ? { ...stash, isPinned: newPinnedState } : stash
                        )
                    );
                }

                // Persist the change in Firestore
                await updateStash(userEmail, id, { isPinned: newPinnedState });
            } else {
                console.warn(`Stash with ID ${id} not found in stashes or search results`);
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

    const handleSearchStashes = async (query: string, userEmail: string, searchIndex?: 'desc' | 'sections') => {
        try {
            const response = await fetch(`/api/v1/stash/search?query=${query}&userEmail=${userEmail}&searchIndex=${searchIndex || 'desc'}`);
            if (!response.ok) {
                throw new Error('Failed to search stashes');
            }
            const results = await response.json();

            // Normalize dates for search results and preserve pinned status
            const normalizedResults = results.map((result: Stash) => {
                // Find the original stash to get the pinned status
                const originalStash = stashes.find(stash => stash.id === result.id);

                return {
                    ...result,
                    createdAt: formatDate(result.createdAt),
                    updatedAt: formatDate(result.updatedAt),
                    isPinned: originalStash ? originalStash.isPinned : false
                };
            });

            return normalizedResults;
        } catch (error) {
            console.error("Error searching stashes: ", error);
            return [];
        }
    };

    return (
        <StashContext.Provider value={{
            stashes,
            setStashes,
            searchResults,
            setSearchResults,
            createStash,
            readStashes,
            updateStash,
            deleteStash,
            togglePinStash,
            addTag,
            removeTag,
            searchStashes: handleSearchStashes,
        }}>
            {children}
        </StashContext.Provider>
    );
};