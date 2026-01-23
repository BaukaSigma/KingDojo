import { createClient } from "@/lib/supabase/server";
import { AchievementsClient } from "./AchievementsClient";

export const dynamic = 'force-dynamic';

export default async function AchievementsPage() {
    const supabase = await createClient();
    const { data: achievements } = await supabase
        .from("achievements")
        .select("*")
        .order("created_at", { ascending: false });

    return <AchievementsClient initialAchievements={achievements || []} />;
}
