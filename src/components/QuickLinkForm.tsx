import React, { useState } from 'react'
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
import { useSidebar } from '@/context/SidebarContext'

// const MAX_FILE_SIZE = 5000000; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

const quickLinkSchema = z.object({
    title: z.string().min(1, "Title must be at least 1 character long").max(100, "Title must be less than 100 characters"),
    url: z.string().url("Please enter a valid URL"),
    // icon: z.any()
    //     .refine((files) => files?.length == 1, "Image is required.")
    //     .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    //     .refine(
    //         (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
    //         ".jpg, .jpeg, .png, .webp and .svg files are accepted."
    //     ).optional(),
});

const QuickLinkForm = () => {
    const { addQuickLink } = useSidebar();
    // const [iconPreview, setIconPreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof quickLinkSchema>>({
        resolver: zodResolver(quickLinkSchema),
        defaultValues: {
            title: "",
            url: "https://",
        },
    });

    async function onSubmit(values: z.infer<typeof quickLinkSchema>) {
        try {
            // const iconFile = values.icon?.[0] || await fetchDefaultFavicon();

            await addQuickLink({
                title: values.title,
                url: values.url,
            }/* , iconFile */);

            toast.success("Quicklink added successfully")
            form.reset()
            // setIconPreview(null)
        } catch (error) {
            toast.error("An error occurred")
            console.error(error)
        }
    }

    // Fetch the default favicon from the public directory
    // const fetchDefaultFavicon = async (): Promise<File> => {
    //     const response = await fetch('/default-favicon.png');
    //     const blob = await response.blob();
    //     return new File([blob], 'default-favicon.png', { type: 'image/png' });
    // };

    // const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setIconPreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setIconPreview(null);
    //     }
    // };

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
                                <Input placeholder="Enter name for quicklink" aria-label="Title" className="bg-dark-2/80 border-dark-3/50 text-light-1 placeholder-light-4/70 focus:border-theme-primary/50 focus:ring-theme-primary/20" {...field} />
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
                                <Input type='url' placeholder="Enter URL with https://" aria-label="URL" className="bg-dark-2/80 border-dark-3/50 text-light-1 placeholder-light-4/70 focus:border-theme-primary/50 focus:ring-theme-primary/20" {...field} />
                            </FormControl>
                            <FormMessage className='font-medium' />
                        </FormItem>
                    )}
                />
                {/* <FormField
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
                /> */}
                <Button type='submit' className="w-full bg-theme-primary/90 hover:bg-theme-primary text-white font-medium transition-all duration-300">Add Quicklink</Button>
            </form>
        </Form>
    )
}

export default QuickLinkForm