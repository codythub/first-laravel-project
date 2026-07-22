<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { getCategories, createCategory } from '@/api/categories';
import type { Category } from '@/types/product';
import AppLayout from '@/layouts/AppLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import Modal from '@/components/common/Modal.vue';
import { useUiStore } from '@/stores/ui';
import { Tags, ChevronRight, Package, Plus } from 'lucide-vue-next';

const uiStore = useUiStore();
const categories = ref<Category[]>([]);
const isLoading = ref(false);
const showCreateModal = ref(false);
const isSubmitting = ref(false);

const categoryForm = reactive({
  name: ''
});

const errors = reactive({
  name: ''
});

async function fetchCategories() {
  isLoading.value = true;
  try {
    const { data } = await getCategories();
    categories.value = data;
  } catch (err) {
    uiStore.notify('Failed to load categories', 'error');
  } finally {
    isLoading.value = false;
  }
}

function openCreateModal() {
  categoryForm.name = '';
  errors.name = '';
  showCreateModal.value = true;
}

async function handleCreateCategory() {
  if (!categoryForm.name) {
    errors.name = 'Category name is required';
    return;
  }
  
  errors.name = '';
  isSubmitting.value = true;
  
  try {
    await createCategory({ name: categoryForm.name });
    uiStore.notify('Category created successfully', 'success');
    showCreateModal.value = false;
    categoryForm.name = '';
    fetchCategories();
  } catch (err: any) {
    if (err.response?.status === 422) {
      errors.name = err.response.data.errors.name?.[0] || 'Invalid data';
    } else {
      uiStore.notify('Failed to create category', 'error');
    }
  } finally {
    isSubmitting.value = false;
  }
}

onMounted(fetchCategories);
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Categories</h1>
        <BaseButton @click="openCreateModal">
          <Plus class="h-5 w-5 mr-2" />
          Create Category
        </BaseButton>
      </div>

      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="i in 6" :key="i" class="bg-white rounded-lg shadow-sm p-6 animate-pulse">
          <div class="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
          <div class="h-3 bg-slate-100 rounded w-full mb-2"></div>
          <div class="h-3 bg-slate-100 rounded w-2/3"></div>
        </div>
      </div>

      <div v-else-if="categories.length === 0" class="text-center py-12">
        <div class="flex flex-col items-center">
          <Tags class="h-12 w-12 text-slate-300 mb-4" />
          <p class="text-slate-500">No categories found.</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink 
          v-for="category in categories" 
          :key="category.id" 
          :to="`/products?category_id=${category.id}`"
          class="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6 group cursor-pointer"
        >
          <div class="flex items-start justify-between">
            <div class="p-2 bg-indigo-50 rounded-lg">
              <Tags class="h-6 w-6 text-indigo-600" />
            </div>
            <span class="text-xs font-medium text-slate-400">ID: #{{ category.id }}</span>
          </div>
          
          <h3 class="mt-4 text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            {{ category.name }}
          </h3>
          
          <p class="mt-2 text-sm text-slate-500 line-clamp-2 min-h-[2.5rem]">
            {{ category.description || 'No description provided for this category.' }}
          </p>

          <div class="mt-6 flex items-center justify-between pt-4 border-t border-slate-100">
            <div class="flex items-center text-slate-400 text-xs">
              <Package class="h-4 w-4 mr-1" />
              View products
            </div>
            <ChevronRight class="h-5 w-5 text-slate-300 group-hover:text-indigo-500 transition-colors" />
          </div>
        </RouterLink>
      </div>
    </div>

    <!-- Create Category Modal -->
    <Modal
      :show="showCreateModal"
      title="Create New Category"
      @close="showCreateModal = false"
    >
      <form @submit.prevent="handleCreateCategory" class="space-y-4">
        <BaseInput
          v-model="categoryForm.name"
          label="Category Name"
          placeholder="e.g. Electronics"
          required
          :error="errors.name"
        />
        
        <div class="flex justify-end space-x-3 pt-4">
          <BaseButton variant="secondary" @click="showCreateModal = false">
            Cancel
          </BaseButton>
          <BaseButton type="submit" :loading="isSubmitting">
            Create Category
          </BaseButton>
        </div>
      </form>
    </Modal>
  </AppLayout>
</template>
