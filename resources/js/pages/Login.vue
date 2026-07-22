<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import AuthLayout from '@/layouts/AuthLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';

const authStore = useAuthStore();
const uiStore = useUiStore();

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

async function handleSubmit() {
  // Simple client side validation
  errors.email = !form.email ? 'Email is required' : '';
  errors.password = !form.password ? 'Password is required' : '';

  if (errors.email || errors.password) return;

  try {
    await authStore.login(form);
    uiStore.notify('Welcome back!', 'success');
  } catch (err: any) {
    if (err.response?.status === 422) {
      const backendErrors = err.response.data.errors;
      errors.email = backendErrors.email?.[0] || '';
      errors.password = backendErrors.password?.[0] || '';
    } else {
      uiStore.notify(err.response?.data?.message || 'Invalid credentials', 'error');
    }
  }
}
</script>

<template>
  <AuthLayout>
    <BaseCard>
      <form @submit.prevent="handleSubmit" class="space-y-6 py-2">
        <BaseInput
          v-model="form.email"
          label="Email Address"
          type="email"
          placeholder="admin@example.com"
          :error="errors.email"
          required
        />
        
        <BaseInput
          v-model="form.password"
          label="Password"
          type="password"
          placeholder="••••••••"
          :error="errors.password"
          required
        />

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-slate-700">
              Remember me
            </label>
          </div>
        </div>

        <BaseButton
          type="submit"
          class="w-full"
          :loading="authStore.isLoading"
        >
          Sign In
        </BaseButton>
      </form>
    </BaseCard>
  </AuthLayout>
</template>
