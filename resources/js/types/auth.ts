export interface User {
    id: number;
    name: string;
    email: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
    remember?: boolean;
}

export interface LoginResponse {
    token: string;
    user: User;
}
