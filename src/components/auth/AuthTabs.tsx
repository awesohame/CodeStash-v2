"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Signin from "./Signin"
import Signup from "./Signup"
import UsernameDialog from "./UsernameDialog"

export default function AuthTabs() {
    const [showUsernameDialog, setShowUsernameDialog] = useState<boolean>(false);

    return (
        <div className="w-full max-w-md mx-auto animate-fade-in">
            <div className="bg-dark-3 p-6 rounded-lg shadow-lg">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4 bg-dark-0">
                        <TabsTrigger value="login" className="text-light-2 data-[state=active]:bg-light-4 data-[state=active]:text-dark-1">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="text-light-2 data-[state=active]:bg-light-4 data-[state=active]:text-dark-1">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Signin setShowUsernameDialog={setShowUsernameDialog} />
                    </TabsContent>
                    <TabsContent value="signup">
                        <Signup setShowUsernameDialog={setShowUsernameDialog} />
                    </TabsContent>
                </Tabs>
            </div>

            <UsernameDialog
                isOpen={showUsernameDialog}
                onClose={() => setShowUsernameDialog(false)}
            />
        </div>
    )
}