import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";

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
            <div className="pt-24 pb-20 container mx-auto px-4 max-w-3xl">
                <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4 leading-none">
                    {achievement.title}
                </h1>
                <div className="mb-8 font-bold text-primary uppercase tracking-widest">
                    {new Date(achievement.date).getFullYear()} год
                </div>

                <div className="relative aspect-video bg-neutral-100 rounded-xl overflow-hidden mb-12 shadow-sm">
                    <SafeImage
                        src={achievement.cover_image}
                        alt={achievement.title}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="prose prose-neutral prose-lg max-w-none">
                    <p className="whitespace-pre-wrap">{achievement.description}</p>
                </div>
            </div>
            <Footer />
        </main>
    );
}
