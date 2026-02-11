"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImagePlus, Save, Loader2, Trash2, Video } from "lucide-react";
import Image from "next/image";
import { GalleryItem } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface GalleryFormProps {
    initialData?: GalleryItem | null;
}

export function GalleryForm({ initialData }: GalleryFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>(initialData?.image_url || "");
    const [type, setType] = useState<'photo' | 'video'>(initialData?.type || 'photo');

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        video_url: initialData?.video_url || "",
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
            .from('gallery')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('gallery').getPublicUrl(filePath);
        return data.publicUrl;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let image_url = previewUrl;

            // Upload image if it's a photo type and a new file is selected
            if (type === 'photo' && imageFile) {
                image_url = await uploadImage(imageFile);
            }

            // Clear irrelevant fields based on type
            const finalData = {
                type,
                title: formData.title,
                description: formData.description,
                image_url: type === 'photo' ? image_url : null,
                video_url: type === 'video' ? formData.video_url : null,
            };

            if (initialData) {
                // Update
                const { error } = await supabase
                    .from("gallery")
                    .update(finalData)
                    .eq("id", initialData.id);

                if (error) throw error;
            } else {
                // Create
                const { error } = await supabase
                    .from("gallery")
                    .insert([finalData]);

                if (error) throw error;
            }

            router.push("/admin/gallery");
            router.refresh();
        } catch (error) {
            console.error("Error saving gallery item:", error);
            alert("Ошибка при сохранении");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl space-y-8 bg-neutral-900/50 p-8 rounded-xl border border-white/5">

            {/* Type Selection */}
            <div className="space-y-4">
                <Label className="text-white">Тип медиа</Label>
                <RadioGroup
                    defaultValue="photo"
                    value={type}
                    onValueChange={(val) => setType(val as 'photo' | 'video')}
                    className="flex gap-6"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="photo" id="type-photo" className="border-white/20 text-primary" />
                        <Label htmlFor="type-photo" className="text-white cursor-pointer flex items-center gap-2">
                            <ImagePlus size={16} /> Фото
                        </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="video" id="type-video" className="border-white/20 text-primary" />
                        <Label htmlFor="type-video" className="text-white cursor-pointer flex items-center gap-2">
                            <Video size={16} /> Видео (YouTube)
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            {/* Photo Upload */}
            {type === 'photo' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="text-white">Фотография</Label>
                    <div className="flex items-start gap-6">
                        <div className="relative w-full md:w-80 h-56 bg-black border-2 border-dashed border-neutral-700 rounded-lg overflow-hidden flex items-center justify-center group hover:border-primary/50 transition-colors">
                            {previewUrl ? (
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            ) : (
                                <div className="text-center p-4">
                                    <ImagePlus className="w-10 h-10 text-neutral-700 group-hover:text-primary transition-colors mx-auto mb-2" />
                                    <span className="text-xs text-neutral-500">Нажмите для загрузки</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                        </div>
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
                                Удалить
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {/* Video URL */}
            {type === 'video' && (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Label className="text-white">Ссылка на YouTube</Label>
                    <Input
                        value={formData.video_url}
                        onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                        placeholder="https://youtu.be/..."
                        className="bg-black border-white/10 text-white focus:border-primary"
                    />
                    <p className="text-xs text-neutral-500">Вставьте полную ссылку на видео</p>
                </div>
            )}

            <div className="space-y-2">
                <Label className="text-white">Заголовок</Label>
                <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder={type === 'photo' ? "Название фото" : "Название видео"}
                    className="bg-black border-white/10 text-white focus:border-primary"
                />
            </div>

            <div className="space-y-2">
                <Label className="text-white">Описание (необязательно)</Label>
                <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Краткое описание..."
                    className="bg-black border-white/10 text-white focus:border-primary min-h-[100px]"
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
