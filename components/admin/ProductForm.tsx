"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
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
    price: z.coerce.number().min(0),
    currency: z.string().default("KZT"),
    description: z.string().optional(),
    category: z.string().optional(),
    is_active: z.boolean().default(true),
    image_url: z.string().optional(), // Main image (single URL, but logic might treat as one of array)
    gallery: z.array(z.string()).optional(),
    sizes: z.string().optional(), // Store as comma separated or JSON string
});

interface ProductFormProps {
    initialData?: any;
}

export function ProductForm({ initialData }: ProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as any),
        defaultValues: initialData || {
            title: "",
            slug: "",
            price: 0,
            currency: "KZT",
            description: "",
            category: "uniform",
            is_active: true,
            image_url: "",
            gallery: [],
        },
    });

    // Auto-generate slug from title if slug is empty
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

            // Convert sizes string to array if needed to store in JSON/Array column, 
            // but schema says `sizes` is not a column in first migration overview.
            // Wait, schema has `images text[]`. `image_url` is text.
            // I'll stick to simple fields for now.
            // If `gallery` is text[], and `images` is what I used in schema...
            // Checking schema from init.sql:
            // images text[] default '{}'
            // No explicit 'gallery' column in products table?
            // "images text[]" usually serves as gallery.
            // "image_url" might be main image.
            // init.sql: `images text[]`, no `image_url` column in products!
            // Wait, I saw `image_url TEXT` in `supabase_setup_fixed.sql` earlier.
            // Let's assume `image_url` and `gallery` for now as separate or mapped.
            // Based on `supabase_setup_fixed.sql`: `image_url TEXT`, `gallery TEXT[]`.

            const payload = {
                ...values,
                updated_at: new Date().toISOString(),
            };

            if (initialData) {
                const { error } = await supabase
                    .from("products")
                    .update(payload)
                    .eq("id", initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("products")
                    .insert([payload]);
                if (error) throw error;
            }

            toast({ title: "Success", description: "Product saved" });
            router.push("/admin/products");
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
                    {initialData ? "Edit Product" : "Create Product"}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-neutral-900/40 p-6 rounded-lg border border-neutral-800">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Title</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="Product Name" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
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
                                        <FormLabel className="text-neutral-400">Slug (URL)</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="product-slug" {...field} className="bg-neutral-900 border-neutral-800 text-neutral-300 font-mono text-sm" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-400">Price</FormLabel>
                                            <FormControl>
                                                <Input type="number" disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="currency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-neutral-400">Currency</FormLabel>
                                            <FormControl>
                                                <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Category</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="e.g. Uniform" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-neutral-800 p-4 bg-neutral-900">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base text-neutral-200">Active Status</FormLabel>
                                            <FormDescription className="text-neutral-500">
                                                Product will be visible in the store
                                            </FormDescription>
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

                        {/* Right Column */}
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="image_url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Main Image</FormLabel>
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
                                        <FormLabel className="text-neutral-400">Gallery (Multiple)</FormLabel>
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
                                    <Textarea disabled={loading} placeholder="Product description" {...field} className="bg-neutral-900 border-neutral-800 text-white min-h-[150px]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={loading} className="w-full md:w-auto bg-primary text-white hover:bg-primary/90" type="submit">
                        {initialData ? "Save Changes" : "Create Product"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
