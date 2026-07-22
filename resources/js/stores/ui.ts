import { defineStore } from 'pinia';
import { ref } from 'vue';

interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

export const useUiStore = defineStore('ui', () => {
  const notifications = ref<Notification[]>([]);
  const sidebarOpen = ref(false);
  let nextId = 1;

  function toggleSidebar() {
    sidebarOpen.value = !sidebarOpen.value;
  }

  function notify(message: string, type: 'success' | 'error' | 'info' = 'info') {
    const id = nextId++;
    notifications.value.push({ id, message, type });
    
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }

  function removeNotification(id: number) {
    notifications.value = notifications.value.filter(n => n.id !== id);
  }

  return {
    notifications,
    notify,
    removeNotification
  };
});
