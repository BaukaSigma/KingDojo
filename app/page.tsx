import { NavBar } from "@/components/NavBar";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Coach } from "@/components/sections/Coach";
import { Students } from "@/components/sections/Students";
import { Contacts } from "@/components/sections/Contacts";
import { Footer } from "@/components/Footer";

import { getSettings } from "@/lib/settings";

export default async function Home() {
    const settings = await getSettings();

    return (
        <main className="min-h-screen">
            <NavBar />
            <Hero />
            <About />
            <Coach />
            <Students />
            <Contacts socials={settings?.social_links} phone={settings?.phone} />
            <Footer />
        </main>
    );
}
