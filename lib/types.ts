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

export interface GalleryItem {
    id: string;
    type: 'photo' | 'video';
    title: string;
    description?: string;
    image_url?: string;
    video_url?: string;
    created_at: string;
}

export interface Student {
    id: string;
    display_name: string;
    belt: string | null;
    group_name: string | null;
    bio_short: string | null;
    photo_url: string | null;
    rating_points: number;
    attended_classes: number;
    total_classes: number;
    public_visible: boolean;
    created_at: string;
}

export interface StudentAward {
    id: string;
    student_id: string;
    medal: 'gold' | 'silver' | 'bronze' | 'other';
    title: string | null;
    place?: number | null;
    created_at: string;
}
