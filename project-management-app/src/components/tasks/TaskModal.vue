<script setup lang="ts">
import { ref, watch } from 'vue'
import TaskForm from '@/components/tasks/TaskForm.vue';

const props = defineProps<{
  title?: string
  show: boolean,
}>()

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'task-added'): void
}>()

const close = () => {
  emit('update:show', false)
}

const handleTaskAdded = () => {
  close()
  emit('task-added')
}

const showForm = ref(false)
watch(() => props.show, (val) => {
  showForm.value = val
})
</script>

<template>
  <div v-if="show" class="modal-backdrop" @click.self="close">
    <div class="modal-content">
      <header class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="close">✖</button>
      </header>
      <div class="modal-body">
        <TaskForm 
          v-if="showForm"
          @task-added="handleTaskAdded"
          @cancel="close"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 500px;
  max-width: 90%;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.close-btn {
  border: none;
  background: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.modal-body {
  max-height: 70vh;
  overflow-y: auto;
}
</style>