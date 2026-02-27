import { createClient } from "@/lib/supabase/server";
import { ScheduleForm } from "@/components/admin/ScheduleForm";
import { notFound } from "next/navigation";

export default async function EditSchedulePage({ params }: { params: Promise<{ id: string }> }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: schedule } = await supabase
        .from("schedules")
        .select("*")
        .eq("id", id)
        .single();

    if (!schedule) {
        return notFound();
    }

    return (
        <div className="flex-1 space-y-4 p-8">
            <ScheduleForm initialData={schedule} />
        </div>
    );
}
