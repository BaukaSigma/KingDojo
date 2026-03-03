import { createClient } from "@/lib/supabase/server";
import { SafeImage } from "@/components/ui/image-placeholder";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, GraduationCap } from "lucide-react";

export const revalidate = 60;

const medalEmoji = {
    gold: "🥇",
    silver: "🥈",
    bronze: "🥉",
    other: "🏆"
};

export default async function StudentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: student } = await supabase
        .from("students")
        .select("*")
        .eq("id", id)
        .eq("public_visible", true)
        .single();

    if (!student) {
        notFound();
    }

    const { data: awards } = await supabase
        .from("student_awards")
        .select("*")
        .eq("student_id", id)
        .order("created_at", { ascending: false });

    const attendancePercent = student.total_classes > 0
        ? Math.round((student.attended_classes / student.total_classes) * 100)
        : 0;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <NavBar />
            <div className="pt-24 pb-20 container mx-auto px-4 max-w-4xl">
                <Link href="/students" className="inline-flex items-center text-muted-foreground hover:text-white mb-8 transition-colors">
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Назад к ученикам
                </Link>

                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <div className="w-full md:w-1/3 shrink-0">
                        <div className="relative aspect-[3/4] bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-800 shadow-xl shadow-black/50">
                            {student.photo_url ? (
                                <SafeImage
                                    src={student.photo_url}
                                    alt={student.display_name}
                                    fill
                                    className="object-cover"
                                    style={{
                                        objectPosition: `${student.photo_pos_x ?? 50}% ${student.photo_pos_y ?? 50}%`,
                                        transformOrigin: `${student.photo_pos_x ?? 50}% ${student.photo_pos_y ?? 50}%`,
                                        transform: `scale(${(student.photo_scale ?? 100) / 100})`
                                    }}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                                    <GraduationCap className="w-24 h-24 text-neutral-700" />
                                </div>
                            )}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6 pt-20">
                                {student.group_name && (
                                    <span className="inline-block px-3 py-1 rounded bg-black/60 backdrop-blur border border-white/20 text-xs text-neutral-200 uppercase tracking-widest mb-3">
                                        {student.group_name}
                                    </span>
                                )}
                                <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-1">
                                    {student.display_name}
                                </h1>
                                <p className="text-primary font-bold tracking-wide">
                                    {student.belt || "Белый пояс"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-center">
                                <span className="block text-sm text-neutral-500 uppercase tracking-widest mb-2">Рейтинг</span>
                                <span className="text-4xl font-black text-white">{student.rating_points}</span>
                            </div>
                            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 flex flex-col justify-center">
                                <span className="block text-sm text-neutral-500 uppercase tracking-widest mb-2">Баллы</span>
                                <span className="text-4xl font-black text-primary">{student.points || 0}</span>
                            </div>
                            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 relative overflow-hidden flex flex-col justify-center">
                                <span className="block text-sm text-neutral-500 uppercase tracking-widest mb-2">Посещаемость</span>
                                <div className="flex items-end gap-1">
                                    <span className="text-4xl font-black text-white">{attendancePercent}%</span>
                                </div>
                                <div className="absolute bottom-0 left-0 h-1.5 bg-primary/20 w-full">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${attendancePercent}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {student.bio_short && (
                            <div className="bg-neutral-900/50 p-6 rounded-2xl border border-neutral-800 flex-1">
                                <h3 className="text-sm text-neutral-500 uppercase tracking-widest mb-4">О себе</h3>
                                <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
                                    {student.bio_short}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {awards && awards.length > 0 && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tight flex items-center">
                            Достижения
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {awards.map(award => (
                                <div key={award.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex gap-4 items-start hover:border-neutral-700 transition-colors">
                                    <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-black/40 rounded-full border border-white/5 text-2xl">
                                        {medalEmoji[award.medal as keyof typeof medalEmoji]}
                                    </div>
                                    <div className="pt-1">
                                        <h4 className="font-bold text-white line-clamp-2">{award.title}</h4>
                                        <div className="text-sm text-neutral-500 mt-1 flex items-center gap-2">
                                            {award.place && (
                                                <span className="text-primary font-bold">{award.place} место</span>
                                            )}
                                            {award.place && <span>•</span>}
                                            <span>{new Date(award.created_at).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </main>
    );
}
