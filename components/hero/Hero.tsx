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
        <section ref={ref} className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-black text-white">
            {/* Parallax Background */}
            <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 scale-110">
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/90 z-10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-transparent via-black/20 to-black z-10" />
                <Image
                    src={HERO_IMAGES[0]}
                    alt="King Dojo Hero"
                    fill
                    className="object-cover opacity-90 grayscale-[30%] contrast-125 saturate-110"
                    priority
                />
            </motion.div>

            {/* Cinematic Grain & Grid */}
            <div className="absolute inset-0 z-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            {/* Content */}
            <div className="container relative z-20 flex flex-col items-center text-center px-4">
                <motion.div
                    style={{ y: y2 }}
                    className="flex flex-col items-center"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 100 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="relative"
                    >
                        <h1 className="text-7xl md:text-9xl lg:text-[12rem] leading-none font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/10 drop-shadow-2xl">
                            King Dojo
                        </h1>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "100%" }}
                            transition={{ delay: 1, duration: 1.5, ease: "easeInOut" }}
                            className="absolute -bottom-4 left-0 h-1 bg-primary"
                        />
                    </motion.div>

                    <motion.p
                        className="mt-8 text-xl md:text-3xl text-white/80 font-light tracking-[0.2em] uppercase max-w-4xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Путь <span className="text-primary font-bold">силы</span> • Дух <span className="text-primary font-bold">победы</span>
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="mt-12"
                    >
                        <Button
                            size="lg"
                            className="text-xl px-12 py-8 h-auto bg-primary hover:bg-white hover:text-black text-white uppercase tracking-widest font-black rounded-none transition-all duration-300 transform hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(255,100,0,0.5)] skew-x-[-10deg] border-2 border-transparent hover:border-white"
                            onClick={() => document.getElementById("contacts")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            <span className="skew-x-[10deg] flex items-center gap-2">
                                Начать путь
                                <motion.span
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    →
                                </motion.span>
                            </span>
                        </Button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Animated Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-12 left-0 right-0 flex justify-center z-20"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-white/50">Scroll</span>
                    <div className="w-[1px] h-24 bg-gradient-to-b from-primary to-transparent" />
                </div>
            </motion.div>
        </section>
    );
}
