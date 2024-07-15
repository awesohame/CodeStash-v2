"use client"

import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

import { auth, db, googleProvider } from '@/config/firebase';
import { doc, setDoc, getDocs, query, collection, where, updateDoc } from 'firebase/firestore';

const usernameSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters long").max(20, "Username must be less than 20 characters"),
});

const UsernameDialog = ({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) => {
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const router = useRouter();

    const form = useForm<z.infer<typeof usernameSchema>>({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: "",
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

    async function handleUsernameBlur(event: React.FocusEvent<HTMLInputElement>) {
        const username = event.target.value.trim();
        if (username.length >= 3 && username.length <= 20) {
            const isAvailable = await checkUsernameAvailability(username);
            setUsernameAvailable(isAvailable);
        } else {
            setUsernameAvailable(null);
        }
    }

    async function onSubmit(values: z.infer<typeof usernameSchema>) {
        // find through email and update username
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not found");
            }
            if (!user.email) {
                throw new Error("User email not found");
            }
            await updateDoc(doc(db, 'users', user.email), {
                username: values.username.toLowerCase(),
            });
            form.reset();
            onClose();
            router.push(`/${values.username.toLowerCase()}`);
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ${isOpen ? "" : "hidden"
                }`}
        >
            <div className="bg-dark-3 rounded-lg p-8 w-96">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 py-2">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='text-light-1 text-lg'>Choose a Username</FormLabel>
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
                        <Button type='submit'
                            className={cn(
                                "w-full bg-dark-1 hover:bg-dark-0",
                                !usernameAvailable && "cursor-not-allowed opacity-50"
                            )}
                            disabled={!usernameAvailable}
                        >
                            Sign Up
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default UsernameDialog;
