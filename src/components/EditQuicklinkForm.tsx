import React, { useState } from 'react'
import { Button } from './ui/button'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import toast from 'react-hot-toast'
import { useSidebar } from '@/context/SidebarContext'
import Image from 'next/image'

// const MAX_FILE_SIZE = 5000000; // 5MB
// const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

const editQuicklinkSchema = z.object({
    title: z.string().min(1, "Title must be at least 1 character long").max(100, "Title must be less than 100 characters"),
    url: z.string().url("Please enter a valid URL"),
    // icon: z.any()
    //     .refine((files) => files?.length <= 1, "Only one image can be uploaded.")
    //     .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE || files?.length === 0, `Max file size is 5MB.`)
    //     .refine(
    //         (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type) || files?.length === 0,
    //         ".jpg, .jpeg, .png, .webp and .svg files are accepted."
    //     ).optional(),
});

const EditQuicklinkForm: React.FC<{
    id: string,
    title: string,
    url: string,
    icon?: string
}> = ({ id, title, url, icon }) => {
    const { updateQuickLink } = useSidebar();
    // const [iconPreview, setIconPreview] = useState<string | null>(icon || null);

    const form = useForm<z.infer<typeof editQuicklinkSchema>>({
        resolver: zodResolver(editQuicklinkSchema),
        defaultValues: {
            title,
            url,
        },
    });

    async function onSubmit(values: z.infer<typeof editQuicklinkSchema>) {
        try {
            await updateQuickLink(id, {
                id,
                title: values.title,
                url: values.url,
                // icon: icon // Keep the existing icon if not changed
            }/* , values.icon?.[0] */);
            toast.success('Quicklink updated successfully');
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        }
    }

    // const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = e.target.files?.[0];
    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             setIconPreview(reader.result as string);
    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         setIconPreview(icon || null);
    //     }
    // };

    return (
        <>
            <DialogHeader>
                <DialogTitle className='text-light-1 text-3xl font-bold tracking-tight mb-2'>Edit Quick Link</DialogTitle>
                <DialogDescription className='text-light-3/80 text-base font-medium tracking-wide'>
                    Update your quick link information and settings.
                </DialogDescription>
            </DialogHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-6 pt-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-light-1 text-xl font-semibold tracking-wide'>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter a memorable name for your quick link"
                                        aria-label="Title"
                                        className="bg-dark-2/80 border-dark-3/50 text-light-1 placeholder-light-4/70 focus:border-theme-primary/50 focus:ring-theme-primary/20 text-base font-medium py-3 px-4"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='font-medium text-theme-error' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='url'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className='text-light-1 text-xl font-semibold tracking-wide'>Website URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type='url'
                                        placeholder="https://example.com"
                                        aria-label="URL"
                                        className="bg-dark-2/80 border-dark-3/50 text-light-1 placeholder-light-4/70 focus:border-theme-primary/50 focus:ring-theme-primary/20 text-base font-medium py-3 px-4"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='font-medium text-theme-error' />
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
                                <div className="flex justify-center mt-4">
                                    {iconPreview && (
                                        <Image
                                            src={iconPreview}
                                            alt="Icon preview"
                                            width={100}
                                            height={100}
                                            className="object-cover rounded-md"
                                        />
                                    )}
                                </div>
                                <FormMessage className='font-medium' />
                            </FormItem>
                        )}
                    /> */}
                    <Button type='submit' className="w-full bg-theme-primary/90 hover:bg-theme-primary text-white font-bold text-lg py-4 transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl tracking-wide">
                        Update Quick Link
                    </Button>
                </form>
            </Form>
        </>
    )
}

export default EditQuicklinkForm

