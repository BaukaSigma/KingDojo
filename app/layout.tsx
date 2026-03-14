import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for now, can swap to Geist
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";

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
            <head>
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=G-5ED384YG1Y"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-5ED384YG1Y');
                    `}
                </Script>
            </head>
            <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
                {children}
                <Toaster />
            </body>
        </html>
    );
}
