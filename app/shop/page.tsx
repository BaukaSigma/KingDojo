import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export const revalidate = 60;

export default async function ShopPage() {
    const supabase = await createClient();
    const { data: products } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("title");

    return (
        <main className="min-h-screen bg-background text-foreground">
            <NavBar />
            <div className="pt-24 pb-12 container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Магазин</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mb-12">
                    Официальная экипировка King Dojo и Shinkarate.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-12">
                    {products?.map((product) => (
                        <Link key={product.id} href={`/shop/${product.slug}`} className="group block">
                            <div className="relative aspect-[3/4] bg-neutral-100 rounded-xl overflow-hidden mb-4 p-4 border border-border group-hover:border-primary/50 transition-colors">
                                <SafeImage
                                    src={product.image_url || product.images?.[0]}
                                    alt={product.title}
                                    fill
                                    className="object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                            <div>
                                <h3 className="font-bold uppercase mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                                    {product.title}
                                </h3>
                                <p className="text-lg font-medium">
                                    {product.price.toLocaleString()} ₸
                                </p>
                            </div>
                        </Link>
                    ))}
                    {(!products || products.length === 0) && (
                        <p className="text-muted-foreground col-span-full py-12 text-center text-lg">
                            В магазине пока пусто.
                        </p>
                    )}
                </div>
            </div>
            <Footer />
        </main>
    );
}
