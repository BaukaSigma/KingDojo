"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Save, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { Coach } from "@/lib/types";

interface CoachFormProps {
    initialData?: Coach | null;
}

export function CoachForm({ initialData }: CoachFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image_url || "");

    const [formData, setFormData] = useState({
        full_name: initialData?.full_name || "",
        rank: initialData?.rank || "", // e.g. "2 Dan"
        experience: initialData?.experience || "", // e.g. "10+ years"
        role: initialData?.role || "", // e.g. "Senior Coach"
        description: initialData?.description || "",
        instagram: initialData?.instagram || "",
        display_order: initialData?.display_order || 0,
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const uploadImage = async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('coaches')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('coaches').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let image_url = previewUrl;

            if (imageFile) {
                image_url = await uploadImage(imageFile);
            }

            const dataToSave = {
                ...formData,
                image_url,
            };

            if (initialData) {
                // Update
                const { error } = await supabase
                    .from("coaches")
                    .update(dataToSave)
                    .eq("id", initialData.id);

                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from("coaches")
                    .insert([dataToSave]);

                if (error) throw error;
            }

            router.push("/admin/coaches");
            router.refresh();
        } catch (error) {
            console.error("Error saving coach:", error);
            alert("Ошибка при сохранении");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8 bg-neutral-900/50 p-8 rounded-xl border border-white/5">

            {/* Image Upload */}
            <div className="space-y-4">
                <Label className="text-white">Фотография тренера</Label>
                <div className="flex items-start gap-6">
                    <div className="relative w-40 h-56 bg-black border-2 border-dashed border-neutral-700 rounded-lg overflow-hidden flex items-center justify-center group hover:border-primary/50 transition-colors">
                        {previewUrl ? (
                            <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                        ) : (
                            <ImagePlus className="w-10 h-10 text-neutral-700 group-hover:text-primary transition-colors" />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                    <div className="flex-1 space-y-2">
                        <p className="text-sm text-neutral-400">
                            Рекомендуется вертикальное фото высокого качества.
                            Оно будет отображаться на весь экран.
                        </p>
                        {previewUrl && (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => {
                                    setPreviewUrl("");
                                    setImageFile(null);
                                }}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-auto py-2 px-3 text-sm"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Удалить фото
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                    <Label className="text-white">ФИО (Полностью)</Label>
                    <Input
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        placeholder="Санжар Кине"
                        className="bg-black border-white/10 text-white focus:border-primary"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white">Пояс / Ранг</Label>
                    <Input
                        value={formData.rank}
                        onChange={(e) => setFormData({ ...formData, rank: e.target.value })}
                        placeholder="2 Дан"
                        className="bg-black border-white/10 text-white focus:border-primary"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white">Опыт работы</Label>
                    <Input
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        placeholder="10+ лет"
                        className="bg-black border-white/10 text-white focus:border-primary"
                    />
                </div>

                <div className="col-span-2 space-y-2">
                    <Label className="text-white">Роль / Должность</Label>
                    <Input
                        required
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Главный Тренер / Инструктор"
                        className="bg-black border-white/10 text-white focus:border-primary"
                    />
                </div>

                <div className="col-span-2 space-y-2">
                    <Label className="text-white">Ссылка на Instagram (необязательно)</Label>
                    <Input
                        value={formData.instagram}
                        onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                        placeholder="https://instagram.com/..."
                        className="bg-black border-white/10 text-white focus:border-primary"
                    />
                </div>

                <div className="space-y-2">
                    <Label className="text-white">Порядок отображения</Label>
                    <Input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        className="bg-black border-white/10 text-white focus:border-primary"
                    />
                    <p className="text-xs text-neutral-500">Меньше число = выше в списке (0, 1, 2...)</p>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-white">Описание / Биография</Label>
                <Textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Подробная информация о тренере, достижениях и философии..."
                    className="bg-black border-white/10 text-white focus:border-primary min-h-[150px]"
                />
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    className="text-neutral-400 hover:text-white"
                >
                    Отмена
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
                            Сохранить
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
