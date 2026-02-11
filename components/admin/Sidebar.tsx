"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ShoppingBag, Newspaper, Trophy, Settings, LogOut, Users, Image as ImageIcon, GraduationCap, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
    { name: "Тренеры", href: "/admin/coaches", icon: Users },
    { name: "Галерея", href: "/admin/gallery", icon: ImageIcon },
    { name: "Ученики", href: "/admin/students", icon: GraduationCap },
    { name: "Товары", href: "/admin/products", icon: ShoppingBag },
    { name: "Мероприятия", href: "/admin/news", icon: Newspaper }, // Renamed from News
    { name: "Достижения", href: "/admin/achievements", icon: Trophy },
    { name: "Настройки", href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // Initial check for localStorage (optional persistence)
    useEffect(() => {
        const saved = localStorage.getItem("admin-sidebar-collapsed");
        if (saved) {
            setCollapsed(saved === "true");
        }
    }, []);

    const toggleCollapse = () => {
        const newState = !collapsed;
        setCollapsed(newState);
        localStorage.setItem("admin-sidebar-collapsed", String(newState));
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
            await supabase.auth.signOut(); // Keep supabase signout just in case
            router.push("/admin/login");
            router.refresh();
        } catch (error) {
            console.error("Logout error", error);
            // Fallback redirect
            router.push("/admin/login");
        }
    };

    return (
        <>
            {/* Mobile Header / Toggle */}
            <div className="md:hidden flex items-center justify-between p-4 bg-[#0B0B0B] border-b border-[#1a1a1a] sticky top-0 z-50">
                <Link href="/" className="block">
                    <div className="text-lg font-black uppercase text-white tracking-widest">
                        King <span className="text-primary">Dojo</span>
                    </div>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(true)} className="text-white">
                    <Menu />
                </Button>
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed md:static inset-y-0 left-0 z-50 bg-[#0B0B0B] border-r border-[#1a1a1a] flex flex-col h-screen transition-all duration-300 ease-in-out",
                    collapsed ? "md:w-20" : "md:w-64",
                    mobileOpen ? "translate-x-0 w-64" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Header */}
                <div className={cn(
                    "p-6 border-b border-neutral-800 flex items-center",
                    collapsed ? "justify-center" : "justify-between"
                )}>
                    {!collapsed && (
                        <Link href="/" className="block group">
                            <div className="text-xl font-black uppercase text-white tracking-widest group-hover:opacity-80 transition-opacity">
                                King <span className="text-primary">Dojo</span>
                            </div>
                            <div className="text-xs text-neutral-500 uppercase mt-1 tracking-widest">Back to Site</div>
                        </Link>
                    )}
                    {collapsed && (
                        <div className="text-xl font-black text-primary">KD</div>
                    )}

                    {/* Mobile Close */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(false)}
                        className="md:hidden text-neutral-400 hover:text-white"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-1 px-3">
                    {navItems.map((item) => {
                        const isActive = pathname.startsWith(item.href);
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)} // Close on mobile navigation
                                title={collapsed ? item.name : undefined}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary/20 text-primary border border-primary/20"
                                        : "text-neutral-400 hover:text-white hover:bg-neutral-900",
                                    collapsed && "justify-center px-2"
                                )}
                            >
                                <Icon size={collapsed ? 24 : 18} />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout / Collapse Toggle */}
                <div className="p-4 border-t border-[#1a1a1a] bg-[#0B0B0B] flex flex-col gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        title={collapsed ? "Выход" : undefined}
                        className={cn(
                            "w-full text-neutral-400 hover:text-red-500 hover:bg-red-500/10 gap-2",
                            collapsed ? "justify-center px-0" : "justify-start"
                        )}
                    >
                        <LogOut size={18} />
                        {!collapsed && "Выход"}
                    </Button>

                    {/* Collapse Button (Desktop Only) */}
                    <Button
                        variant="ghost"
                        onClick={toggleCollapse}
                        className="hidden md:flex w-full justify-center text-neutral-500 hover:text-white mt-2"
                    >
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </Button>
                </div>
            </aside>
        </>
    );
}
