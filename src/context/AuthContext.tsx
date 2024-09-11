"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from '@/config/firebase';
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AuthContextType = {
    user: User | null;
    username?: string;
    setUsername: (username: string) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, username: '', setUsername: () => { } });

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

type AuthProviderProps = {
    children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);

            if (user) {
                try {
                    // Query Firestore to get the username based on the user's email
                    const userDocRef = doc(db, "users", user.email || '');
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        if (userData && userData.username) {
                            setUsername(userData.username);
                        }
                    }
                } catch (error) {
                    console.error("Error fetching username: ", error);
                }
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, username, setUsername }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
