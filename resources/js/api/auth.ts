import api from './axios';
import type { LoginCredentials, LoginResponse, User } from '@/types/auth';

export const login = (credentials: LoginCredentials) => {
    return api.post<LoginResponse>('/login', credentials);
};

export const logout = () => {
    return api.post('/logout');
};

export const getMe = () => {
    return api.get<User>('/me');
};
