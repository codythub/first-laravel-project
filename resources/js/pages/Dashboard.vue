<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { RouterLink } from 'vue-router';
import { getProducts } from '@/api/products';
import { getCategories } from '@/api/categories';
import AppLayout from '@/layouts/AppLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import { Package, Tags } from 'lucide-vue-next';

const stats = ref({
  totalProducts: 0,
  totalCategories: 0,
  latestProductName: 'No products',
  lastUpdatedRaw: undefined as string | undefined
});

const isLoading = ref(true);

function formatRelativeTime(dateStr: string | undefined) {
  if (!dateStr) return '-';
  const now = new Date();
  const d = new Date(dateStr);
  
  if (isNaN(d.getTime())) return '-';

  const diff = now.getTime() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);

  if (seconds < 60) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  
  const isToday = d.toDateString() === now.toDateString();
  const timeStr = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  
  if (isToday) return `Today ${timeStr}`;
  
  const dateOptions: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
  return `${d.toLocaleDateString([], dateOptions)}, ${timeStr}`;
}

onMounted(async () => {
  try {
    const [prodRes, catRes] = await Promise.all([
      getProducts({ per_page: 1000 }), // Get all for stats
      getCategories()
    ]);

    const allProducts = prodRes.data.data;
    stats.value.totalProducts = allProducts.length;
    stats.value.totalCategories = catRes.data.length;

    if (allProducts.length > 0) {
      // Find latest product by created_at
      const latest = [...allProducts].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      })[0];
      stats.value.latestProductName = latest.name;

      // Find most recent updated_at among all products
      const lastUpdatedProduct = [...allProducts].sort((a, b) => {
        const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
        const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
        return dateB - dateA;
      })[0];
      stats.value.lastUpdatedRaw = lastUpdatedProduct.updated_at;
    }
  } catch (err) {
    console.error('Failed to load dashboard stats');
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <AppLayout>
    <div class="space-y-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p class="text-slate-500">Welcome back to your inventory management system.</p>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BaseCard class="p-0">
          <div class="p-6">
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Products</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">{{ isLoading ? '...' : stats.totalProducts }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="p-0">
          <div class="p-6">
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Categories</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">{{ isLoading ? '...' : stats.totalCategories }}</p>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="p-0">
          <div class="p-6">
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Latest Product</p>
              <p class="text-2xl font-bold text-slate-900 mt-1 truncate" :title="stats.latestProductName">
                {{ isLoading ? '...' : stats.latestProductName }}
              </p>
            </div>
          </div>
        </BaseCard>

        <BaseCard class="p-0">
          <div class="p-6">
            <div>
              <p class="text-sm font-medium text-slate-500 uppercase tracking-wider">Last Updated</p>
              <p class="text-2xl font-bold text-slate-900 mt-1">
                {{ isLoading ? '...' : formatRelativeTime(stats.lastUpdatedRaw) }}
              </p>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Recent Activity / Quick Links -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BaseCard>
          <template #header>
            <h3 class="font-bold text-slate-900">Quick Actions</h3>
          </template>
          <div class="grid grid-cols-2 gap-4">
            <RouterLink to="/products" class="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
              <Package class="h-6 w-6 mx-auto mb-2 text-indigo-600" />
              <span class="text-sm font-medium">Manage Products</span>
            </RouterLink>
            <RouterLink to="/categories" class="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-center">
              <Tags class="h-6 w-6 mx-auto mb-2 text-emerald-600" />
              <span class="text-sm font-medium">Manage Categories</span>
            </RouterLink>
          </div>
        </BaseCard>

        <BaseCard>
          <template #header>
            <h3 class="font-bold text-slate-900">System Information</h3>
          </template>
          <div class="space-y-4">
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-500">Backend Status</span>
              <span class="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold uppercase">Online</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-500">API Version</span>
              <span class="text-slate-900 font-mono">v1.0.0</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-slate-500">Last Synced</span>
              <span class="text-slate-900">{{ new Date().toLocaleTimeString() }}</span>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>
  </AppLayout>
</template>
