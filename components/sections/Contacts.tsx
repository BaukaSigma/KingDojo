"use client";

import { SectionShell } from "@/components/SectionShell";
import { Button } from "@/components/ui/button";
import { ArrowRight, Instagram } from "lucide-react";
import { formatWhatsAppLink } from "@/lib/utils";

const FAQs = [
    { q: "С какого возраста можно начать?", a: "Мы принимаем детей с 4-5 лет. В этом возрасте тренировки проходят в игровой форме с акцентом на ОФП и дисциплину." },
    { q: "Нужно ли покупать кимоно сразу?", a: "Нет, на первые пробные тренировки можно приходить в обычной удобной спортивной одежде (футболка, штаны)." },
    { q: "Как проходит первая тренировка?", a: "Ребенок знакомится с тренером и залом, выполняет базовые упражнения. Главная задача — адаптироваться и получить удовольствие." },
    { q: "Можно ли совмещать с другой секцией?", a: "Да, многие наши ученики успешно совмещают каратэ с учебой и другими кружками, благодаря развитой дисциплине." },
    { q: "Как часто проходят аттестации на пояса?", a: "Аттестации проходят 2 раза в год. Допуск к экзамену дает тренер на основании успехов и посещаемости." },
    { q: "Что важно знать родителям перед стартом?", a: "Важна поддержка и регулярность. Результат приходит не сразу, но дисциплина дает плоды в спорте и в жизни." },
];

interface ContactsProps {
    socials?: {
        instagram?: string;
        tiktok?: string;
        whatsapp?: string;
    };
    phone?: string;
}

export function Contacts({ socials }: ContactsProps) {
    const whatsappLink = formatWhatsAppLink(socials?.whatsapp);

    return (
        <SectionShell id="contacts" theme="dark" className="bg-neutral-950 border-t border-white/5">
            <div className="grid md:grid-cols-2 gap-16 lg:gap-24">

                {/* FAQ */}
                <div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 text-white">Частые вопросы</h2>
                    <div className="space-y-4">
                        {FAQs.map((faq, i) => (
                            <details key={i} className="group border-b border-white/10 pb-6">
                                <summary className="flex cursor-pointer items-center justify-between font-bold text-lg md:text-xl text-white hover:text-primary transition-colors [&::-webkit-details-marker]:hidden">
                                    {faq.q}
                                    <span className="transition-transform group-open:rotate-180 text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="m6 9 6 6 6-6" /></svg>
                                    </span>
                                </summary>
                                <p className="mt-4 text-neutral-400 leading-relaxed font-light animate-in fade-in slide-in-from-top-2 duration-300">
                                    {faq.a}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Contacts CTA */}
                <div className="flex flex-col h-full">
                    <div className="bg-gradient-to-br from-neutral-900 to-black p-10 rounded-3xl border border-white/10 flex flex-col justify-center text-center items-center h-full relative overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                        <h2 className="relative z-10 text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 text-white">
                            Записаться
                        </h2>
                        <p className="relative z-10 text-lg text-neutral-400 mb-10 max-w-md">
                            Готовы стать частью King Dojo? Свяжитесь с нами, чтобы узнать расписание и записаться на тренировку.
                        </p>

                        {whatsappLink ? (
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto">
                                <Button className="relative z-10 w-full px-12 py-8 text-xl uppercase font-black tracking-widest bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3">
                                    <span>WhatsApp</span>
                                    <ArrowRight className="w-6 h-6" />
                                </Button>
                            </a>
                        ) : (
                            <Button disabled className="relative z-10 w-full md:w-auto px-12 py-8 text-xl uppercase font-black tracking-widest bg-neutral-800 text-neutral-500 rounded-xl flex items-center justify-center gap-3">
                                <span>WhatsApp (Нет номера)</span>
                            </Button>
                        )}

                        <div className="relative z-10 mt-12 grid grid-cols-2 gap-8 w-full border-t border-white/5 pt-8">
                            {socials?.instagram && (
                                <a href={socials.instagram} target="_blank" className="group/social flex flex-col items-center gap-3 text-neutral-400 hover:text-[#E1306C] transition-colors cursor-pointer">
                                    <div className="p-4 rounded-full bg-white/5 group-hover/social:bg-[#E1306C]/10 transition-colors">
                                        <Instagram className="w-8 h-8" />
                                    </div>
                                    <span className="text-xs uppercase font-bold tracking-wider">Instagram</span>
                                </a>
                            )}

                            {socials?.tiktok && (
                                <a href={socials.tiktok} target="_blank" className="group/social flex flex-col items-center gap-3 text-neutral-400 hover:text-[#00F2EA] transition-colors cursor-pointer">
                                    <div className="p-4 rounded-full bg-white/5 group-hover/social:bg-[#00F2EA]/10 transition-colors">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                                        </svg>
                                    </div>
                                    <span className="text-xs uppercase font-bold tracking-wider">TikTok</span>
                                </a>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </SectionShell>
    );
}
