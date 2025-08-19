<script setup lang="ts">
import { useToastStore } from '@/stores/toast'
const toast = useToastStore()
</script>

<template>
    <div v-if="toast.show" class="toast-notification position-fixed top-0 end-0 m-3 p-3 bg-success text-white rounded shadow">
      {{ toast.message }}
    </div>
</template>
  
<style scoped>
  .toast-notification {
    z-index: 1050;
    transition: opacity 0.3s ease;
  }
</style>
  