"use client";

import React, { createContext, useContext, useState } from "react";

type User = {
    username: string;
    firstName: string;
};

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

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(defaultUserContext.user);
    const isLoggedIn = user.username !== "";

    return (
        <UserContext.Provider value={defaultUserContext}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    return useContext(UserContext);
}