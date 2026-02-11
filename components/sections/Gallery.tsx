"use client";

import { SectionShell } from "@/components/SectionShell";
import { Button } from "@/components/ui/button";
import { Link } from "lucide-react"; // Import icon only if used, else use next/link later
import NextLink from "next/link"; // Rename to avoid conflict if needed

export function Gallery() {
    return (
        <SectionShell id="gallery" theme="dark">
            <div className="container mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 text-white">
                        Галерея
                    </h2>
                    <div className="h-1 w-24 bg-primary mx-auto" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                        <div key={item} className="aspect-square bg-neutral-800 rounded-xl border border-white/10 relative overflow-hidden group">
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 font-bold text-xl group-hover:bg-white/5 transition-colors">
                                IMG {item}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <NextLink href="#">
                        <Button variant="outline" className="uppercase font-bold tracking-widest px-8 py-6 rounded-none border-white/20 text-white hover:bg-white hover:text-black transition-all">
                            Смотреть все
                        </Button>
                    </NextLink>
                </div>
            </div>
        </SectionShell>
    );
}
