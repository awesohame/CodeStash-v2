import React from 'react'

import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '@/config/firebase'

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
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'

const quickLinkSchema = z.object({
    title: z.string().min(1, "Title must be at least 1 character long").max(100, "Title must be less than 100 characters"),
    url: z.string().url("Please enter a valid URL"),
});

const QuickLinkForm = () => {
    const form = useForm<z.infer<typeof quickLinkSchema>>({
        resolver: zodResolver(quickLinkSchema),
        defaultValues: {
            title: "",
            url: "https://",
        },
    });

    async function onSubmit(values: z.infer<typeof quickLinkSchema>) {
        console.log(values)
        try {
            const user = auth.currentUser
            if (!user) {
                console.error("User not logged in")
                return
            }
            const email = user.email;
            const quickLinkRef = doc(db, 'quickLinks', email as string);
            const quickLinkDoc = await getDoc(quickLinkRef);
            if (quickLinkDoc.exists()) {
                const existingQuickLinks = quickLinkDoc.data().quickLinks ?? [];
                const updatedQuickLinks = [
                    ...existingQuickLinks,
                    {
                        title: values.title,
                        url: values.url
                    }
                ];
                await updateDoc(quickLinkRef, {
                    quickLinks: updatedQuickLinks
                });
            } else {
                await setDoc(quickLinkRef, {
                    quickLinks: [
                        {
                            title: values.title,
                            url: values.url
                        }
                    ]
                });
            }
            toast.success("Quicklink added successfully")
            form.reset()
        } catch (error) {
            toast.error("An error occurred")
            console.error(error)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 px-6 pt-2">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-light-1 text-lg'>Title</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter name for quicklink" aria-label="Title" {...field} />
                            </FormControl>
                            <FormMessage className='font-medium' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='url'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='text-light-1 text-lg'>URL</FormLabel>
                            <FormControl>
                                <Input type='url' placeholder="Enter URL with https://" aria-label="URL" {...field} />
                            </FormControl>
                            <FormMessage className='font-medium' />
                        </FormItem>
                    )}
                />
                <Button type='submit' className="w-full bg-dark-1 hover:bg-dark-0">Add Quicklink</Button>
            </form>
        </Form>
    )
}

export default QuickLinkForm

