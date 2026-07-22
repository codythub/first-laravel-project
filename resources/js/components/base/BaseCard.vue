<template>
  <div class="bg-white shadow-sm border border-slate-200 rounded-lg overflow-hidden">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-slate-200">
      <slot name="header" />
    </div>
    <div class="px-6 py-4">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 bg-slate-50 border-t border-slate-200">
      <slot name="footer" />
    </div>
  </div>
</template>
