import { GalleryForm } from "@/components/admin/gallery/GalleryForm";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditGalleryPage({ params }: PageProps) {
    const { id } = await params;
    const supabase = await createClient();

    // Check if ID is new (just in case, though route handles it)
    if (id === 'new') return null;

    const { data: item } = await supabase
        .from("gallery")
        .select("*")
        .eq("id", id)
        .single();

    if (!item) {
        notFound();
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter mb-8">
                Редактировать
            </h1>
            <GalleryForm initialData={item} />
        </div>
    );
}
