"use client";

import { DataTable } from "@/components/admin/DataTable";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface Product {
    id: string;
    title: string;
    price: number;
    currency: string;
    is_active: boolean;
    updated_at: string;
    category?: string;
    slug: string;
}

interface ProductsClientProps {
    initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
    const router = useRouter();
    const supabase = createClient();
    const { toast } = useToast();

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        const { error } = await supabase.from("products").delete().eq("id", id);
        if (error) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } else {
            toast({ title: "Product deleted" });
            router.refresh();
        }
    };

    const handleToggleActive = async (product: Product) => {
        const { error } = await supabase
            .from("products")
            .update({ is_active: !product.is_active })
            .eq("id", product.id);

        if (error) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } else {
            router.refresh();
        }
    };

    const columns = [
        {
            header: "Title",
            accessorKey: "title" as keyof Product,
            cell: (item: Product) => (
                <div className="flex flex-col">
                    <span className="font-semibold text-white">{item.title}</span>
                    <span className="text-xs text-neutral-500">{item.slug}</span>
                </div>
            )
        },
        {
            header: "Price",
            cell: (item: Product) => (
                <span className="font-mono">
                    {item.price} {item.currency}
                </span>
            )
        },
        {
            header: "Category",
            accessorKey: "category" as keyof Product,
            className: "hidden md:table-cell"
        },
        {
            header: "Status",
            cell: (item: Product) => (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleActive(item)}
                    className={cn(
                        "h-6 text-xs px-2 border",
                        item.is_active
                            ? "border-green-900 bg-green-900/20 text-green-400 hover:bg-green-900/40"
                            : "border-neutral-800 bg-neutral-900 text-neutral-500 hover:bg-neutral-800"
                    )}
                >
                    {item.is_active ? "Active" : "Hidden"}
                </Button>
            )
        },
        {
            header: "Updated",
            cell: (item: Product) => new Date(item.updated_at).toLocaleDateString("ru-RU"),
            className: "hidden md:table-cell text-sm text-neutral-500"
        },
        {
            header: "Actions",
            cell: (item: Product) => (
                <div className="flex items-center gap-2">
                    <Link href={`/admin/products/${item.id}`}>
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
                    <h1 className="text-3xl font-black text-white tracking-tight uppercase">Товары</h1>
                    <p className="text-neutral-500">Manage your product catalog</p>
                </div>
                <Link href="/admin/products/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold">
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить
                    </Button>
                </Link>
            </div>

            <DataTable columns={columns} data={initialProducts} searchKey="title" />
        </div>
    );
}
