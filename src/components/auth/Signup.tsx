"use client"

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { auth, db } from '@/config/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDocs, query, collection, where } from 'firebase/firestore';

import GoogleSignIn from './GoogleSignIn';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

const registerSchema = z.object({
    firstName: z.string().min(1, "First name is required").max(10, "Name shouldn't exceed 10 characters"),
    lastName: z.string().max(10, "Name shouldn't exceed 10 characters").optional(),
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be less than 20 characters"),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(6, "Password must be at least 6 characters long").max(100, "Password must be less than 100 characters")
});

const Signup = ({
    setShowUsernameDialog
}: {
    setShowUsernameDialog: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const router = useRouter();

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            username: "",
            email: "",
            password: "",
        },
    });

    async function checkUsernameAvailability(username: string): Promise<boolean> {
        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('username', '==', username));
            const querySnapshot = await getDocs(q);
            return querySnapshot.empty;
        } catch (err) {
            console.error("Error checking username availability:", err);
            return false;
        }
    }

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        try {
            await createUserWithEmailAndPassword(auth, values.email, values.password);
            await setDoc(doc(db, 'users', values.email), {
                firstName: values.firstName,
                lastName: values.lastName,
                username: values.username?.toLowerCase()
            });
            form.reset();
            console.log('User created successfully');
            router.push(`/${values.username.toLowerCase()}`);
        } catch (error) {
            console.error(error);
            toast.error("Email is already in use");
            form.setValue('password', '');
        }
    }

    async function handleUsernameBlur(event: React.FocusEvent<HTMLInputElement>) {
        const username = event.target.value.trim();
        if (username.length >= 3 && username.length <= 20) {
            const isAvailable = await checkUsernameAvailability(username);
            setUsernameAvailable(isAvailable);
        } else {
            setUsernameAvailable(null);
        }
    }

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pt-2">
                    <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-light-1 text-lg'>First Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your first name" aria-label="First Name" {...field} />
                                </FormControl>
                                <FormMessage className="font-medium" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-light-1 text-lg'>Last Name (optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your last name" aria-label="Last Name" {...field} />
                                </FormControl>
                                <FormMessage className="font-medium" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-light-1 text-lg'>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter your username"
                                        aria-label="Username"
                                        {...field}
                                        onBlur={handleUsernameBlur}
                                    />
                                </FormControl>
                                {usernameAvailable === false && (
                                    <FormMessage className="text-red-500 font-medium">Username is already taken.</FormMessage>
                                )}
                                {usernameAvailable === true && (
                                    <FormMessage className="text-green-500 font-medium">Username is available.</FormMessage>
                                )}
                            </FormItem>
                        )}
                    />
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
                    <Button type='submit'
                        className="w-full bg-dark-1 hover:bg-dark-0 disabled:bg-opacity-80"
                        disabled={usernameAvailable === false || !!form.formState.errors.password}
                    >Sign Up</Button>
                </form>
            </Form>

            <GoogleSignIn
                form={form}
                setShowUsernameDialog={setShowUsernameDialog}
            />
        </>
    );
}

export default Signup;