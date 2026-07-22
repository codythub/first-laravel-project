<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router';
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  LogOut,
  X
} from 'lucide-vue-next';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';

const route = useRoute();
const authStore = useAuthStore();
const uiStore = useUiStore();

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: Tags },
];

function isCurrent(path: string) {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
}
</script>

<template>
  <!-- Mobile Overlay -->
  <div 
    v-if="uiStore.sidebarOpen" 
    class="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
    @click="uiStore.sidebarOpen = false"
  ></div>

  <!-- Sidebar -->
  <div 
    class="flex flex-col w-64 bg-slate-900 h-screen fixed left-0 top-0 z-50 transition-transform duration-300 lg:translate-x-0"
    :class="uiStore.sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="flex items-center justify-between h-16 bg-slate-950 px-4">
      <span class="text-white text-xl font-bold tracking-wider">INVENTORY</span>
      <button @click="uiStore.sidebarOpen = false" class="lg:hidden text-slate-400">
        <X class="h-6 w-6" />
      </button>
    </div>
    
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <RouterLink
        v-for="item in navigation"
        :key="item.name"
        :to="item.href"
        @click="uiStore.sidebarOpen = false"
        class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors group"
        :class="isCurrent(item.href) 
          ? 'bg-indigo-600 text-white' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'"
      >
        <component 
          :is="item.icon" 
          class="mr-3 h-5 w-5" 
          :class="isCurrent(item.href) ? 'text-white' : 'text-slate-400 group-hover:text-white'"
        />
        {{ item.name }}
      </RouterLink>
    </nav>

    <div class="p-4 border-t border-slate-800">
      <button
        @click="authStore.logout()"
        class="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-400 rounded-lg hover:bg-slate-800 hover:text-white transition-colors group"
      >
        <LogOut class="mr-3 h-5 w-5 text-slate-400 group-hover:text-white" />
        Logout
      </button>
    </div>
  </div>
</template>
