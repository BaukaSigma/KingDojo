"use client";

import { useState, useMemo } from "react";
import { Student, StudentAward } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/image-placeholder";
import { GraduationCap, Trophy, Search } from "lucide-react";
import Link from "next/link";

interface StudentsContentProps {
    students: Student[];
    awards: StudentAward[];
}

export function StudentsContent({ students, awards }: StudentsContentProps) {
    const [sortBy, setSortBy] = useState<'rating' | 'attendance' | 'newest'>('rating');
    const [selectedBelt, setSelectedBelt] = useState<string>('all');
    const [selectedGroup, setSelectedGroup] = useState<string>('all');

    // Extract unique belts and groups for filters
    const belts = useMemo(() => {
        const unique = new Set(students.map(s => s.belt).filter(Boolean));
        return Array.from(unique);
    }, [students]);

    const groups = useMemo(() => {
        const unique = new Set(students.map(s => s.group_name).filter(Boolean));
        return Array.from(unique);
    }, [students]);

    // Group awards by student ID for easier access
    const awardsByStudent = useMemo(() => {
        const map: Record<string, StudentAward[]> = {};
        awards.forEach(award => {
            if (!map[award.student_id]) map[award.student_id] = [];
            map[award.student_id].push(award);
        });
        return map;
    }, [awards]);

    const filteredAndSortedStudents = useMemo(() => {
        let result = [...students];

        // Filter
        if (selectedBelt !== 'all') {
            result = result.filter(s => s.belt === selectedBelt);
        }
        if (selectedGroup !== 'all') {
            result = result.filter(s => s.group_name === selectedGroup);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'rating') return b.rating_points - a.rating_points;
            if (sortBy === 'attendance') {
                const percentA = a.total_classes > 0 ? (a.attended_classes / a.total_classes) : 0;
                const percentB = b.total_classes > 0 ? (b.attended_classes / b.total_classes) : 0;
                return percentB - percentA;
            }
            if (sortBy === 'newest') {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return 0;
        });

        return result;
    }, [students, sortBy, selectedBelt, selectedGroup]);

    const medalEmoji = {
        gold: "🥇",
        silver: "🥈",
        bronze: "🥉",
        other: "🏆"
    };

    return (
        <div>
            {/* Filters & Sorting */}
            <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-neutral-900/50 p-4 rounded-xl border border-white/5">
                <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                    {/* Belt Filter */}
                    <select
                        value={selectedBelt}
                        onChange={(e) => setSelectedBelt(e.target.value)}
                        className="bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    >
                        <option value="all">Все пояса</option>
                        {belts.map(b => (
                            <option key={b} value={b as string}>{b}</option>
                        ))}
                    </select>

                    {/* Group Filter */}
                    <select
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}
                        className="bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                    >
                        <option value="all">Все группы</option>
                        {groups.map(g => (
                            <option key={g} value={g as string}>{g}</option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end">
                    <span className="text-sm text-neutral-500 mr-2 flex items-center">Сортировка:</span>
                    <button
                        onClick={() => setSortBy('rating')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors",
                            sortBy === 'rating' ? "bg-primary text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"
                        )}
                    >
                        Рейтинг
                    </button>
                    <button
                        onClick={() => setSortBy('attendance')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors",
                            sortBy === 'attendance' ? "bg-primary text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"
                        )}
                    >
                        Посещаемость
                    </button>
                    <button
                        onClick={() => setSortBy('newest')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-colors",
                            sortBy === 'newest' ? "bg-primary text-white" : "bg-neutral-800 text-neutral-400 hover:text-white"
                        )}
                    >
                        Новые
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedStudents.map((student) => {
                    const attendancePercent = student.total_classes > 0
                        ? Math.round((student.attended_classes / student.total_classes) * 100)
                        : 0;

                    const studentAwards = awardsByStudent[student.id] || [];
                    const displayedAwards = studentAwards.slice(0, 6);
                    const remainingAwards = studentAwards.length - 6;

                    return (
                        <Link href={`/students/${student.id}`} key={student.id} className="group relative bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors animate-in fade-in zoom-in-95 duration-300 flex flex-col">
                            {/* Photo & Main Info */}
                            <div className="relative h-64 bg-black overflow-hidden">
                                {student.photo_url ? (
                                    <SafeImage
                                        src={student.photo_url}
                                        alt={student.display_name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        style={{
                                            objectPosition: `${student.photo_pos_x ?? 50}% ${student.photo_pos_y ?? 50}%`,
                                            transformOrigin: `${student.photo_pos_x ?? 50}% ${student.photo_pos_y ?? 50}%`,
                                            transform: `scale(${(student.photo_scale ?? 100) / 100})`
                                        }}
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-neutral-800">
                                        <GraduationCap className="w-20 h-20 text-neutral-700" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                                <div className="absolute bottom-4 left-4 right-4">
                                    {student.group_name && (
                                        <span className="inline-block px-2 py-0.5 rounded bg-black/50 backdrop-blur border border-white/10 text-[10px] text-neutral-300 uppercase tracking-wider mb-2">
                                            {student.group_name}
                                        </span>
                                    )}
                                    <h3 className="text-2xl font-black uppercase text-white leading-none mb-1">
                                        {student.display_name}
                                    </h3>
                                    <p className="text-primary font-bold text-sm tracking-wide">
                                        {student.belt || "Ученик"}
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="p-4 flex-1 flex flex-col gap-4">
                                {student.bio_short && (
                                    <p className="text-sm text-neutral-400 line-clamp-2">
                                        {student.bio_short}
                                    </p>
                                )}

                                <div className="grid grid-cols-3 gap-3 mt-auto">
                                    <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col justify-center">
                                        <span className="block text-[9px] text-neutral-500 uppercase tracking-wider mb-1">Рейтинг</span>
                                        <span className="text-lg font-black text-white leading-none">{student.rating_points}</span>
                                    </div>
                                    <div className="bg-black/40 p-2 rounded-lg border border-white/5 flex flex-col justify-center">
                                        <span className="block text-[9px] text-neutral-500 uppercase tracking-wider mb-1">Баллы</span>
                                        <span className="text-lg font-black text-primary leading-none">{student.points || 0}</span>
                                    </div>
                                    <div className="bg-black/40 p-2 rounded-lg border border-white/5 relative overflow-hidden flex flex-col justify-center">
                                        <span className="block text-[9px] text-neutral-500 uppercase tracking-wider mb-1">Посещаемость</span>
                                        <div className="flex items-end gap-1">
                                            <span className="text-lg font-black text-white leading-none">{attendancePercent}%</span>
                                        </div>
                                        {/* Simple progress bar background */}
                                        <div className="absolute bottom-0 left-0 h-1 bg-primary/20 w-full">
                                            <div
                                                className="h-full bg-primary"
                                                style={{ width: `${attendancePercent}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Awards */}
                                {studentAwards.length > 0 && (
                                    <div className="pt-3 border-t border-white/5">
                                        <div className="flex flex-wrap gap-1">
                                            {displayedAwards.map(award => (
                                                <div
                                                    key={award.id}
                                                    className="w-8 h-8 flex items-center justify-center bg-black/40 rounded-full border border-white/5 text-lg cursor-help"
                                                    title={`${medalEmoji[award.medal as keyof typeof medalEmoji]} ${award.title}${award.place ? ` (${award.place} место)` : ''}`}
                                                >
                                                    {medalEmoji[award.medal as keyof typeof medalEmoji]}
                                                </div>
                                            ))}
                                            {remainingAwards > 0 && (
                                                <div className="w-8 h-8 flex items-center justify-center bg-neutral-800 rounded-full border border-white/5 text-xs font-bold text-white">
                                                    +{remainingAwards}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {filteredAndSortedStudents.length === 0 && (
                <div className="text-center py-20 text-neutral-500">
                    <p className="text-xl font-bold mb-2">Ученики не найдены</p>
                    <p>Попробуйте изменить фильтры или зайти позже.</p>
                </div>
            )}
        </div>
    );
}
