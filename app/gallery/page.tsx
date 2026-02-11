import { createClient } from "@/lib/supabase/server";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { GalleryContent } from "@/components/gallery/GalleryContent";

// Revalidate once per minute
export const revalidate = 60;

export default async function GalleryPage() {
    const supabase = await createClient();
    const { data: items } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <main className="min-h-screen bg-[#0B0B0B] text-white">
            <NavBar />
            <div className="pt-32 pb-12 container mx-auto px-4">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        Галерея
                    </h1>
                    <p className="text-xl text-neutral-400 max-w-2xl mx-auto font-light">
                        Моменты из жизни нашего клуба. Тренировки, соревнования, победы.
                    </p>
                </div>

                <GalleryContent items={items || []} />
            </div>
            <Footer />
        </main>
    );
}
