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
import { auth, db } from '@/config/firebase';
import { doc, getDocs, query, collection, where, updateDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

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
        try {
            const user = auth.currentUser;
            if (!user || !user.email) {
                throw new Error("User not found or email not available");
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
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-dark-3 rounded-lg p-8 w-96 shadow-xl"
                    >
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className='text-light-1 text-lg'>Choose a Username</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your username"
                                                    className="bg-dark-2 text-light-1 border-dark-1"
                                                    {...field}
                                                    onBlur={handleUsernameBlur}
                                                />
                                            </FormControl>
                                            {usernameAvailable === false && (
                                                <FormMessage className="text-light-4">Username is already taken.</FormMessage>
                                            )}
                                            {usernameAvailable === true && (
                                                <FormMessage className="text-light-3">Username is available.</FormMessage>
                                            )}
                                        </FormItem>
                                    )}
                                />
                                <Button type='submit'
                                    className={cn(
                                        "w-full bg-dark-5 hover:bg-dark-4 text-light-1",
                                        !usernameAvailable && "opacity-50 cursor-not-allowed"
                                    )}
                                    disabled={!usernameAvailable}
                                >
                                    Confirm Username
                                </Button>
                            </form>
                        </Form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default UsernameDialog;