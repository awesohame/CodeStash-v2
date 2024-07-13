"use client"

import React from 'react'
import { Button } from "@/components/ui/button"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { auth, db, googleProvider } from '@/config/firebase'
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from 'firebase/firestore'

import { FaGoogle } from "react-icons/fa";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be less than 100 characters")
});

const Signin = () => {
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    async function onSubmit(values: z.infer<typeof loginSchema>) {
        // Do something with the form values.
        console.log(values)
        try {
            await signInWithEmailAndPassword(auth, values.email, values.password);
            form.reset();
            console.log('User signed in with email and password successfully');
        } catch (error) {
            console.error(error)
        }
    }

    async function signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log(user);
            const email = user.email ?? '';
            await setDoc(doc(db, 'users', email), {
                firstName: user.displayName?.split(" ")[0] ?? 'User',
                lastName: user.displayName?.split(" ")[1] ?? ''
            });
            console.log('User signed in with Google successfully');
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-6">
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
                <div className="my-4 border-t border-light-2 mx-4"></div>
                <Button onClick={signInWithGoogle} className="w-full bg-dark-5 hover:bg-dark-4">
                    <FaGoogle className="mx-4 text-light-2" />
                    Sign In with Google
                </Button>
            </form>
        </Form>
    )
}

export default Signin