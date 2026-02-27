"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Schedule } from "@/lib/types";

interface SchedulesClientProps {
    initialSchedules: Schedule[];
}

export function SchedulesClient({ initialSchedules }: SchedulesClientProps) {
    const router = useRouter();
    const supabase = createClient();
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm("Удалить этот зал из графика?")) return;

        const { error } = await supabase.from("schedules").delete().eq("id", id);
        if (error) {
            toast({ variant: "destructive", title: "Ошибка", description: error.message });
        } else {
            toast({ title: "Удалено" });
            router.refresh();
        }
    };

    const columns = [
        {
            header: "Зал / Район",
            accessorKey: "title" as keyof Schedule,
            cell: (item: Schedule) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="text-xs text-neutral-500">{item.subtitle}</span>
                </div>
            )
        },
        {
            header: "Дни",
            accessorKey: "days" as keyof Schedule,
            className: "hidden md:table-cell text-neutral-400"
        },
        {
            header: "Группы",
            cell: (item: Schedule) => (
                <span className="text-sm font-mono text-neutral-300">
                    {item.groups?.length || 0} групп(ы)
                </span>
            )
        },
        {
            header: "Статус",
            cell: (item: Schedule) => (
                <span className={`text-xs px-2 py-1 rounded border ${item.is_active ? "border-green-900 bg-green-900/20 text-green-400" : "border-neutral-800 bg-neutral-900 text-neutral-500"}`}>
                    {item.is_active ? "Активен" : "Скрыт"}
                </span>
            )
        },
        {
            header: "Сортировка",
            accessorKey: "display_order" as keyof Schedule,
            className: "text-center hidden sm:table-cell"
        },
        {
            header: "Действия",
            cell: (item: Schedule) => (
                <div className="flex items-center gap-2">
                    <Link href={`/admin/schedules/${item.id}`}>
                        <Button variant="outline" size="icon" className="h-8 w-8 border-neutral-800 bg-neutral-900 hover:bg-primary hover:text-white">
                            <Pencil className="h-4 w-4" />
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 border-neutral-800 bg-neutral-900 hover:bg-destructive hover:text-white"
                        onClick={() => handleDelete(item.id)}
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">График</h1>
                    <p className="text-neutral-500">Управление расписанием и залами</p>
                </div>
                <Link href="/admin/schedules/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={initialSchedules} searchKey="title" />
        </div>
    );
}
