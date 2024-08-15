"use client";

import React, { createContext, useContext, useState } from "react";
import { User } from "@/constants/types";

type UserContextType = {
    isLoggedIn: boolean;
    user: User;
    setUser: (user: User) => void;
};

const defaultUserContext: UserContextType = {
    isLoggedIn: false,
    user: {
        username: "",
        firstName: "",
    },
    setUser: () => { },
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}

type UserProviderProps = {
    children: React.ReactNode;
};

export const UserProvider = ({ children }: UserProviderProps) => {
    const [user, setUser] = useState<User>(defaultUserContext.user);

    return (
        <UserContext.Provider value={{ isLoggedIn: !!user.username, user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};