"use client";

import { SectionShell } from "@/components/SectionShell";
import Image from "next/image";
import { motion } from "framer-motion";

export function About() {
    return (
        <>
            {/* About Club */}
            <SectionShell id="about" theme="light">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-neutral-900">
                            О Клубе
                        </h2>
                        <div className="space-y-6 text-lg md:text-xl text-neutral-600 leading-relaxed font-light">
                            <p>
                                <strong className="text-neutral-900">King Dojo</strong> — профессиональный клуб боевых искусств,
                                работающий под эгидой <span className="text-primary font-bold">King Dojo Federation Enshin Karate</span>.
                            </p>
                            <p>
                                Клуб открыт для детей и подростков. Наша цель — не только спортивные результаты,
                                но и всестороннее развитие каждого ученика. Мы учим дисциплине, уважению и уверенности в себе.
                            </p>
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-[4/5] bg-neutral-200 rounded-2xl overflow-hidden border border-neutral-300/20">
                        <Image
                            src="/images/hero/club.jpg"
                            alt="Training"
                            fill
                            className="object-cover"
                        />
                    </div>
                </div>
            </SectionShell>

            {/* Approach */}
            <SectionShell id="approach" theme="dark" className="border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
                            Наш Подход
                        </h2>
                        <div className="h-1 w-24 bg-primary mx-auto" />
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Техника", desc: "Базовая и продвинутая техника Enshin Karate, эффективная самооборона и тактическое мышление.", delay: 0 },
                            { title: "Дисциплина", desc: "Воспитание сильного характера, уважения к старшим и соперникам, самоконтроль.", delay: 0.1 },
                            { title: "Физподготовка", desc: "Развитие силы, выносливости, гибкости и координации. Безопасные и эффективные тренировки.", delay: 0.2 },
                            { title: "Развитие", desc: "Индивидуальное внимание каждому ученику и поэтапный рост от новичка до чемпиона.", delay: 0.3 }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: item.delay, duration: 0.5 }}
                                viewport={{ once: true }}
                                className="group relative p-8 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <h3 className="relative z-10 text-primary text-2xl font-black uppercase mb-4 tracking-wide group-hover:translate-x-1 transition-transform">{item.title}</h3>
                                <p className="relative z-10 text-white/60 group-hover:text-white transition-colors">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </SectionShell>
        </>
    );
}
