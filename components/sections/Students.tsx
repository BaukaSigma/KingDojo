"use client";

import { SectionShell } from "@/components/SectionShell";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Globe, User, Star } from "lucide-react";
import { motion } from "framer-motion";

export function Students() {
    return (
        <SectionShell id="students" theme="dark">
            <div className="text-center mb-16 relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                <h2 className="relative z-10 text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
                    Наши Ученики
                </h2>
                <p className="relative z-10 text-xl text-white/70 max-w-2xl mx-auto font-light">
                    Мы гордимся каждым учеником. От первых шагов в доджо до пьедесталов мировых арен.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid sm:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
                {[
                    { icon: Globe, title: "Международные", desc: "Участие и победы в турнирах в Японии, Европе и мире." },
                    { icon: Trophy, title: "Чемпионы", desc: "Воспитание чемпионов страны, Европы и мира." },
                    { icon: User, title: "Развитие", desc: "Акцент на личностный рост, дисциплину и командный дух." }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.2 }}
                        whileHover={{ y: -10 }}
                        className="group flex flex-col items-center text-center p-8 border border-white/5 rounded-2xl bg-gradient-to-b from-white/5 to-transparent hover:border-primary/50 transition-all duration-300 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="p-4 rounded-full bg-white/5 mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10">
                            <stat.icon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="relative z-10 text-xl font-black uppercase mb-3 tracking-wide">{stat.title}</h3>
                        <p className="relative z-10 text-sm text-neutral-400 group-hover:text-white transition-colors leading-relaxed">{stat.desc}</p>
                    </motion.div>
                ))}
            </div>

            {/* Testimonials Placeholders */}
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-center gap-4 mb-12">
                    <div className="h-[1px] w-12 bg-white/10" />
                    <h3 className="text-xl font-black uppercase tracking-[0.2em] text-white/50">
                        Отзывы Родителей
                    </h3>
                    <div className="h-[1px] w-12 bg-white/10" />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        {
                            text: "Тренеры — настоящие профессионалы. Сын ходит с удовольствием уже второй год, стал намного собраннее и увереннее в себе.",
                            name: "Родитель",
                            role: "Мама ученика"
                        },
                        {
                            text: "Отличная атмосфера и дисциплина. Заметили, как улучшилась физическая подготовка дочери. Очень рады, что выбрали именно King Dojo.",
                            name: "Родитель",
                            role: "Папа ученика"
                        },
                        {
                            text: "King Dojo — это больше, чем просто секция. Это семья. Ребёнок учится не только драться, но и уважать старших, быть ответственным.",
                            name: "Родитель",
                            role: "Мама ученика"
                        }
                    ].map((review, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            className="bg-neutral-900/50 border border-white/5 p-8 rounded-2xl relative"
                        >
                            <Star className="w-8 h-8 text-primary/20 absolute top-4 right-4" />
                            <p className="italic text-white/60 text-center mb-6 leading-relaxed">
                                “{review.text}”
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-500">
                                    P
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-bold text-white">{review.name}</p>
                                    <p className="text-xs text-primary">{review.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </SectionShell>
    );
}
