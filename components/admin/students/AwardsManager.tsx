"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Medal, Loader2, Trophy } from "lucide-react";
import { StudentAward } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { calculateStudentRating } from "@/lib/rating";

interface AwardsManagerProps {
    studentId: string;
    initialAwards: StudentAward[];
}

export function AwardsManager({ studentId, initialAwards }: AwardsManagerProps) {
    const supabase = createClient();
    const [awards, setAwards] = useState<StudentAward[]>(initialAwards);
    const [loading, setLoading] = useState(false);

    // New award form state
    const [medalType, setMedalType] = useState<'gold' | 'silver' | 'bronze' | 'other'>('gold');
    const [title, setTitle] = useState("");
    const [place, setPlace] = useState("");

    const handleAddAward = async () => {
        if (!title) return;
        setLoading(true);

        try {
            const newAward = {
                student_id: studentId,
                medal: medalType,
                title: title,
                place: place ? parseInt(place) : null,
            };

            const { data, error } = await supabase
                .from('student_awards')
                .insert([newAward])
                .select()
                .single();

            if (error) throw error;

            const updatedAwards = [...awards, data as StudentAward];
            setAwards(updatedAwards);

            // Re-calculate rating
            const { data: student } = await supabase.from('students').select('*').eq('id', studentId).single();
            if (student) {
                const newRating = calculateStudentRating(student, updatedAwards);
                await supabase.from('students').update({ rating_points: newRating }).eq('id', studentId);
                // Need to tell parent to refresh data if it relies on it, or just let page refresh reload it
            }

            // Reset form
            setTitle("");
            setPlace("");
            setMedalType("gold");
        } catch (error) {
            console.error("Error adding award:", error);
            alert("Ошибка при добавлении награды");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAward = async (id: string) => {
        if (!confirm("Удалить награду?")) return;

        try {
            const updatedAwards = awards.filter(a => a.id !== id);
            setAwards(updatedAwards);

            // Re-calculate rating
            const { data: student } = await supabase.from('students').select('*').eq('id', studentId).single();
            if (student) {
                const newRating = calculateStudentRating(student, updatedAwards);
                await supabase.from('students').update({ rating_points: newRating }).eq('id', studentId);
            }
        } catch (error) {
            console.error("Error deleting award:", error);
            alert("Ошибка при удалении");
        }
    };

    const medalEmoji = {
        gold: "🥇",
        silver: "🥈",
        bronze: "🥉",
        other: "🏆"
    };

    return (
        <div className="space-y-6 border-t border-white/5 pt-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Trophy className="text-primary" />
                Награды и Достижения
            </h3>

            {/* List */}
            <div className="space-y-3">
                {awards.map((award) => (
                    <div key={award.id} className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{medalEmoji[award.medal]}</span>
                            <div>
                                <div className="font-bold text-white text-sm">{award.title}</div>
                                {award.place && (
                                    <div className="text-xs text-neutral-400">{award.place} место</div>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAward(award.id)}
                            className="text-neutral-500 hover:text-red-500 hover:bg-red-500/10"
                        >
                            <Trash2 size={16} />
                        </Button>
                    </div>
                ))}

                {awards.length === 0 && (
                    <p className="text-neutral-500 text-sm italic">Нет наград</p>
                )}
            </div>

            {/* Add Form */}
            <div className="bg-neutral-800/30 p-4 rounded-lg space-y-4">
                <h4 className="text-white font-medium text-sm">Добавить новую награду</h4>

                <div className="space-y-3">
                    <div>
                        <Label className="text-xs text-neutral-400 mb-2 block">Тип Медали</Label>
                        <RadioGroup
                            value={medalType}
                            onValueChange={(val) => setMedalType(val as any)}
                            className="flex gap-4"
                        >
                            {(['gold', 'silver', 'bronze', 'other'] as const).map((m) => (
                                <div key={m} className="flex items-center space-x-2">
                                    <RadioGroupItem value={m} id={`medal-${m}`} className="border-white/20 text-primary" />
                                    <Label htmlFor={`medal-${m}`} className="text-white cursor-pointer text-sm">
                                        {medalEmoji[m]} {m === 'other' ? 'Другое' : ''}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>

                    <div>
                        <Label className="text-xs text-neutral-400">Название турнира / достижения</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Чемпионат города..."
                            className="bg-black/50 border-white/10 text-white h-8 text-sm mt-1"
                        />
                    </div>

                    <div>
                        <Label className="text-xs text-neutral-400">Место (необязательно)</Label>
                        <Input
                            type="number"
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            placeholder="1"
                            className="bg-black/50 border-white/10 text-white h-8 text-sm mt-1 w-20"
                        />
                    </div>

                    <Button
                        onClick={handleAddAward}
                        disabled={loading || !title}
                        size="sm"
                        className="w-full bg-primary hover:bg-primary/90 text-white"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                        Добавить награду
                    </Button>
                </div>
            </div>
        </div>
    );
}
