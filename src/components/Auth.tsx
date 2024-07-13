import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Signin from "./Signin"
import Signup from "./Signup"

export default function Component() {
    return (
        <div className="w-[80%] bg-dark-3 p-4 rounded-md">
            <Tabs defaultValue="login" className="w-full">
                <TabsList className="bg-dark-1">
                    <TabsTrigger value="login" className="text-light-2">Login</TabsTrigger>
                    <TabsTrigger value="signup" className="text-light-2">Sign Up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Signin />
                </TabsContent>
                <TabsContent value="signup">
                    <Signup />
                </TabsContent>
            </Tabs>
        </div>
    )
}