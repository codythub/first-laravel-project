import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import * as authApi from '@/api/auth';
import type { LoginCredentials, User } from '@/types/auth';
import router from '@/router';

export const useAuthStore = defineStore('auth', () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(localStorage.getItem('token'));
    const isLoading = ref(false);

    const isAuthenticated = computed(() => !!token.value);

    async function login(credentials: LoginCredentials) {
        isLoading.value = true;
        try {
            const { data } = await authApi.login(credentials);
            token.value = data.token;
            user.value = data.user;
            localStorage.setItem('token', data.token);
            router.push({ name: 'dashboard' });
        } finally {
            isLoading.value = false;
        }
    }

    async function logout() {
        try {
            await authApi.logout();
        } finally {
            token.value = null;
            user.value = null;
            localStorage.removeItem('token');
            router.push({ name: 'login' });
        }
    }

    async function fetchUser() {
        if (!token.value) return;
        try {
            const { data } = await authApi.getMe();
            user.value = data;
        } catch (error) {
            token.value = null;
            localStorage.removeItem('token');
            router.push({ name: 'login' });
        }
    }

    return {
        user,
        token,
        isLoading,
        isAuthenticated,
        login,
        logout,
        fetchUser
    };
});
