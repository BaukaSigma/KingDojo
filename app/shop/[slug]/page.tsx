import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { MessageCircle, Send } from "lucide-react";
import ClientMessageButtons from "./components/ClientMessageButtons"; // Extract client logic

export const revalidate = 60;

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const supabase = await createClient();

    // Fetch product
    const { data: product } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

    if (!product) {
        notFound();
    }

    // Fetch settings for phone numbers
    const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .single();

    return (
        <main className="min-h-screen bg-background text-foreground">
            <NavBar />
            <div className="pt-24 pb-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
                    {/* Image Gallery (Simple for MVP: Just main image) */}
                    <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-neutral-100">
                        <SafeImage
                            src={product.image_url || product.images?.[0]}
                            alt={product.title}
                            fill
                            className="object-contain mix-blend-multiply p-8"
                        />
                    </div>

                    {/* Details */}
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">{product.title}</h1>
                        <p className="text-3xl font-bold text-primary mb-8">{product.price.toLocaleString()} ₸</p>

                        <div className="prose prose-neutral mb-10 max-w-none">
                            <p className="whitespace-pre-line">{product.description}</p>
                        </div>

                        <div className="space-y-4">
                            <ClientMessageButtons
                                title={product.title}
                                price={product.price}
                                slug={product.slug}
                                whatsappPhone={settings?.whatsapp_phone}
                                telegramUser={settings?.telegram_username}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
