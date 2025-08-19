<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import draggable from 'vuedraggable';
import type { Task } from '@/types/task';
import { fetchTasks } from '@/api/tasks';
import { useRoute } from 'vue-router';
import TaskModal from '@/components/tasks/TaskModal.vue';

const loading = ref(false);
const tasks = ref<Task[]>([]);

const statuses = ['todo', 'in-progress', 'done'];

const route = useRoute();
const projectId = Number(route.params.id);

const loadTasks = async () => {
  loading.value = true;
  try {
    tasks.value = await fetchTasks(projectId);
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const tasksByStatus = computed(() => {
  const result: Record<string, Task[]> = {};
  statuses.forEach(status => {
    result[status] = tasks.value.filter(task => task.status === status);
  });
  return result;
});

const onColumnChange = (
  event: { moved?: { element: Task; newIndex: number; oldIndex: number }; added?: { element: Task; newIndex: number } },
  targetStatus: string
) => {
  if (event.added) {
    const task = event.added.element;
    const taskIndex = tasks.value.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      tasks.value[taskIndex].status = targetStatus;
    }
  } else if (event.moved) {
    const task = event.moved.element;
    const taskIndex = tasks.value.findIndex(t => t.id === task.id);
    if (taskIndex !== -1) {
      tasks.value[taskIndex].status = targetStatus;
      tasks.value.splice(taskIndex, 1);
      tasks.value.splice(event.moved.newIndex, 0, task);
    }
  }
};

onMounted(async() => {
  await loadTasks();
});

function formatStatus(status: string) {
  return status
    .split('-')
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(' ')
}

const showModal = ref(false);
const handleTaskAdded = async() => {
    showModal.value = false;
    await loadTasks();
};
</script>

<template>
  <div v-if="loading" class="loading">Завантаження...</div>
  
  <div v-else class="kanban-board-wrapper">
    <div class="kanban-topbar">
      <button class="btn btn-primary mb-2" @click="showModal = true">
        Add New Task
      </button>
    </div>

    <div class="kanban-board">
      <div 
        v-for="status in statuses" 
        :key="status" 
        class="kanban-column"
      >
        <h3>{{ formatStatus(status) }}</h3>
        
        <draggable
          :list="tasksByStatus[status]"
          group="tasks"
          item-key="id"
          class="drag-column"
          @change="onColumnChange($event, status)"
          :animation="200"
          ghost-class="ghost-card"
          drag-class="dragging-card"
        >
          <template #item="{ element: task }">
            <div class="task-card">
              <div class="task-title">{{ task.title }}</div>
              <div v-if="task.assignee" class="task-assignee">👤 {{ task.assignee }}</div>
              <div class="task-deadline">📅 {{ task.dueDate }}</div>
            </div>
          </template>

          <template #footer>
            <div v-if="tasksByStatus[status].length === 0" class="empty-column">
              Перетягніть завдання сюди
            </div>
          </template>
        </draggable>
      </div>
    </div>

    <TaskModal 
      :show="showModal" 
      title="Додати нове завдання"
      @update:show="val => showModal = val"
      @task-added="handleTaskAdded"
    />
  </div>
</template>

<style scoped>
.loading {
  padding: 20px;
  text-align: center;
  font-size: 1.2em;
  color: #666;
}

.kanban-board {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  min-height: 400px;
}

.kanban-column {
  flex: 1;
  min-width: 250px;
  background: #f5f5f5;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.kanban-column h3 {
  margin: 0 0 12px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #ddd;
}

.drag-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 100px;
}

.task-card {
  background: white;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  cursor: grab;
}

.task-title {
  font-weight: bold;
  margin-bottom: 6px;
}

.task-assignee, .task-deadline {
  font-size: 0.9em;
  color: #555;
}

.empty-column {
  background: #eee;
  border: 2px dashed #ccc;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
  color: #777;
}

.ghost-card {
  opacity: 0.5;
  background: #f7f7f7;
  border: 2px dashed #4CAF50;
}

.dragging-card {
  cursor: grabbing;
  transform: rotate(2deg);
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}
</style>