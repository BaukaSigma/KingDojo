import { createClient } from "@/lib/supabase/server";
import { SchedulesClient } from "./SchedulesClient";

export const dynamic = 'force-dynamic';

export default async function SchedulesPage() {
    const supabase = await createClient();
    const { data: schedules } = await supabase
        .from("schedules")
        .select("*")
        .order("display_order", { ascending: true });

    return <SchedulesClient initialSchedules={schedules || []} />;
}
