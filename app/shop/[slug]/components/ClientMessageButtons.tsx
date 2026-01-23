"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

interface Props {
    title: string;
    price: number;
    slug: string;
    whatsappPhone?: string;
    telegramUser?: string;
}

export default function ClientMessageButtons({ title, price, slug, whatsappPhone, telegramUser }: Props) {
    const [copied, setCopied] = useState(false);

    // Construct URL on client to be safe
    const currentUrl = typeof window !== 'undefined' ?
        `${window.location.origin}/shop/${slug}` :
        `/shop/${slug}`;

    const message = `Здравствуйте! Хочу приобрести товар «${title}». Цена: ${price} ₸. Ссылка: ${currentUrl}`;
    const encodedMessage = encodeURIComponent(message);

    const handleCopy = () => {
        navigator.clipboard.writeText(message);
        setCopied(true);
        toast({ description: "Сообщение скопировано" });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleWhatsApp = () => {
        if (!whatsappPhone) {
            toast({ variant: "destructive", description: "Телефон WhatsApp не настроен в админке" });
            return;
        }
        const url = `https://wa.me/${whatsappPhone}?text=${encodedMessage}`;
        window.open(url, "_blank");
    };

    const handleTelegram = () => {
        if (!telegramUser) {
            toast({ variant: "destructive", description: "Telegram не настроен в админке" });
            return;
        }
        // Telegram web link doesn't support ?text= natively for private chats securely in all clients, 
        // but t.me/username works. Usually manual paste is needed unless using a bot.
        // However, we'll try standard intent.
        const url = `https://t.me/${telegramUser}`;
        // User will have to paste, so we copy for them first
        navigator.clipboard.writeText(message);
        toast({ description: "Текст скопирован. Вставьте его в чат." });

        window.open(url, "_blank");
    };

    return (
        <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={handleWhatsApp} className="flex-1 bg-[#25D366] hover:bg-[#25D366]/90 text-white font-bold h-12 uppercase tracking-wide">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp
            </Button>
            <Button onClick={handleTelegram} className="flex-1 bg-[#0088cc] hover:bg-[#0088cc]/90 text-white font-bold h-12 uppercase tracking-wide">
                <Send className="mr-2 h-5 w-5" />
                Telegram
            </Button>
            <Button onClick={handleCopy} variant="outline" size="icon" className="h-12 w-12 border-neutral-300">
                {copied ? <Check className="h-5 w-5 text-green-500" /> : <Copy className="h-5 w-5" />}
            </Button>
        </div>
    );
}
