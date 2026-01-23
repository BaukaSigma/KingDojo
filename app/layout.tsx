import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for now, can swap to Geist
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
    title: "King Dojo | Enshin Karate",
    description: "Профессиональный клуб Enshin каратэ (Shinkarate Federation). Тренер Санжар Кине.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ru">
            <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
