"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from '@/config/firebase';
import { onAuthStateChanged, User } from "firebase/auth";

type AuthContextType = {
    user: User | null;
    username?: string;
    setUsername: (username: string) => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, username: '', setUsername: () => { } });

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    // console.log(context)
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
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // console.log("Auth State Changed: ", user);
            setCurrentUser(user);
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