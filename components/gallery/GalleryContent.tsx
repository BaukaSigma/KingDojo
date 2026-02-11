"use client";

import { useState } from "react";
import { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SafeImage } from "@/components/ui/image-placeholder";
import { Play } from "lucide-react";

interface GalleryContentProps {
    items: GalleryItem[];
}

export function GalleryContent({ items }: GalleryContentProps) {
    const [filter, setFilter] = useState<'photo' | 'video'>('photo');

    const filteredItems = items.filter(item => item.type === filter);

    return (
        <div>
            {/* Tabs */}
            <div className="flex justify-center mb-12">
                <div className="bg-neutral-900 p-1 rounded-xl inline-flex border border-white/5">
                    <button
                        onClick={() => setFilter('photo')}
                        className={cn(
                            "px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
                            filter === 'photo'
                                ? "bg-white text-black shadow-lg"
                                : "text-neutral-400 hover:text-white"
                        )}
                    >
                        Фото
                    </button>
                    <button
                        onClick={() => setFilter('video')}
                        className={cn(
                            "px-8 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
                            filter === 'video'
                                ? "bg-white text-black shadow-lg"
                                : "text-neutral-400 hover:text-white"
                        )}
                    >
                        Видео
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                    <div key={item.id} className="group relative bg-neutral-900 border border-white/5 rounded-2xl overflow-hidden hover:border-primary/50 transition-colors animate-in fade-in zoom-in-95 duration-300">
                        {item.type === 'photo' ? (
                            <div className="aspect-[4/5] relative overflow-hidden">
                                <SafeImage
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                        ) : (
                            <div className="aspect-video relative bg-black">
                                {getYouTubeEmbed(item.video_url) ? (
                                    <iframe
                                        src={getYouTubeEmbed(item.video_url)}
                                        title={item.title}
                                        className="absolute inset-0 w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-neutral-500">
                                        Invalid Video URL
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="p-6">
                            <h3 className="text-xl font-bold uppercase text-white mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                                {item.title}
                            </h3>
                            {item.description && (
                                <p className="text-neutral-400 text-sm line-clamp-3">
                                    {item.description}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-neutral-500 text-lg uppercase tracking-widest">
                        В этом разделе пока пусто
                    </p>
                </div>
            )}
        </div>
    );
}

function getYouTubeEmbed(url?: string) {
    if (!url) return null;
    // Handle standard watch URLs and short URLs
    // e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ
    // e.g. https://youtu.be/dQw4w9WgXcQ

    let videoId = '';

    try {
        if (url.includes('youtube.com/watch')) {
            videoId = new URL(url).searchParams.get('v') || '';
        } else if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
        } else if (url.includes('youtube.com/embed/')) {
            return url; // Already an embed URL potentially
        }
    } catch (e) {
        return null;
    }

    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
}
