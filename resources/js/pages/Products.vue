<script setup lang="ts">
import { ref, onMounted, watch, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getProducts, createProduct, updateProduct, deleteProduct } from '@/api/products';
import type { Product, ProductFormData } from '@/types/product';
import AppLayout from '@/layouts/AppLayout.vue';
import BaseCard from '@/components/base/BaseCard.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import Modal from '@/components/common/Modal.vue';
import ProductForm from '@/components/common/ProductForm.vue';
import { useUiStore } from '@/stores/ui';
import { Search, Plus, Pencil, Trash2, ChevronLeft, ChevronRight, X } from 'lucide-vue-next';

const uiStore = useUiStore();
const route = useRoute();
const router = useRouter();

// State
const products = ref<Product[]>([]);
const pagination = reactive({
  current_page: 1,
  last_page: 1,
  total: 0
});
const isLoading = ref(false);
const searchQuery = ref('');
let searchTimeout: any = null;

const categoryIdFilter = computed(() => route.query.category_id as string | undefined);

// Modal State
const showFormModal = ref(false);
const editingProduct = ref<Product | null>(null);
const isSubmitting = ref(false);

// Methods
async function fetchProducts(page = 1) {
  isLoading.value = true;
  try {
    const { data } = await getProducts({ 
      page, 
      search: searchQuery.value,
      category_id: categoryIdFilter.value
    });
    products.value = data.data;
    pagination.current_page = data.meta.current_page;
    pagination.last_page = data.meta.last_page;
    pagination.total = data.meta.total;
  } catch (err) {
    uiStore.notify('Failed to load products', 'error');
  } finally {
    isLoading.value = false;
  }
}

function handleSearch() {
  pagination.current_page = 1;
  fetchProducts(1);
}

function clearCategoryFilter() {
  router.push({ name: 'products', query: { ...route.query, category_id: undefined } });
}

function openCreateModal() {
  editingProduct.value = null;
  showFormModal.value = true;
}

function openEditModal(product: Product) {
  editingProduct.value = product;
  showFormModal.value = true;
}

async function handleFormSubmit(formData: ProductFormData) {
  isSubmitting.value = true;
  try {
    if (editingProduct.value) {
      await updateProduct(editingProduct.value.id, formData);
      uiStore.notify('Product updated successfully', 'success');
    } else {
      await createProduct(formData);
      uiStore.notify('Product created successfully', 'success');
    }
    showFormModal.value = false;
    fetchProducts(pagination.current_page);
  } catch (err: any) {
    uiStore.notify(err.response?.data?.message || 'Something went wrong', 'error');
  } finally {
    isSubmitting.value = false;
  }
}

async function handleDelete(id: number) {
  if (!confirm('Are you sure you want to delete this product?')) return;
  
  try {
    await deleteProduct(id);
    uiStore.notify('Product deleted successfully', 'success');
    fetchProducts(pagination.current_page);
  } catch (err) {
    uiStore.notify('Failed to delete product', 'error');
  }
}

// Watchers
watch(searchQuery, (val) => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    pagination.current_page = 1;
    fetchProducts(1);
  }, 500);
});

watch(categoryIdFilter, () => {
  pagination.current_page = 1;
  fetchProducts(1);
});

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <AppLayout>
    <div class="space-y-6">
      <!-- Header Actions -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div class="flex flex-1 items-center space-x-4 max-w-2xl">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-slate-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search products..."
              @keyup.enter="handleSearch"
              class="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          
          <div v-if="categoryIdFilter" class="flex items-center bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full text-sm font-medium border border-indigo-100">
            <span>Category Filter Active</span>
            <button @click="clearCategoryFilter" class="ml-2 text-indigo-400 hover:text-indigo-600">
              <X class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <BaseButton @click="openCreateModal">
          <Plus class="h-5 w-5 mr-2" />
          Add Product
        </BaseButton>
      </div>

      <!-- Table Card -->
      <BaseCard class="p-0">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Price</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Quantity</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-if="isLoading" v-for="i in 5" :key="i">
                <td colspan="5" class="px-6 py-4 animate-pulse">
                  <div class="h-4 bg-slate-100 rounded w-full"></div>
                </td>
              </tr>
              <tr v-else-if="products.length === 0">
                <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                  No products found.
                </td>
              </tr>
              <tr v-else v-for="product in products" :key="product.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-900">{{ product.name }}</span>
                    <span class="text-xs text-slate-500 truncate max-w-xs">{{ product.description }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {{ product.category || 'Uncategorized' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                  ${{ Number(product.price).toFixed(2) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="Number(product.quantity) < 10 ? 'text-rose-600 font-bold' : 'text-slate-700'" class="text-sm">
                    {{ product.quantity }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button @click="openEditModal(product)" class="text-indigo-600 hover:text-indigo-900 p-1">
                      <Pencil class="h-5 w-5" />
                    </button>
                    <button @click="handleDelete(product.id)" class="text-rose-600 hover:text-rose-900 p-1">
                      <Trash2 class="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-slate-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <BaseButton
              variant="secondary"
              :disabled="pagination.current_page === 1"
              @click="fetchProducts(pagination.current_page - 1)"
            >
              Previous
            </BaseButton>
            <BaseButton
              variant="secondary"
              :disabled="pagination.current_page === pagination.last_page"
              @click="fetchProducts(pagination.current_page + 1)"
            >
              Next
            </BaseButton>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-slate-700">
                Showing <span class="font-medium">{{ (pagination.current_page - 1) * 5 + 1 }}</span> to <span class="font-medium">{{ Math.min(pagination.current_page * 5, pagination.total) }}</span> of <span class="font-medium">{{ pagination.total }}</span> results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  @click="fetchProducts(pagination.current_page - 1)"
                  :disabled="pagination.current_page === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  <span class="sr-only">Previous</span>
                  <ChevronLeft class="h-5 w-5" />
                </button>
                
                <template v-for="page in pagination.last_page" :key="page">
                  <button
                    v-if="page === 1 || page === pagination.last_page || (page >= pagination.current_page - 2 && page <= pagination.current_page + 2)"
                    @click="fetchProducts(page)"
                    class="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
                    :class="{ 'bg-indigo-50 text-indigo-600 border-indigo-500 z-10': page === pagination.current_page }"
                  >
                    {{ page }}
                  </button>
                  <span 
                    v-else-if="(page === 2 && pagination.current_page > 4) || (page === pagination.last_page - 1 && pagination.current_page < pagination.last_page - 3)"
                    class="relative inline-flex items-center px-4 py-2 border border-slate-300 bg-white text-sm font-medium text-slate-500"
                  >
                    ...
                  </span>
                </template>

                <button
                  @click="fetchProducts(pagination.current_page + 1)"
                  :disabled="pagination.current_page === pagination.last_page"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-slate-300 bg-white text-sm font-medium text-slate-500 hover:bg-slate-50 disabled:opacity-50"
                >
                  <span class="sr-only">Next</span>
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Form Modal -->
    <Modal
      :show="showFormModal"
      :title="editingProduct ? 'Edit Product' : 'Add New Product'"
      @close="showFormModal = false"
    >
      <ProductForm
        :product="editingProduct"
        :loading="isSubmitting"
        @submit="handleFormSubmit"
        @cancel="showFormModal = false"
      />
    </Modal>
  </AppLayout>
</template>
