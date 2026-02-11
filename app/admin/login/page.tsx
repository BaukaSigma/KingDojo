"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, User, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Ошибка входа");
            }

            // Redirect on success
            router.push("/admin/news");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-neutral-900/50 border border-white/5 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black uppercase text-white tracking-widest mb-2">
                        King <span className="text-primary">Dojo</span>
                    </h1>
                    <p className="text-neutral-500 text-sm uppercase tracking-wider">Admin Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-neutral-400 text-xs uppercase tracking-wider">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
                            <Input
                                type="text"
                                placeholder="Admin"
                                className="pl-10 bg-black/50 border-neutral-800 text-white focus:border-primary/50 transition-colors"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-neutral-400 text-xs uppercase tracking-wider">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-500" />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-10 bg-black/50 border-neutral-800 text-white focus:border-primary/50 transition-colors"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider h-12"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Войти"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
