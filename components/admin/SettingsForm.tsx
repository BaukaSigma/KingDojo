"use client";

import { useState } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Instagram, Youtube, Send, Phone } from "lucide-react";

// Helper to handle JSONB social links
const socialLinksSchema = z.object({
    instagram: z.string().optional(),
    telegram: z.string().optional(),
    youtube: z.string().optional(),
    tiktok: z.string().optional(),
    whatsapp: z.string().optional(),
});

const formSchema = z.object({
    phone: z.string().optional(),
    address: z.string().optional(),
    social_links: socialLinksSchema,
});

interface SettingsFormProps {
    initialData?: any;
}

export function SettingsForm({ initialData }: SettingsFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as any),
        defaultValues: {
            phone: initialData?.phone || "",
            address: initialData?.address || "",
            social_links: initialData?.social_links || {
                instagram: "",
                telegram: "",
                youtube: "",
                tiktok: "",
                whatsapp: "",
            },
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                updated_at: new Date().toISOString(),
            };

            // Upsert on ID 1
            const { error } = await supabase
                .from("settings")
                .upsert({ id: 1, ...payload });

            if (error) throw error;

            toast({ title: "Success", description: "Settings saved" });
            router.refresh();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <h1 className="text-3xl font-black text-white tracking-tight uppercase">Настройки</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-neutral-900/40 p-6 rounded-lg border border-neutral-800">

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white">Contacts</h2>
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400">Phone Display</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="+7 (700) 123-45-67" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400">Address</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-white">Social Links</h2>

                        <FormField
                            control={form.control}
                            name="social_links.instagram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400 flex items-center gap-2"><Instagram size={14} /> Instagram URL</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="social_links.telegram"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400 flex items-center gap-2"><Send size={14} /> Telegram Username (no @)</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="social_links.youtube"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400 flex items-center gap-2"><Youtube size={14} /> YouTube URL</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="social_links.whatsapp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400 flex items-center gap-2"><Phone size={14} /> WhatsApp Number (Digits)</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <Button disabled={loading} className="bg-primary text-white hover:bg-primary/90" type="submit">
                        Save Settings
                    </Button>
                </form>
            </Form>
        </div>
    );
}
