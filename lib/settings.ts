import { createClient } from "@/lib/supabase/server";

export interface SocialLinks {
    instagram?: string;
    telegram?: string;
    youtube?: string;
    tiktok?: string;
    whatsapp?: string;
}

export interface SettingsData {
    id: number;
    phone?: string;
    address?: string;
    social_links?: SocialLinks;
}

export async function getSettings(): Promise<SettingsData | null> {
    const supabase = await createClient();
    const { data } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

    return data;
}


