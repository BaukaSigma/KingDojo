import { GalleryForm } from "@/components/admin/gallery/GalleryForm";

export default function NewGalleryPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-black uppercase text-white tracking-tighter mb-8">
                Добавить в галерею
            </h1>
            <GalleryForm />
        </div>
    );
}
