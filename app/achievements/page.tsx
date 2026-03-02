import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import Link from "next/link";

export const revalidate = 60;

export default async function AchievementsPage() {
    const supabase = await createClient();
    const { data: achievements } = await supabase
        .from("achievements")
        .select("*")
        .eq("is_published", true)
        .order("date", { ascending: false });

    return (
        <main className="min-h-screen bg-background text-foreground">
            <NavBar />
            <div className="pt-24 pb-12 container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Достижения</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mb-12">
                    Гордость нашего клуба. Путь к вершине, вымощенный трудом и дисциплиной.
                </p>

                <div className="grid md:grid-cols-2 gap-12">
                    {achievements?.map((item) => (
                        <Link href={`/achievements/${item.slug}`} key={item.id} className="block group">
                            <div className="flex flex-col md:flex-row gap-6 border border-border p-6 rounded-2xl bg-card transition-colors hover:border-primary/50 hover:bg-neutral-900/50">
                                <div className="w-full md:w-48 aspect-square relative rounded-lg overflow-hidden shrink-0">
                                    <SafeImage
                                        src={item.cover_image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="flex flex-col justify-center">
                                    <span className="text-primary font-bold uppercase text-sm mb-2">
                                        {new Date(item.date).getFullYear()}
                                    </span>
                                    <h2 className="text-2xl font-bold uppercase mb-4 group-hover:text-primary transition-colors">{item.title}</h2>
                                    <p className="text-muted-foreground text-sm line-clamp-4">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {(!achievements || achievements.length === 0) && (
                        <p className="text-muted-foreground col-span-full py-12 text-center text-lg">
                            Список достижений обновляется.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
