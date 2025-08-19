<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TaskForm } from '@/types/task'
import { useRoute } from 'vue-router'
import { useTasksStore } from '@/stores/tasks'

const emit = defineEmits(['cancel', 'task-added'])

const today = new Date().toISOString().split('T')[0]

const route = useRoute();
const projectId = Number(route.params.id);

const tasksStore = useTasksStore();

const form = ref<TaskForm>({
  title: '',
  assignee: '',
  status: 'todo',
  dueDate: today,
  projectId: projectId
})
const loading = ref(false)
const errors = ref<{[key:string]: string}>({})

const validateForm = () => {
  errors.value = {}

  if (!form.value.title.trim()) {
    errors.value.name = 'Назва обовʼязкова'
  } else if (form.value.title.length < 3 || form.value.title.length > 120) {
    errors.value.name = 'Назва повинна містити від 3 до 120 символів'
  }

  if (!form.value.status) {
    errors.value.status = 'Статус обовʼязковий'
  }

  if (form.value.dueDate < today) {
    errors.value.dueDate = 'Дата повинна бути сьогодні або пізніше'
  }

  return Object.keys(errors.value).length === 0
}

const isFormValid = computed(() => {
  return (
    form.value.title.trim().length >= 3 &&
    form.value.title.trim().length <= 120 &&
    form.value.status &&
    form.value.dueDate >= today
  )
})

const submitForm = async () => {
  if (!validateForm()) return

  loading.value = true
  try {
    // await createTask(form.value)
    const maxOrder = tasksStore.tasks.length
      ? Math.max(...tasksStore.tasks.map(t => t.order))
      : 0
    const newTaskData = { ...form.value, order: maxOrder + 1 }
    await tasksStore.createNewTask(newTaskData)

    emit('task-added')
    form.value = { title: '', assignee: '', status: 'todo', dueDate: today, projectId: projectId }
  } catch (err) {
    console.error('Помилка при додаванні завдання:', err)
    alert('Помилка при додаванні завдання')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="p-1">
    <div class="mb-3">
      <label class="form-label">Назва завдання*</label>
      <input 
        v-model="form.title" 
        type="text" 
        class="form-control" 
        placeholder="Введіть назву"
        required
      >
      <div v-if="errors.name" class="text-danger small">{{ errors.name }}</div>
    </div>
    
    <div class="mb-3">
      <label class="form-label">Виконавець</label>
      <select v-model="form.assignee" class="form-select">
        <option value="">(Не вибрано)</option>
        <option value="Максим Резніченко">Максим Резніченко</option>
        <option value="Марія Зайцева">Марія Зайцева</option>
        <option value="Олег Швец">Олег Швец</option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">Статус*</label>
      <select v-model="form.status" class="form-select" required>
        <option value="todo">До виконання</option>
        <option value="in-progress">В процесі</option>
        <option value="done">Виконано</option>
      </select>
      <div v-if="errors.status" class="text-danger small">{{ errors.status }}</div>
    </div>

    <div class="mb-3">
      <label class="form-label">Термін виконання*</label>
      <input 
        v-model="form.dueDate" 
        type="date" 
        class="form-control"
        :min="today"
        required
      >
      <div v-if="errors.dueDate" class="text-danger small">{{ errors.dueDate }}</div>
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
        :disabled="loading || !isFormValid"
      >
        <span v-if="loading">Збереження...</span>
        <span v-else>Зберегти</span>
      </button>
    </div>
  </form>
</template>
