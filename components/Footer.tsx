import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { formatWhatsAppLink } from "@/lib/utils";
import { Instagram, Youtube, Phone, Send } from "lucide-react";

export async function Footer() {
    const settings = await getSettings();
    const socials = settings?.social_links || {};

    const socialItems = [
        { key: 'instagram', icon: Instagram, url: socials.instagram, label: 'Instagram' },
        {
            key: 'tiktok', icon: ({ className }: { className?: string }) => (
                <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
                    <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                </svg>
            ), url: socials.tiktok, label: 'TikTok'
        },
        { key: 'youtube', icon: Youtube, url: socials.youtube, label: 'YouTube' },
        { key: 'telegram', icon: Send, url: socials.telegram ? `https://t.me/${socials.telegram.replace('@', '')}` : null, label: 'Telegram' },
        { key: 'whatsapp', icon: Phone, url: formatWhatsAppLink(socials.whatsapp), label: 'WhatsApp' },
    ];

    return (
        <footer className="bg-foreground text-background py-12 border-t border-white/10">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-lg font-bold uppercase tracking-widest mb-2">King Dojo</h3>
                    <p className="text-sm text-neutral-500">
                        © 2026 King Dojo. Все права защищены.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    {socialItems.map((item) => {
                        if (!item.url) return null;
                        const Icon = item.icon;
                        return (
                            <a
                                key={item.key}
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-neutral-400 hover:text-primary transition-colors p-2 hover:bg-white/10 rounded-full"
                                aria-label={item.label}
                            >
                                <Icon className="w-5 h-5" />
                            </a>
                        );
                    })}
                </div>

                <div>
                    <Link href="/admin/login" className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-600 transition-colors">
                        Admin Access
                    </Link>
                </div>
            </div>
        </footer>
    );
}
