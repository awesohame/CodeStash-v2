"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { auth, db } from '@/config/firebase'
import { signInWithEmailAndPassword } from "firebase/auth"

import GoogleSignIn from './GoogleSignIn'
import { doc, getDoc } from 'firebase/firestore'
import toast from 'react-hot-toast'

import { useUser } from '@/context/UserContext'

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be less than 100 characters")
});

const Signin = ({
    setShowUsernameDialog
}: {
    setShowUsernameDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const router = useRouter();
    const { user, setUser } = useUser();

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    async function onSubmit(values: z.infer<typeof loginSchema>) {
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            const email = values.email ?? '';
            form.reset();
            // console.log('User signed in with email and password successfully');
            const userRef = doc(db, 'users', email);
            const userDoc = await getDoc(userRef);
            const userData = userDoc.data();
            setUser({
                username: userData?.username,
                firstName: userData?.firstName
            });
            router.push(`/${userDoc.data()?.username}`);
        } catch (error) {
            console.error(error)
            toast.error("Invalid credentials")
            form.setValue('password', '')
        }
    }



    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pt-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-light-1 text-lg'>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your email" aria-label="Email" {...field} />
                                </FormControl>
                                <FormMessage className='font-medium' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-light-1 text-lg'>Password</FormLabel>
                                <FormControl>
                                    <Input type='password' placeholder="Enter your password" aria-label="Password" {...field} />
                                </FormControl>
                                <FormMessage className='font-medium' />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className="w-full bg-dark-1 hover:bg-dark-0">Sign In</Button>
                </form>
            </Form>
            <GoogleSignIn
                form={form}
                setShowUsernameDialog={setShowUsernameDialog}
            />
        </>
    )
}

export default Signin