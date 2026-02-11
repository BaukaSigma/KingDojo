"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

interface NewsItem {
    id: string;
    title: string;
    slug: string;
    is_published: boolean;
    published_at: string;
    updated_at: string;
}

interface NewsClientProps {
    initialNews: NewsItem[];
}

export function NewsClient({ initialNews }: NewsClientProps) {
    const router = useRouter();
    const supabase = createClient();
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this news item?")) return;

        const { error } = await supabase.from("news").delete().eq("id", id);
        if (error) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } else {
            toast({ title: "Deleted" });
            router.refresh();
        }
    };

    const columns = [
        {
            header: "Title",
            accessorKey: "title" as keyof NewsItem,
            cell: (item: NewsItem) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="text-xs text-neutral-500">{item.slug}</span>
                </div>
            )
        },
        {
            header: "Status",
            cell: (item: NewsItem) => (
                <span className={`text-xs px-2 py-1 rounded border ${item.is_published ? "border-green-900 bg-green-900/20 text-green-400" : "border-neutral-800 bg-neutral-900 text-neutral-500"}`}>
                    {item.is_published ? "Published" : "Draft"}
                </span>
            )
        },
        {
            header: "Date",
            cell: (item: NewsItem) => item.published_at ? new Date(item.published_at).toLocaleDateString() : "-",
            className: "text-neutral-500"
        },
        {
            header: "Actions",
            cell: (item: NewsItem) => (
                <div className="flex items-center gap-2">
                    <Link href={`/admin/news/${item.id}`}>
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
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Мероприятия</h1>
                    <p className="text-neutral-500">Управление мероприятиями</p>
                </div>
                <Link href="/admin/news/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={initialNews} searchKey="title" />
        </div>
    );
}
