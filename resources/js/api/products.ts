import api from './axios';
import type { Product, PaginatedResponse, ProductFormData } from '@/types/product';

export const getProducts = (params: any = {}) => {
    return api.get<PaginatedResponse<Product>>('/products', { params });
};

export const getProduct = (id: number) => {
    return api.get<Product>(`/products/${id}`);
};

export const createProduct = (data: ProductFormData) => {
    return api.post<Product>('/products', data);
};

export const updateProduct = (id: number, data: ProductFormData) => {
    return api.put<Product>(`/products/${id}`, data);
};

export const deleteProduct = (id: number) => {
    return api.delete(`/products/${id}`);
};
