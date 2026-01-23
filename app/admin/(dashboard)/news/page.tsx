import { createClient } from "@/lib/supabase/server";
import { NewsClient } from "./NewsClient";

export const dynamic = 'force-dynamic';

export default async function NewsPage() {
    const supabase = await createClient();
    const { data: news } = await supabase
        .from("news")
        .select("*")
        .order("created_at", { ascending: false });

    return <NewsClient initialNews={news || []} />;
}
