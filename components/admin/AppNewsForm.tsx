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
    excerpt: z.string().optional(),
    content: z.string().optional(),
    cover_image: z.string().optional(),
    gallery: z.array(z.string()).optional(),
    is_published: z.boolean().default(false),
    published_at: z.string().optional(),
});

interface AppNewsFormProps {
    initialData?: any;
}

export function AppNewsForm({ initialData }: AppNewsFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as any),
        defaultValues: initialData ? {
            ...initialData,
            gallery: initialData.gallery || [],
            published_at: initialData.published_at ? new Date(initialData.published_at).toISOString().slice(0, 16) : ""
        } : {
            title: "",
            slug: "",
            excerpt: "",
            content: "",
            cover_image: "",
            gallery: [],
            is_published: false,
            published_at: "",
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
                published_at: values.published_at ? new Date(values.published_at).toISOString() : null
            };

            if (initialData) {
                const { error } = await supabase
                    .from("app_news")
                    .update(payload)
                    .eq("id", initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("app_news")
                    .insert([payload]);
                if (error) throw error;
            }

            toast({ title: "Успех", description: "Новость сохранена" });
            router.push("/admin/app_news");
            router.refresh();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Ошибка", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Назад
                </Button>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                    {initialData ? "Редактировать новость" : "Новая новость"}
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
                                        <FormLabel className="text-neutral-400">Заголовок</FormLabel>
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
                                name="published_at"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Дата публикации</FormLabel>
                                        <FormControl>
                                            <Input type="datetime-local" disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
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
                                            <FormLabel className="text-base text-neutral-200">Опубликовано</FormLabel>
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
                                        <FormLabel className="text-neutral-400">Обложка</FormLabel>
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
                                        <FormLabel className="text-neutral-400">Галерея</FormLabel>
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
                        name="excerpt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-neutral-400">Краткое описание</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white min-h-[80px]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-neutral-400">Описание / Контент</FormLabel>
                                <FormControl>
                                    <Textarea disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white min-h-[200px]" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button disabled={loading} className="w-full md:w-auto bg-primary text-white hover:bg-primary/90" type="submit">
                        {initialData ? "Сохранить изменения" : "Создать новость"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
