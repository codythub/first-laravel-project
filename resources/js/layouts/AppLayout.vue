<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue';
import Navbar from '@/components/layout/Navbar.vue';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

onMounted(() => {
  if (!authStore.user) {
    authStore.fetchUser();
  }
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <Sidebar />
    <Navbar />
    <main class="lg:ml-64 p-4 sm:p-8">
      <div class="max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>
