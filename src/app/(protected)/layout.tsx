import React, { ReactNode } from "react";
import { Metadata } from "next";
import ProtectedRoute from "@/components/ProtectedRoute";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
    title: "CodeStash",
    description: "An utility tool for programmers",
};

const ProtectedRouteLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <AuthProvider>
            <ProtectedRoute>
                {children}
            </ProtectedRoute>
        </AuthProvider>
    )
}

export default ProtectedRouteLayout;