import { createClient } from "@/lib/supabase/server";
import { AppNewsClient } from "./AppNewsClient";

export const dynamic = 'force-dynamic';

export default async function AppNewsPage() {
    const supabase = await createClient();
    const { data: news } = await supabase
        .from("app_news")
        .select("*")
        .order("created_at", { ascending: false });

    return <AppNewsClient initialNews={news || []} />;
}
