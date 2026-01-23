"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionShellProps {
    children: React.ReactNode;
    theme?: "light" | "dark";
    className?: string;
    id?: string;
}

export function SectionShell({
    children,
    theme = "dark", // Default to dark for premium feel
    className,
    id,
}: SectionShellProps) {
    return (
        <section
            id={id}
            className={cn(
                "relative w-full px-4 py-24 md:py-32 overflow-hidden",
                // Force dark theme as default for the new design language, but allow override if explicitly needed
                theme === "light" ? "bg-neutral-100 text-neutral-900" : "bg-black text-white",
                className
            )}
        >
            {/* Cinematic Background Effects */}
            {theme !== "light" && (
                <>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black opacity-80 pointer-events-none" />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none" />
                </>
            )}

            <div className="container mx-auto max-w-7xl relative z-10 text-center md:text-left">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    {children}
                </motion.div>
            </div>
        </section>
    );
}
