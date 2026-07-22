import axios, { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import router from '@/router';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            router.push({ name: 'login' });
        }
        return Promise.reject(error);
    }
);

export default api;
