import { createClient } from "@/lib/supabase/server";
import { AchievementForm } from "@/components/admin/AchievementForm";
import { notFound } from "next/navigation";

export default async function EditAchievementPage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: achievement } = await supabase
        .from("achievements")
        .select("*")
        .eq("id", id)
        .single();

    if (!achievement) {
        return notFound();
    }

    return (
        <div className="flex-1 space-y-4">
            <AchievementForm initialData={achievement} />
        </div>
    );
}
