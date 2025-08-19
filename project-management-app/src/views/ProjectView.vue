<script setup lang="ts">
import { ref } from "vue"
import TaskTable from '@/components/tasks/TaskTable.vue'
import TaskBoard from '@/components/tasks/TaskBoard.vue'

const viewMode = ref<'table' | 'board'>('table')
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
