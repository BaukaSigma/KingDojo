export interface Coach {
    id: number;
    created_at: string;
    full_name: string;
    rank: string;
    experience?: string;
    role: string;
    description: string;
    image_url: string;
    instagram?: string;
    display_order: number;
}
