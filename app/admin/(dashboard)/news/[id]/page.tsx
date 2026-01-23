import { createClient } from "@/lib/supabase/server";
import { NewsForm } from "@/components/admin/NewsForm";
import { notFound } from "next/navigation";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: newsItem } = await supabase
        .from("news")
        .select("*")
        .eq("id", id)
        .single();

    if (!newsItem) {
        return notFound();
    }

    return (
        <div className="flex-1 space-y-4">
            <NewsForm initialData={newsItem} />
        </div>
    );
}
