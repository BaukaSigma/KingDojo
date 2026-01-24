"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingBag, Newspaper, Trophy, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const navItems = [
    { name: "Товары", href: "/admin/products", icon: ShoppingBag },
    { name: "Новости", href: "/admin/news", icon: Newspaper },
    { name: "Достижения", href: "/admin/achievements", icon: Trophy },
    { name: "Настройки", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
    };

    return (
        <aside className="w-full md:w-64 bg-[#0B0B0B] border-r border-[#1a1a1a] flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-neutral-800">
                <Link href="/" className="block group">
                    <div className="text-xl font-black uppercase text-white tracking-widest group-hover:opacity-80 transition-opacity">
                        King <span className="text-primary">Dojo</span>
                    </div>
                    <div className="text-xs text-neutral-500 uppercase mt-1 tracking-widest">Back to Site</div>
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary/20 text-primary border border-primary/20"
                                    : "text-neutral-400 hover:text-white hover:bg-neutral-900"
                            )}
                        >
                            <Icon size={18} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-[#1a1a1a] bg-[#0B0B0B]">
                <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="w-full justify-start text-neutral-400 hover:text-red-500 hover:bg-red-500/10 gap-2"
                >
                    <LogOut size={18} />
                    Выход
                </Button>
            </div>
        </aside>
    );
}
