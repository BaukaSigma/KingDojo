"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploadProps {
    value: string[];
    onChange: (value: string[]) => void;
    disabled?: boolean;
    multiple?: boolean;
    bucketName?: string;
    maxCount?: number;
    imageStyle?: React.CSSProperties;
}

export function ImageUpload({
    value,
    onChange,
    disabled,
    multiple = false,
    bucketName = "media", // Default bucket
    maxCount,
    imageStyle,
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();
    const { toast } = useToast();

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;

            // Check max count
            const filesToProcess = maxCount ? Math.min(files.length, maxCount - value.length) : files.length;
            if (filesToProcess <= 0) {
                toast({
                    title: "Лимит превышен",
                    description: `Максимальное количество фото: ${maxCount}`,
                    variant: "destructive"
                });
                return;
            }

            setUploading(true);
            const newUrls: string[] = [];

            for (let i = 0; i < filesToProcess; i++) {
                const file = files[i];
                const fileExt = file.name.split(".").pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
                const filePath = `uploads/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                newUrls.push(data.publicUrl);
            }

            if (multiple) {
                onChange([...value, ...newUrls]);
            } else {
                onChange(newUrls);
            }

            toast({ title: "Success", description: "Image uploaded successfully" });

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to upload image",
                variant: "destructive"
            });
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = (urlToRemove: string) => {
        onChange(value.filter((url) => url !== urlToRemove));
    };

    const isMaxReached = typeof maxCount === 'number' && value.length >= maxCount;

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden bg-black group border-none">
                        <div className="z-10 absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            <Button
                                type="button"
                                onClick={() => handleRemove(url)}
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 sm:h-6 sm:w-6"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                            style={imageStyle}
                        />
                    </div>
                ))}
            </div>
            <div>
                <input
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    disabled={disabled || uploading || isMaxReached}
                />
                <Button
                    type="button"
                    disabled={disabled || uploading || isMaxReached}
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full md:w-auto"
                >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? "Загрузка..." : isMaxReached ? "Достигнут лимит фото" : (multiple ? "Загрузить фото (можно несколько)" : "Загрузить фото")}
                </Button>
            </div>
        </div>
    );
}
