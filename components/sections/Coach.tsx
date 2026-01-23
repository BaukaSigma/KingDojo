"use client";

import { SectionShell } from "@/components/SectionShell";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Coach() {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <SectionShell id="coach" theme="light">
            <div ref={ref} className="grid md:grid-cols-2 gap-16 lg:gap-24 items-center">
                {/* Sticky Image Column */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="relative md:sticky md:top-24 h-[600px] w-full bg-neutral-100 rounded-2xl overflow-hidden border border-black/5"
                >
                    <motion.div style={{ y }} className="absolute inset-0 w-full h-[120%] -top-[10%]">
                        <Image
                            src="/images/sections/coach.jpg"
                            alt="Санжар Кине"
                            fill
                            className="object-cover opacity-90 grayscale-[20%]"
                        />
                    </motion.div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <motion.h3
                            initial={{ y: 20, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-black uppercase text-white mb-2 tracking-tight"
                        >
                            Санжар Кине
                        </motion.h3>
                        <p className="text-primary text-xl font-bold uppercase tracking-widest">Главный тренер • 2 Дан</p>
                    </div>
                </motion.div>

                {/* Content Column */}
                <div className="flex flex-col justify-center py-10 relative">
                    <div className="absolute -left-12 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-neutral-900/10 to-transparent hidden md:block" />

                    <motion.h2
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-5xl md:text-8xl font-black uppercase tracking-tight mb-8 text-neutral-900 leading-none"
                    >
                        Наставник <br /> Чемпионов
                    </motion.h2>

                    <blockquote className="border-l-4 border-primary pl-8 mb-12 italic text-2xl md:text-3xl text-neutral-700 font-light">
                        «Каратэ — это не только победы на татами, это путь воспитания <span className="text-primary font-bold">характера</span>, силы духа и уважения.»
                    </blockquote>

                    <div className="space-y-6 text-lg text-neutral-600 font-light leading-relaxed">
                        <p>
                            <strong className="text-neutral-900 font-bold">Санжар Кине</strong> — основатель и главный тренер King Dojo.
                            Обладатель черного пояса (2 Дан) и тренер национального уровня с многолетним опытом.
                        </p>
                        <p>
                            Его методика сочетает традиционные ценности боевых искусств с современным подходом к спортивной подготовке.
                            Как наставник, он стремится раскрыть потенциал каждого ученика, воспитывая не просто спортсменов, но и достойных людей.
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-6">
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-neutral-100 border border-neutral-200 p-6 rounded-xl text-center hover:bg-neutral-200/50 transition-colors">
                            <span className="block text-5xl font-black text-primary mb-2">2 Дан</span>
                            <span className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Мастерская степень</span>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.02 }} className="bg-neutral-100 border border-neutral-200 p-6 rounded-xl text-center hover:bg-neutral-200/50 transition-colors">
                            <span className="block text-5xl font-black text-primary mb-2">10+</span>
                            <span className="text-xs uppercase font-bold text-neutral-500 tracking-widest">Лет опыта</span>
                        </motion.div>
                    </div>
                </div>
            </div>
        </SectionShell>
    );
}
