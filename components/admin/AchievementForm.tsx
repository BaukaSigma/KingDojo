"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required"),
    description: z.string().optional(),
    date: z.string().min(1, "Date is required"), // date string yyyy-mm-dd
    cover_image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    is_published: z.boolean().default(true),
});

interface AchievementFormProps {
    initialData?: any;
}

export function AchievementForm({ initialData }: AchievementFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as any),
        defaultValues: initialData || {
            title: "",
            slug: "",
            description: "",
            date: new Date().toISOString().slice(0, 10),
            cover_image: "",
            gallery: [],
            is_published: true,
        },
    });

    const { watch, setValue } = form;
    const titleValue = watch("title");

    useEffect(() => {
        if (!initialData && titleValue && !watch("slug")) {
            const slug = titleValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setValue("slug", slug);
        }
    }, [titleValue, initialData, setValue, watch]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                updated_at: new Date().toISOString(),
            };

            if (initialData) {
                const { error } = await supabase
                    .from("achievements")
                    .update(payload)
                    .eq("id", initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("achievements")
                    .insert([payload]);
                if (error) throw error;
            }

            toast({ title: "Success", description: "Achievement saved" });
            router.push("/admin/achievements");
            router.refresh();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                    {initialData ? "Edit Achievement" : "Create Achievement"}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-neutral-900/40 p-6 rounded-lg border border-neutral-800">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Title</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="slug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Slug</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-neutral-300 font-mono text-sm" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Event Date</FormLabel>
                                        <FormControl>
                                            <Input type="date" disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_published"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-neutral-800 p-4 bg-neutral-900">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base text-neutral-200">Published</FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="cover_image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Cover Image</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value ? [field.value] : []}
                                                disabled={loading}
                                                onChange={(url) => field.onChange(url[0])}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="gallery"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Gallery</FormLabel>
                                        <FormControl>
                                            <ImageUpload
                                                value={field.value || []}
                                                disabled={loading}
                                                multiple
                                                onChange={(urls) => field.onChange(urls)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-neutral-400">Description</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white min-h-[150px]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={loading} className="w-full md:w-auto bg-primary text-white hover:bg-primary/90" type="submit">
                        {initialData ? "Save Changes" : "Create Achievement"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
