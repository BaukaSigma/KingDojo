import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";

export const revalidate = 60;

export default async function AppNewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: news } = await supabase
        .from("app_news")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!news) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <NavBar />
            <div className="pt-24 pb-20 container mx-auto px-4 max-w-3xl">
                <div className="mb-4 text-sm text-neutral-400">
                    {new Date(news.published_at).toLocaleDateString('ru-RU')}
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 leading-none">
                    {news.title}
                </h1>

                <div className="relative aspect-video bg-neutral-100 rounded-xl overflow-hidden mb-12 shadow-sm">
                    <SafeImage
                        src={news.cover_image}
                        alt={news.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="prose prose-neutral prose-lg max-w-none">
                    <p className="whitespace-pre-wrap">{news.content}</p>
                </div>

                {/* Gallery Support could be added here if needed */}
            </div>
            <Footer />
        </main>
    );
}
