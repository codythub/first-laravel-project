export interface Category {
    id: number;
    name: string;
    description?: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category_id: number;
    category?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number | '';
    quantity: number | '';
    category_id: number | '';
    sku: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    links: {
        first: string;
        last: string;
        prev: string | null;
        next: string | null;
    };
}
