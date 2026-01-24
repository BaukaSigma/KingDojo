"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const HERO_IMAGES = [
    "/images/hero/hero-1.jpg",
    "/images/hero/hero-2.jpg",
    "/images/hero/hero-3.jpg",
];

export function Hero() {
    const ref = useRef(null);
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-[#0B0B0B] text-white">
            {/* Background Image with Diagonal Cut */}
            <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 scale-105">
                <Image
                    src="/images/hero/hero-art-final.png"
                    alt="Sanjar Kine - King Dojo"
                    fill
                    className="object-cover object-center opacity-80 grayscale-[20%] contrast-110 saturate-110"
                    priority
                />
            </motion.div>

            {/* Brutalist Overlays */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0B0B0B] via-transparent to-[#0B0B0B]/40" />
            <div className="absolute inset-0 z-10 bg-[linear-gradient(45deg,transparent_45%,#B11217_45%,#B11217_55%,transparent_55%)] opacity-20 mix-blend-overlay scale-150" />

            {/* Diagonal Slash Overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-[#0B0B0B]/20 to-[#0B0B0B]" />

            {/* Content */}
            <div className="container relative z-20 flex flex-col items-center justify-center text-center px-4 h-full pt-20">
                <motion.div style={{ y: y2 }} className="flex flex-col items-center">

                    {/* Main Title - Massive & Brutal */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.9, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-7xl md:text-9xl lg:text-[11rem] leading-[0.85] font-black uppercase tracking-tighter text-white mix-blend-screen relative"
                    >
                        <span className="block relative z-10">King</span>
                        <span className="block text-transparent text-stroke-2 opacity-50 absolute top-1 left-1 z-0" aria-hidden="true">King</span>
                        <span className="block text-primary">Dojo</span>
                    </motion.h1>

                    {/* Subtitle / Philosophy */}
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "200px" }}
                        transition={{ delay: 0.8, duration: 1, ease: "circOut" }}
                        className="h-2 bg-primary mt-8 mb-8 skew-x-[-20deg]"
                    />

                    <motion.p
                        className="text-lg md:text-2xl text-neutral-300 font-bold tracking-[0.3em] uppercase max-w-2xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                    >
                        Путь силы <span className="text-primary mx-2">•</span> Дух победы
                    </motion.p>

                    {/* CTA Button - Sharp & Aggressive */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.4 }}
                        className="mt-12"
                    >
                        <Button
                            size="lg"
                            className="bg-primary hover:bg-[#D4151B] text-white text-xl px-16 py-8 h-auto uppercase tracking-widest font-black rounded-none skew-x-[-15deg] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(177,18,23,0.6)] border-l-4 border-white"
                            onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            <span className="skew-x-[15deg]">Начать путь</span>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Japanese Aesthetic Element - Vertical Text / Decor */}
            <div className="absolute top-1/2 left-8 md:left-12 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-4">
                <div className="w-[1px] h-32 bg-white/20" />
                <span className="text-white/40 [writing-mode:vertical-rl] text-xs tracking-[0.5em] uppercase font-light">The Way of Strength</span>
                <div className="w-[1px] h-32 bg-white/20" />
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
                <div className="w-[2px] h-16 bg-gradient-to-b from-primary to-transparent" />
            </motion.div>
        </section>
    );
}
