import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: settings } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

    return <SettingsForm initialData={settings} />;
}
