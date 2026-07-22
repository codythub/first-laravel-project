<script setup lang="ts">
import { useUiStore } from '@/stores/ui';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-vue-next';

const uiStore = useUiStore();

const typeIcons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info
};

const typeClasses = {
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  error: 'bg-rose-50 text-rose-800 border-rose-200',
  info: 'bg-blue-50 text-blue-800 border-blue-200'
};
</script>

<template>
  <div class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
    <TransitionGroup 
      enter-active-class="transform ease-out duration-300 transition"
      enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
      enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-for="notification in uiStore.notifications"
        :key="notification.id"
        class="flex items-start p-4 border rounded-lg shadow-lg pointer-events-auto overflow-hidden"
        :class="typeClasses[notification.type]"
      >
        <div class="flex-shrink-0">
          <component :is="typeIcons[notification.type]" class="h-5 w-5" />
        </div>
        <div class="ml-3 flex-1 pt-0.5">
          <p class="text-sm font-medium">{{ notification.message }}</p>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            @click="uiStore.removeNotification(notification.id)"
            class="inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <X class="h-4 w-4" />
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>
