<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { getCategories } from '@/api/categories';
import type { Category, Product, ProductFormData } from '@/types/product';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';

interface Props {
  product?: Product | null;
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['submit', 'cancel']);

const categories = ref<Category[]>([]);
const form = reactive<ProductFormData>({
  name: props.product?.name || '',
  description: props.product?.description || '',
  sku: props.product?.sku || '',
  price: props.product?.price || '',
  quantity: props.product?.quantity || '',
  category_id: props.product?.category_id || ''
});

const errors = reactive<Record<string, string>>({});

onMounted(async () => {
  try {
    const { data } = await getCategories();
    categories.value = data;
  } catch (err) {
    console.error('Failed to fetch categories');
  }
});

function handleSubmit() {
  emit('submit', form);
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <BaseInput
      v-model="form.name"
      label="Product Name"
      required
      :error="errors.name"
    />

    <BaseInput
      v-model="form.sku"
      label="SKU"
      required
      :error="errors.sku"
    />

    <div class="space-y-1">
      <label class="block text-sm font-medium text-slate-700">Description</label>
      <textarea
        v-model="form.description"
        rows="3"
        class="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      ></textarea>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <BaseInput
        v-model.number="form.price"
        label="Price"
        type="number"
        step="0.01"
        required
        :error="errors.price"
      />
      <BaseInput
        v-model.number="form.quantity"
        label="Quantity"
        type="number"
        required
        :error="errors.quantity"
      />
    </div>

    <div class="space-y-1">
      <label class="block text-sm font-medium text-slate-700">Category</label>
      <select
        v-model="form.category_id"
        required
        class="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="" disabled>Select a category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
    </div>

    <div class="flex justify-end space-x-3 pt-4">
      <BaseButton variant="secondary" @click="$emit('cancel')">
        Cancel
      </BaseButton>
      <BaseButton type="submit" :loading="loading">
        {{ product ? 'Update Product' : 'Create Product' }}
      </BaseButton>
    </div>
  </form>
</template>
