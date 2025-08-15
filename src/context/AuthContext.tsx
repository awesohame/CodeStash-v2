"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from '@/config/firebase';
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
    username?: string;
    setUsername: (username: string) => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    username: '',
    setUsername: () => { },
    logout: async () => { }
});

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
    const router = useRouter();

    const logout = async () => {
        try {
            await signOut(auth);
            setUsername('');
            router.push('/');
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

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
        console.log('auth context');
        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, username, setUsername, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
