import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";
import Link from "next/link";
import { SectionShell } from "@/components/SectionShell";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

// Revalidating regularly to keep news fresh
export const revalidate = 60;

export default async function NewsPage() {
    const supabase = await createClient();
    const { data: news } = await supabase
        .from("news")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

    return (
        <main className="min-h-screen bg-background text-foreground">
            <NavBar />
            <div className="pt-24 pb-12 container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-12">Мероприятия</h1>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {news?.map((item) => (
                        <Link key={item.id} href={`/news/${item.slug}`} className="group block">
                            <div className="relative aspect-[4/3] bg-neutral-100 rounded-lg overflow-hidden mb-4 border border-border group-hover:border-primary/50 transition-colors">
                                <SafeImage
                                    src={item.cover_image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    {new Date(item.published_at).toLocaleDateString('ru-RU')}
                                </p>
                                <h2 className="text-xl font-bold uppercase group-hover:text-primary transition-colors line-clamp-2">
                                    {item.title}
                                </h2>
                            </div>
                        </Link>
                    ))}
                    {(!news || news.length === 0) && (
                        <p className="text-muted-foreground col-span-full py-12 text-center text-lg">
                            Новостей пока нет.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
