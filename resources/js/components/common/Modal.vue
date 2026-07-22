<script setup lang="ts">
import { X } from 'lucide-vue-next';

interface Props {
  show: boolean;
  title?: string;
}

defineProps<Props>();
defineEmits(['close']);
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="show" class="fixed inset-0 bg-slate-500 bg-opacity-75 transition-opacity z-40" @click="$emit('close')"></div>
    </Transition>

    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div class="flex justify-between items-center mb-4">
                <h3 v-if="title" class="text-lg font-semibold text-slate-900">{{ title }}</h3>
                <button @click="$emit('close')" class="text-slate-400 hover:text-slate-500">
                  <X class="h-5 w-5" />
                </button>
              </div>
              <slot />
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>
