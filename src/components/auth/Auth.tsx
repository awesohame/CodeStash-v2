"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Signin from "./Signin"
import Signup from "./Signup"
import UsernameDialog from "./UsernameDialog"

export default function Component() {
    const [showUsernameDialog, setShowUsernameDialog] = useState<boolean>(false);

    return (
        <>
            <div className="w-[80%] bg-dark-3 p-4 rounded-md">
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="bg-dark-1">
                        <TabsTrigger value="login" className="text-light-2">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="text-light-2">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <Signin
                            setShowUsernameDialog={setShowUsernameDialog}
                        />
                    </TabsContent>
                    <TabsContent value="signup">
                        <Signup
                            setShowUsernameDialog={setShowUsernameDialog}
                        />
                    </TabsContent>
                </Tabs>
            </div>

            <UsernameDialog
                isOpen={showUsernameDialog}
                onClose={() => setShowUsernameDialog(false)}
            />
        </>
    )
}