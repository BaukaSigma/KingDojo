import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const revalidate = 60;

export default async function AchievementDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    const { data: achievement } = await supabase
        .from("achievements")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!achievement) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-foreground">
            <NavBar />
            <div className="pt-24 pb-20 container mx-auto px-4 max-w-4xl">
                <Link href="/achievements" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Назад к достижениям
                </Link>

                <div className="mb-4 text-primary font-bold uppercase tracking-wider">
                    {new Date(achievement.date).getFullYear()}
                </div>
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-8 leading-none">
                    {achievement.title}
                </h1>

                {achievement.cover_image && (
                    <div className="relative aspect-auto min-h-[400px] w-full bg-neutral-900 rounded-xl overflow-hidden mb-12 shadow-sm border border-neutral-800">
                        <SafeImage
                            src={achievement.cover_image}
                            alt={achievement.title}
                            fill
                            className="object-contain"
                        />
                    </div>
                )}

                <div className="prose prose-neutral prose-invert prose-lg max-w-none text-neutral-300">
                    <p className="whitespace-pre-wrap">{achievement.description}</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
