import React, { ReactNode } from "react";
import { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
    title: "CodeStash",
    description: "An utility tool for programmers",
};

const DashboardLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <>
            <Header />
        </>
    )
}

export default DashboardLayout;