import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { SectionShell } from "@/components/SectionShell";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatWhatsAppLink } from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import { MapPin, Clock, Zap, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 60;

export default async function SchedulePage() {
    const settings = await getSettings();
    const whatsappLink = formatWhatsAppLink(settings?.social_links?.whatsapp);

    const supabase = await createClient();
    const { data: rawSchedules } = await supabase
        .from('schedules')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

    // Static colors and benefits to cycle through (maintaining the requested design)
    const staticStyles = [
        {
            benefits: [
                "Развитие силы, выносливости и координации",
                "Подготовка к соревнованиям и спаррингам",
                "Дисциплина, уважение и командный дух"
            ],
            color: "from-blue-500/20 to-blue-600/5",
            borderColor: "border-blue-500/20"
        },
        {
            benefits: [
                "Индивидуальный подход",
                "Развитие техники и реакции",
                "Безопасная и результативная тренировка"
            ],
            color: "from-red-500/20 to-red-600/5",
            borderColor: "border-red-500/20"
        },
        {
            benefits: [
                "Занятия для всех уровней",
                "Основы карате и контроль техники",
                "Формируем уверенность и дисциплину"
            ],
            color: "from-amber-500/20 to-amber-600/5",
            borderColor: "border-amber-500/20"
        }
    ];

    const locations = (rawSchedules || []).map((schedule: any, index: number) => {
        const style = staticStyles[index % staticStyles.length]; // cycle styles if more than 3 schedules exist
        return {
            title: schedule.title,
            subtitle: schedule.subtitle,
            days: schedule.days,
            groups: schedule.groups || [],
            benefits: style.benefits,
            color: style.color,
            borderColor: style.borderColor
        };
    });

    return (
        <main className="min-h-screen bg-black text-white">
            <NavBar />

            <SectionShell id="schedule" theme="dark" className="pt-32 pb-20">
                <div className="text-center mb-16 relative">
                    <h1 className="relative z-10 text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                        График Тренировок
                    </h1>
                    <p className="text-white/60 uppercase tracking-widest text-sm lg:text-base">
                        King Dojo Federation Enshin Karate
                    </p>
                </div>

                <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {locations.map((loc, i) => (
                        <div
                            key={i}
                            className={`group relative overflow-hidden rounded-2xl border ${loc.borderColor} bg-neutral-900/50 p-6 md:p-8 transition-all hover:bg-neutral-900/80 hover:shadow-2xl hover:shadow-primary/5`}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${loc.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            <div className="relative z-10">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-black uppercase leading-tight mb-2 text-white">
                                        {loc.title}
                                    </h2>
                                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wide">
                                        <MapPin className="w-4 h-4" />
                                        {loc.subtitle}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-start gap-3 mb-3 text-white/90">
                                            <Clock className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                            <div>
                                                <p className="font-bold mb-2 uppercase text-sm">{loc.days}</p>
                                                <div className="space-y-1">
                                                    {loc.groups.map((g: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between text-sm text-neutral-400">
                                                            <span>{g.name}:</span>
                                                            <span className="text-white font-mono">{g.time}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {loc.benefits.map((b: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm text-neutral-400">
                                                <Zap className="w-4 h-4 text-primary/50 shrink-0" />
                                                <span>{b}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center space-y-8">
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-primary blur-3xl opacity-20 rounded-full" />
                        <div className="relative bg-neutral-900/80 border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto backdrop-blur-sm">
                            <p className="text-xl md:text-2xl font-bold uppercase mb-2">Количество мест ограничено!</p>
                            <p className="text-neutral-400 mb-8">Запишитесь на пробную тренировку прямо сейчас</p>

                            {whatsappLink ? (
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto inline-block">
                                    <Button className="w-full px-12 py-8 text-xl uppercase font-black tracking-widest bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                                        <span>WhatsApp</span>
                                        <ArrowRight className="w-6 h-6" />
                                    </Button>
                                </a>
                            ) : (
                                <Button disabled className="w-full md:w-auto px-12 py-8 text-xl uppercase font-black tracking-widest bg-neutral-800 text-neutral-500 rounded-xl flex items-center justify-center gap-3">
                                    <span>WhatsApp (Нет номера)</span>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

            </SectionShell>

            <Footer />
        </main>
    );
}
