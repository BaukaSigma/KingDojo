import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2, Image as ImageIcon, Video, Play } from "lucide-react";
import Image from "next/image";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

export default async function AdminGalleryPage() {
    const supabase = await createClient();
    const { data: items } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });

    async function deleteItem(formData: FormData) {
        "use server";
        const id = formData.get("id") as string;
        const supabase = await createClient();
        await supabase.from("gallery").delete().eq("id", id);
        revalidatePath("/admin/gallery");
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-black uppercase text-white tracking-tighter">
                    Галерея
                </h1>
                <Link href="/admin/gallery/new">
                    <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                        <Plus size={20} />
                        Добавить
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {items?.map((item) => (
                    <div
                        key={item.id}
                        className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden group hover:border-primary/50 transition-colors flex flex-col"
                    >
                        <div className="relative aspect-video bg-black">
                            {item.type === 'photo' && item.image_url ? (
                                <Image
                                    src={item.image_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : item.type === 'video' ? (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                                    <Video className="w-12 h-12 text-neutral-700" />
                                    {item.video_url && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                                            <Play className="w-12 h-12 text-white fill-white" />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                                    <ImageIcon className="w-12 h-12 text-neutral-700" />
                                </div>
                            )}

                            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur px-2 py-1 rounded text-xs font-bold text-white uppercase flex items-center gap-1">
                                {item.type === 'photo' ? <ImageIcon size={12} /> : <Video size={12} />}
                                <span>{item.type === 'photo' ? 'Фото' : 'Видео'}</span>
                            </div>
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                            <h3 className="text-white font-bold truncate mb-1">{item.title}</h3>
                            <p className="text-neutral-400 text-sm line-clamp-2 mb-4 flex-1">
                                {item.description || "Нет описания"}
                            </p>

                            <div className="flex items-center gap-2 pt-4 border-t border-white/5">
                                <Link href={`/admin/gallery/${item.id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-primary hover:border-primary/50">
                                        <Pencil size={16} className="mr-2" />
                                        Изменить
                                    </Button>
                                </Link>
                                <form action={deleteItem}>
                                    <input type="hidden" name="id" value={item.id} />
                                    <Button variant="outline" size="sm" type="submit" className="bg-transparent border-white/10 text-red-500 hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 px-3">
                                        <Trash2 size={16} />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {(!items || items.length === 0) && (
                <div className="text-center py-20 text-neutral-500">
                    <div className="bg-neutral-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-10 h-10 opacity-50" />
                    </div>
                    <p className="text-xl font-bold mb-2">Галерея пуста</p>
                    <p className="max-w-md mx-auto mb-6">Добавьте первые фотографии или видео, чтобы они появились на сайте.</p>
                </div>
            )}
        </div>
    );
}
