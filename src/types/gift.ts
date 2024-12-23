export interface Gift {
    id: string;
    image_url: string;
    message: string;
    created_at: string;
    received_by: string | null | undefined;
    user_id: string | undefined;
    animation?: {
        scale: number;
        rotate: number;
    };
} 