import { createClient } from "@/lib/supabase/server";
import { AppNewsForm } from "@/components/admin/AppNewsForm";
import { notFound } from "next/navigation";

export default async function EditAppNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: newsItem } = await supabase
        .from("app_news")
        .select("*")
        .eq("id", id)
        .single();

    if (!newsItem) {
        return notFound();
    }

    return (
        <div className="flex-1 space-y-4">
            <AppNewsForm initialData={newsItem} />
        </div>
    );
}
