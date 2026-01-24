"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
    { href: "/", label: "Главная" },
    { href: "/#about", label: "О клубе" },
    { href: "/#approach", label: "Подход" },
    { href: "/schedule", label: "График" },
    { href: "/#coach", label: "Тренер" },
    { href: "/news", label: "Новости" },
    { href: "/achievements", label: "Достижения" },
    { href: "/shop", label: "Магазин" },
    { href: "/#contacts", label: "Контакты" },
];

export function NavBar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const openWhatsApp = () => {
        const element = document.getElementById("contacts");
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    scrolled
                        ? "bg-background/80 backdrop-blur-md border-b border-white/5 py-4 shadow-2xl shadow-black/50"
                        : "bg-transparent py-6"
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="group flex items-center gap-2">
                        <span className={cn(
                            "text-2xl font-black tracking-tighter uppercase transition-colors duration-300",
                            "text-white"
                        )}>
                            King Dojo
                        </span>
                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative group overflow-hidden"
                            >
                                <span className={cn(
                                    "text-sm font-bold uppercase tracking-widest transition-colors duration-300",
                                    "text-white group-hover:text-primary"
                                )}>
                                    {link.label}
                                </span>
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
                            </Link>
                        ))}
                        <Button
                            onClick={openWhatsApp}
                            variant="default"
                            className="ml-4 uppercase font-bold text-xs tracking-wider bg-primary hover:bg-primary/90 text-white rounded-none skew-x-[-10deg] px-6 transition-transform hover:-translate-y-1 hover:shadow-[0_4px_14px_0_rgba(255,100,0,0.39)]"
                        >
                            <span className="skew-x-[10deg]">Записаться</span>
                        </Button>
                    </nav>

                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsOpen(true)}
                        className="lg:hidden p-2 text-white hover:text-primary transition-colors"
                    >
                        <Menu className="w-8 h-8" />
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-10 h-10" />
                        </button>

                        <nav className="flex flex-col items-center gap-8">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.5, ease: "easeOut" }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-4xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 hover:to-primary transition-all duration-500"
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: navLinks.length * 0.1 }}
                            >
                                <Button onClick={() => { setIsOpen(false); openWhatsApp(); }} size="lg" className="mt-8 text-xl px-12 py-8 uppercase font-black tracking-widest bg-primary text-white rounded-none hover:bg-primary/90">
                                    Записаться
                                </Button>
                            </motion.div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
