<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import TaskTable from '@/components/tasks/TaskTable.vue'
import TaskBoard from '@/components/tasks/TaskBoard.vue'

const VIEW_MODE_KEY = 'project-view-mode'

const viewMode = ref<'table' | 'board'>('table')

onMounted(() => {
  const saved = localStorage.getItem(VIEW_MODE_KEY)
  if (saved === 'table' || saved === 'board') {
    viewMode.value = saved
  }
})

watch(viewMode, (newValue) => {
  localStorage.setItem(VIEW_MODE_KEY, newValue)
})
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Деталі проекту</h2>
    <div class="d-flex justify-content-between align-items-center mb-2">
      <div class="form-check form-switch">
        <input
          class="form-check-input"
          type="checkbox"
          role="switch"
          id="viewSwitch"
          v-model="viewMode"
          true-value="board"
          false-value="table"
        />
        <label class="form-check-label" for="viewSwitch">
          {{ viewMode === 'table' ? 'Таблиця' : 'Дошка' }}
        </label>
      </div>
    </div>

    <TaskTable v-if="viewMode === 'table'" />
    <TaskBoard v-else-if="viewMode === 'board'" />
  </div>
</template>
