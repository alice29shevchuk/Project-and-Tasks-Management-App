<script setup lang="ts">
import { ref } from 'vue'
import { useProjectsStore } from '@/stores/projects'

const emit = defineEmits(['cancel', 'project-added'])

const projectsStore = useProjectsStore()

const form = ref({
  name: '',
  description: '',
  taskCount: 0,
  status: 'active',
})
const loading = ref(false)

const submitForm = async () => {
  if (!form.value.name.trim()) {
    alert('Вкажіть назву проекту')
    return
  }

  loading.value = true
  try {
    await projectsStore.addProject({
      ...form.value,
    })
    emit('project-added')
    form.value = { name: '', description: '', taskCount: 0, status: 'active' }
  } catch (err) {
    console.error('Помилка при додаванні проекту:', err)
    alert('Помилка при додаванні проекту')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="p-1">
    <div class="mb-3">
      <label class="form-label">Назва проекту*</label>
      <input 
        v-model="form.name" 
        type="text" 
        class="form-control" 
        required
        placeholder="Введіть назву"
      >
    </div>
    
    <div class="mb-3">
      <label class="form-label">Опис</label>
      <textarea
        v-model="form.description"
        class="form-control"
        rows="3"
        placeholder="Введіть опис"
      ></textarea>
    </div>
    
    <div class="d-flex justify-content-end gap-2">
      <button 
        type="button" 
        class="btn btn-secondary"
        @click="$emit('cancel')"
      >
        Скасувати
      </button>
      <button 
        type="submit" 
        class="btn btn-primary"
        :disabled="loading || !form.name.trim()"
      >
        <span v-if="loading">Збереження...</span>
        <span v-else>Зберегти</span>
      </button>
    </div>
  </form>
</template>