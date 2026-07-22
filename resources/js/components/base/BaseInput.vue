<script setup lang="ts">
interface Props {
  modelValue: string | number;
  label?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-slate-700">
      {{ label }} <span v-if="required" class="text-rose-500">*</span>
    </label>
    <div class="relative">
      <input
        :type="type || 'text'"
        :value="modelValue"
        @input="onInput"
        :placeholder="placeholder"
        class="block w-full px-3 py-2 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
        :class="error ? 'border-rose-300 text-rose-900 placeholder-rose-300' : 'border-slate-300'"
      />
    </div>
    <p v-if="error" class="text-sm text-rose-600">
      {{ error }}
    </p>
  </div>
</template>
