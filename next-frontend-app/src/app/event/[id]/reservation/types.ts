export interface Schedule {
    id: number;
    event_id: number;
    start_at: string;
    finish_at: string;
    event: {
        id: number;
        title: string;
        capacity: number;
        lesson_img1: string;
        lesson_img2: string;
        lesson_img3: string;
        catch_copy: string;
        instructor_name: string;
        instructor_img: string;
        instructor_profile: string;
        price: number;
    };
}

export interface PaymentMethod {
    id: number;
    payment_method: string;
}

export interface ReservationErrors {
    payment_method_id?: string[];
    participants?: string[];
    contact_number?: string[];
}
