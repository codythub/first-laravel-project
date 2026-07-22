import api from './axios';
import type { Category } from '@/types/product';

export const getCategories = () => {
    return api.get<Category[]>('/categories');
};

export const getCategory = (id: number) => {
    return api.get<Category>(`/categories/${id}`);
};

export const createCategory = (data: { name: string }) => {
    return api.post<Category>('/categories', data);
};
