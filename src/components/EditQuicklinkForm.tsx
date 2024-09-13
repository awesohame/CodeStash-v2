import React, { useState } from 'react'
import { Button } from './ui/button'
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
import toast from 'react-hot-toast'
import { useSidebar } from '@/context/SidebarContext'

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

const editQuicklinkSchema = z.object({
    title: z.string().min(1, "Title must be at least 1 character long").max(100, "Title must be less than 100 characters"),
    url: z.string().url("Please enter a valid URL"),
    icon: z.any()
        .refine((files) => files?.length <= 1, "Only one image can be uploaded.")
        .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE || files?.length === 0, `Max file size is 5MB.`)
        .refine(
            (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type) || files?.length === 0,
            ".jpg, .jpeg, .png, .webp and .svg files are accepted."
        ).optional(),
});

const EditQuicklinkForm = (
    {
        title,
        url,
        icon
    }: {
        title: string,
        url: string,
        icon?: string
    }
) => {
    const { updateQuickLink } = useSidebar();
    const [iconPreview, setIconPreview] = useState<string | null>(icon || null);

    const form = useForm<z.infer<typeof editQuicklinkSchema>>({
        resolver: zodResolver(editQuicklinkSchema),
        defaultValues: {
            title,
            url,
        },
    });

    async function onSubmit(values: z.infer<typeof editQuicklinkSchema>) {
        try {
            await updateQuickLink(url, {
                title: values.title,
                url: values.url,
                icon: icon // Keep the existing icon if not changed
            }, values.icon?.[0]);
            toast.success('Quicklink updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    }

    const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setIconPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setIconPreview(icon || null);
        }
    };

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
                <FormField
                    control={form.control}
                    name="icon"
                    render={({ field: { onChange, value, ...field } }) => (
                        <FormItem>
                            <FormLabel className='text-light-1 text-lg'>Icon</FormLabel>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept={ACCEPTED_IMAGE_TYPES.join(',')}
                                    onChange={(e) => {
                                        onChange(e.target.files);
                                        handleIconChange(e);
                                    }}
                                    {...field}
                                />
                            </FormControl>
                            {iconPreview && (
                                <img src={iconPreview} alt="Icon preview" className="mt-2 w-10 h-10 object-cover" />
                            )}
                            <FormMessage className='font-medium' />
                        </FormItem>
                    )}
                />
                <Button type='submit' className="w-full bg-dark-1 hover:bg-dark-0">Update Quicklink</Button>
            </form>
        </Form>
    )
}

export default EditQuicklinkForm