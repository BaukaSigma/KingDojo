"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, Plus, Trash2 } from "lucide-react";

const groupSchema = z.object({
    name: z.string().min(1, "Название группы обязательно"),
    time: z.string().min(1, "Время обязательно"),
});

const formSchema = z.object({
    title: z.string().min(1, "Название обязательно (например, 'Лесная Поляна')"),
    subtitle: z.string().min(1, "Адрес обязателен (например, 'Спортивный комплекс «Алан»')"),
    days: z.string().min(1, "Дни недели обязательны"),
    groups: z.array(groupSchema).min(1, "Добавьте хотя бы одну группу"),
    display_order: z.number().default(0),
    is_active: z.boolean().default(true),
});

interface ScheduleFormProps {
    initialData?: any;
}

export function ScheduleForm({ initialData }: ScheduleFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema as any),
        defaultValues: initialData || {
            title: "",
            subtitle: "",
            days: "",
            groups: [{ name: "", time: "" }],
            display_order: 0,
            is_active: true,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "groups",
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const payload = {
                ...values,
                updated_at: new Date().toISOString(),
            };

            if (initialData) {
                const { error } = await supabase
                    .from("schedules")
                    .update(payload)
                    .eq("id", initialData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from("schedules")
                    .insert([payload]);
                if (error) throw error;
            }

            toast({ title: "Успех", description: "График сохранен" });
            router.push("/admin/schedules");
            router.refresh();
        } catch (error: any) {
            toast({ variant: "destructive", title: "Ошибка", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => router.back()} size="sm">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Назад
                </Button>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
                    {initialData ? "Редактировать зал" : "Новый зал (График)"}
                </h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-neutral-900/40 p-6 rounded-lg border border-neutral-800">
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400">Название зала / Район</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Лесная Поляна" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="subtitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400">Точный адрес или название комплекса</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Спортивный комплекс «Алан»" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="days"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-neutral-400">Дни проведения тренировок</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Понедельник / Среда / Пятница" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <FormLabel className="text-neutral-400">Группы и Время</FormLabel>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => append({ name: "", time: "" })}
                                    className="border-neutral-800 text-neutral-300 hover:text-white"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Добавить группу
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="flex gap-4 items-start bg-black/40 p-4 rounded-lg border border-white/5">
                                        <FormField
                                            control={form.control}
                                            name={`groups.${index}.name`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Название группы (напр. Младшая)" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`groups.${index}.time`}
                                            render={({ field }) => (
                                                <FormItem className="flex-1">
                                                    <FormControl>
                                                        <Input placeholder="Время (напр. 20:00 - 21:00)" {...field} className="bg-neutral-900 border-neutral-800 text-white" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        {fields.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 shrink-0"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="display_order"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel className="text-neutral-400">Порядок сортировки</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                disabled={loading}
                                                {...field}
                                                onChange={e => onChange(parseInt(e.target.value) || 0)}
                                                className="bg-neutral-900 border-neutral-800 text-white"
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-neutral-800 p-4 bg-neutral-900 mt-6">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base text-neutral-200">Активно</FormLabel>
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

                    </div>

                    <Button disabled={loading} className="w-full bg-primary text-white hover:bg-primary/90" type="submit">
                        {initialData ? "Сохранить изменения" : "Создать зал"}
                    </Button>
                </form>
            </Form>
        </div>
    );
}
