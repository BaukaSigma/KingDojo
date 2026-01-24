import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SectionShell } from "@/components/SectionShell";
import { createClient } from "@/lib/supabase/server";
import { Coach } from "@/lib/types";
import Image from "next/image";
import { Instagram } from "lucide-react";
import Link from "next/link";

export const revalidate = 60;

// Reusing the parallax concept but for a list
export default async function CoachesPage() {
    const supabase = await createClient();
    const { data: coaches } = await supabase
        .from("coaches")
        .select("*")
        .order("display_order", { ascending: true });

    if (!coaches || coaches.length === 0) {
        return (
            <main className="min-h-screen bg-black text-white flex items-center justify-center">
                <NavBar />
                <div className="text-center">
                    <h1 className="text-4xl font-black uppercase mb-4">Тренеры не найдены</h1>
                    <p className="text-neutral-500">Добавьте тренеров через админ-панель.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0B0B0B] text-white">
            <NavBar />

            {/* Header */}
            <div className="pt-32 pb-12 container mx-auto px-4 text-center">
                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 mb-6">
                    Наши <span className="text-primary">Тренеры</span>
                </h1>
                <p className="text-neutral-400 uppercase tracking-widest text-sm max-w-2xl mx-auto">
                    Команда профессионалов, воспитывающая чемпионов в спорте и в жизни
                </p>
            </div>

            <div className="flex flex-col">
                {coaches.map((coach, index) => (
                    <CoachSection key={coach.id} coach={coach} index={index} />
                ))}
            </div>

            <Footer />
        </main>
    );
}

function CoachSection({ coach, index }: { coach: Coach; index: number }) {
    const isEven = index % 2 === 0;

    return (
        <section className="min-h-screen relative flex items-center overflow-hidden border-t border-white/5 bg-[#0B0B0B]">
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${isEven ? 'from-black to-neutral-900' : 'from-neutral-900 to-black'} opacity-50`} />

            <div className="container mx-auto px-4 relative z-10 py-20 flex flex-col md:flex-row items-center gap-12 lg:gap-24">

                {/* Image Side */}
                <div className={`w-full md:w-1/2 relative h-[500px] md:h-[800px] ${isEven ? 'md:order-1' : 'md:order-2'}`}>
                    <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
                    <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0B0B0B] via-transparent to-transparent opacity-50" />

                    {coach.image_url && (
                        <div className="relative w-full h-full grayscale-[20%] contrast-110 hover:grayscale-0 transition-all duration-700">
                            <Image
                                src={coach.image_url}
                                alt={coach.full_name}
                                fill
                                className="object-cover object-top"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </div>
                    )}

                    {/* Brutalist Decor */}
                    <div className={`absolute -bottom-10 ${isEven ? '-left-10' : '-right-10'} w-40 h-40 border-[20px] border-primary/20 z-0 hidden md:block`} />
                </div>

                {/* Text Side */}
                <div className={`w-full md:w-1/2 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter leading-[0.9] mb-4">
                                {coach.full_name.split(" ").map((word, i) => (
                                    <span key={i} className="block">
                                        {i === 1 ? <span className="text-primary">{word}</span> : word}
                                    </span>
                                ))}
                            </h2>
                            <p className="text-xl text-neutral-400 font-bold uppercase tracking-widest flex items-center gap-4">
                                {coach.role}
                                <span className="w-12 h-[1px] bg-primary"></span>
                                {coach.rank}
                            </p>
                        </div>

                        <div className="w-full h-[1px] bg-white/10" />

                        <div className="space-y-6">
                            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed font-light">
                                {coach.description}
                            </p>

                            {coach.experience && (
                                <div className="inline-block px-4 py-2 bg-white/5 border border-white/10 rounded uppercase text-sm font-bold tracking-wider text-neutral-300">
                                    Опыт работы: <span className="text-white">{coach.experience}</span>
                                </div>
                            )}

                            {coach.instagram && (
                                <div className="pt-4">
                                    <Link
                                        href={coach.instagram}
                                        target="_blank"
                                        className="inline-flex items-center gap-3 text-neutral-400 hover:text-[#E1306C] transition-colors group"
                                    >
                                        <div className="p-3 bg-white/5 rounded-full group-hover:bg-[#E1306C]/10 transition-colors">
                                            <Instagram className="w-6 h-6" />
                                        </div>
                                        <span className="uppercase font-bold tracking-wider text-sm">Instagram</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
