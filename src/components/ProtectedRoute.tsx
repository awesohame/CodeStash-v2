"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";
import Loader from "./Loader";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // console.log(user);
        if (!user) {
            router.push("/");
        }
    }, [user, router]);

    if (!user) {
        return <Loader />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
