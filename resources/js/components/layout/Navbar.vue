<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
import { User as UserIcon, Menu } from 'lucide-vue-next';

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();
</script>

<template>
  <header class="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 lg:ml-64">
    <div class="flex items-center space-x-4">
      <button 
        @click="uiStore.sidebarOpen = true" 
        class="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
      >
        <Menu class="h-6 w-6" />
      </button>
      <h2 class="text-lg font-semibold text-slate-800 hidden sm:block">
        {{ route.name?.toString().toUpperCase() }}
      </h2>
    </div>
    
    <div class="flex items-center space-x-4">
      <div class="flex flex-col items-end hidden xs:flex">
        <span class="text-sm font-medium text-slate-700">{{ authStore.user?.name }}</span>
        <span class="text-xs text-slate-500">{{ authStore.user?.email }}</span>
      </div>
      <div class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
        <UserIcon class="h-6 w-6 text-slate-400" />
      </div>
    </div>
  </header>
</template>
