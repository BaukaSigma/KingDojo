"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Coach } from "@/lib/types";

export default function AdminCoachesPage() {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        fetchCoaches();
    }, []);

    const fetchCoaches = async () => {
        const { data, error } = await supabase
            .from("coaches")
            .select("*")
            .order("display_order", { ascending: true });

        if (!error && data) {
            setCoaches(data);
        }
        setLoading(false);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Вы уверены, что хотите удалить этого тренера?")) return;

        const { error } = await supabase.from("coaches").delete().eq("id", id);
        if (!error) {
            fetchCoaches();
        }
    };

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black uppercase text-white mb-2 flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        Тренеры
                    </h1>
                    <p className="text-neutral-400">Управление тренерским составом</p>
                </div>
                <Link href="/admin/coaches/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить тренера
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-white">Загрузка...</div>
            ) : (
                <div className="grid gap-4">
                    {coaches.map((coach) => (
                        <div
                            key={coach.id}
                            className="bg-neutral-900 border border-white/5 p-4 rounded-lg flex items-center gap-6 group hover:border-primary/50 transition-colors"
                        >
                            <div className="relative w-24 h-24 bg-black rounded-md overflow-hidden shrink-0 border border-white/10">
                                {coach.image_url ? (
                                    <Image
                                        src={coach.image_url}
                                        alt={coach.full_name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-700">
                                        No Image
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-xl font-bold text-white truncate">
                                        {coach.full_name}
                                    </h3>
                                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold uppercase rounded-sm border border-primary/20">
                                        {coach.rank}
                                    </span>
                                </div>
                                <p className="text-sm text-neutral-400 font-medium uppercase tracking-wide mb-1">
                                    {coach.role}
                                </p>
                                <p className="text-sm text-neutral-500 truncate">
                                    {coach.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link href={`/admin/coaches/${coach.id}`}>
                                    <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleDelete(coach.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {coaches.length === 0 && (
                        <div className="text-center py-20 bg-neutral-900/50 rounded-lg border border-white/5 border-dashed">
                            <p className="text-neutral-500 mb-4">Список тренеров пуст</p>
                            <Link href="/admin/coaches/new">
                                <Button variant="outline" className="text-white border-white/10 hover:bg-white/5">
                                    Добавить первого тренера
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
