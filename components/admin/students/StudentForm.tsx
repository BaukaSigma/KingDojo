"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Save, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { Student } from "@/lib/types";
import { Switch } from "@/components/ui/switch";
import { AwardsManager } from "./AwardsManager";

interface StudentFormProps {
    initialData?: Student | null;
    initialAwards?: any[]; // Passed only if editing
}

export function StudentForm({ initialData, initialAwards = [] }: StudentFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.photo_url || "");

    // If we are editing, we have an ID. If creating, ID is null until saved.
    // AwardsManager requires a student ID, so we only show it in Edit mode or after save.
    const isEditing = !!initialData?.id;

    const [formData, setFormData] = useState({
        display_name: initialData?.display_name || "",
        belt: initialData?.belt || "",
        group_name: initialData?.group_name || "",
        bio_short: initialData?.bio_short || "",
        rating_points: initialData?.rating_points || 0,
        attended_classes: initialData?.attended_classes || 0,
        total_classes: initialData?.total_classes || 0,
        public_visible: initialData?.public_visible ?? true,
        photo_pos_x: initialData?.photo_pos_x ?? 50,
        photo_pos_y: initialData?.photo_pos_y ?? 50,
        photo_scale: initialData?.photo_scale ?? 100,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File, studentId: string) => {
        const fileExt = file.name.split('.').pop();
        const timestamp = Date.now();
        const fileName = `${timestamp}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${studentId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('students')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('students').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Create/Update student record first to get ID
            // If new, we insert without photo first to get ID for storage path (optional but good practice)
            // Actually simpler: 
            // - If edit: ID exists. Upload photo using ID. Update record.
            // - If new: Insert record first. Get ID. Upload photo. Update record with photo URL.

            let studentId = initialData?.id;
            let currentPhotoUrl = initialData?.photo_url || null;

            if (!studentId) {
                // Insert new to get ID
                const { data: newStudent, error: insertError } = await supabase
                    .from('students')
                    .insert([{ ...formData, photo_url: null }]) // Insert without photo first
                    .select()
                    .single();

                if (insertError) throw insertError;
                studentId = newStudent.id;
            }

            // Now we have studentId. Handle Image Upload.
            if (imageFile && studentId) {
                currentPhotoUrl = await uploadImage(imageFile, studentId);
            } else if (!previewUrl) {
                // If preview cleared, remove photo
                currentPhotoUrl = null;
            }

            // Update record with final data (and photo url)
            const { error: updateError } = await supabase
                .from('students')
                .update({
                    ...formData,
                    photo_url: currentPhotoUrl
                })
                .eq('id', studentId!);

            if (updateError) throw updateError;

            if (!isEditing) {
                // If this was a create operation, redirect to edit page to add awards
                router.push(`/admin/students/${studentId}`);
            } else {
                router.push("/admin/students");
            }
            router.refresh();

        } catch (error) {
            console.error("Error saving student:", error);
            alert("Ошибка при сохранении");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8 bg-neutral-900/50 p-8 rounded-xl border border-white/5">

                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2 md:col-span-2 space-y-4">
                            <Label className="text-white">Фото ученика</Label>
                            <div className="flex items-start gap-6">
                                <div className="relative w-32 h-32 bg-black border-2 border-dashed border-neutral-700 rounded-full overflow-hidden flex items-center justify-center shrink-0 group hover:border-primary/50 transition-colors">
                                    {previewUrl ? (
                                        <Image
                                            src={previewUrl}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                            style={{
                                                objectPosition: `${formData.photo_pos_x}% ${formData.photo_pos_y}%`,
                                                transformOrigin: `${formData.photo_pos_x}% ${formData.photo_pos_y}%`,
                                                transform: `scale(${formData.photo_scale / 100})`
                                            }}
                                        />
                                    ) : (
                                        <ImagePlus className="w-8 h-8 text-neutral-700 group-hover:text-primary transition-colors" />
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                </div>
                                <div className="flex-1 w-full pt-2">
                                    <div className="flex items-center gap-4 mb-2">
                                        <Label htmlFor="public-visible" className="text-white cursor-pointer">Публичный профиль</Label>
                                        <Switch
                                            id="public-visible"
                                            checked={formData.public_visible}
                                            onCheckedChange={(checked) => setFormData({ ...formData, public_visible: checked })}
                                        />
                                    </div>
                                    <p className="text-xs text-neutral-500 mb-4">
                                        Если выключено, ученик не будет виден на сайте.
                                    </p>

                                    {/* Position controls */}
                                    {previewUrl && (
                                        <div className="space-y-3 bg-neutral-900/50 p-4 rounded-lg border border-white/5 mb-4">
                                            <Label className="text-xs text-neutral-400 uppercase tracking-widest block mb-2">Центровка фото</Label>
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-neutral-500 w-4 font-mono">X:</span>
                                                    <input
                                                        type="range"
                                                        min="0" max="100"
                                                        value={formData.photo_pos_x}
                                                        onChange={(e) => setFormData({ ...formData, photo_pos_x: Number(e.target.value) })}
                                                        className="flex-1 accent-primary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-neutral-500 w-4 font-mono">Y:</span>
                                                    <input
                                                        type="range"
                                                        min="0" max="100"
                                                        value={formData.photo_pos_y}
                                                        onChange={(e) => setFormData({ ...formData, photo_pos_y: Number(e.target.value) })}
                                                        className="flex-1 accent-primary"
                                                    />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs text-neutral-500 w-12 font-mono">Zoom:</span>
                                                    <input
                                                        type="range"
                                                        min="50" max="300"
                                                        value={formData.photo_scale}
                                                        onChange={(e) => setFormData({ ...formData, photo_scale: Number(e.target.value) })}
                                                        className="flex-1 accent-primary"
                                                    />
                                                </div>
                                                <div className="flex justify-end pt-2 border-t border-white/5 mt-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setFormData({ ...formData, photo_pos_x: 50, photo_pos_y: 50, photo_scale: 100 })}
                                                        className="h-6 px-2 text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white"
                                                    >
                                                        Сбросить параметры
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {previewUrl && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                setPreviewUrl("");
                                                setImageFile(null);
                                            }}
                                            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-auto py-1 px-2 text-xs"
                                        >
                                            <Trash2 className="w-3 h-3 mr-2" />
                                            Удалить фото
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <Label className="text-white">Имя Фамилия</Label>
                            <Input
                                required
                                value={formData.display_name}
                                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                                placeholder="Иван Иванов"
                                className="bg-black border-white/10 text-white focus:border-primary"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <Label className="text-white">Пояс (Ранг)</Label>
                            <Input
                                value={formData.belt}
                                onChange={(e) => setFormData({ ...formData, belt: e.target.value })}
                                placeholder="Белый пояс"
                                className="bg-black border-white/10 text-white focus:border-primary"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <Label className="text-white">Группа</Label>
                            <Input
                                value={formData.group_name}
                                onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                                placeholder="Младшая группа"
                                className="bg-black border-white/10 text-white focus:border-primary"
                            />
                        </div>

                        <div className="col-span-2 md:col-span-1 space-y-2">
                            <Label className="text-white">Рейтинг (Очки)</Label>
                            <Input
                                type="number"
                                value={formData.rating_points}
                                onChange={(e) => setFormData({ ...formData, rating_points: parseInt(e.target.value) || 0 })}
                                className="bg-black border-white/10 text-white focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Посещено занятий</Label>
                            <Input
                                type="number"
                                value={formData.attended_classes}
                                onChange={(e) => setFormData({ ...formData, attended_classes: parseInt(e.target.value) || 0 })}
                                className="bg-black border-white/10 text-white focus:border-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-white">Всего занятий</Label>
                            <Input
                                type="number"
                                value={formData.total_classes}
                                onChange={(e) => setFormData({ ...formData, total_classes: parseInt(e.target.value) || 0 })}
                                className="bg-black border-white/10 text-white focus:border-primary"
                            />
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label className="text-white">Краткая биография</Label>
                            <Textarea
                                value={formData.bio_short}
                                onChange={(e) => setFormData({ ...formData, bio_short: e.target.value })}
                                placeholder="Пару слов об ученике..."
                                className="bg-black border-white/10 text-white focus:border-primary min-h-[80px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.back()}
                            className="text-neutral-400 hover:text-white"
                        >
                            {isEditing ? 'Назад' : 'Отмена'}
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-primary hover:bg-primary/90 text-white min-w-[150px]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Сохранение...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {isEditing ? 'Сохранить изменения' : 'Создать и продолжить'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>

            {/* Awards Section - Only visible when editing existing student */}
            <div className="lg:col-span-1">
                {isEditing ? (
                    <div className="bg-neutral-900/50 p-6 rounded-xl border border-white/5 sticky top-8">
                        <AwardsManager
                            studentId={initialData!.id}
                            initialAwards={initialAwards}
                        />
                    </div>
                ) : (
                    <div className="bg-neutral-900/30 p-8 rounded-xl border border-white/5 border-dashed flex items-center justify-center text-center">
                        <p className="text-neutral-500">
                            Сохраните ученика, чтобы добавлять награды
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
