<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import draggable from 'vuedraggable';
import type { Task } from '@/types/task';
import { useRoute } from 'vue-router';
import TaskModal from '@/components/tasks/TaskModal.vue';
import { useTasksStore } from '@/stores/tasks';
import { useProjectsStore } from '@/stores/projects'

const loading = ref(false);
const tasks = ref<Task[]>([]);

const statuses = ['todo', 'in-progress', 'done'];

const route = useRoute();
const projectId = Number(route.params.id);

const tasksStore = useTasksStore()
const projectsStore = useProjectsStore()

const loadTasks = async () => {
  loading.value = true;
  try {
    await tasksStore.loadTasks(projectId)
    tasks.value = [...tasksStore.tasks];
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

const onColumnChange = async (
  event: { moved?: { element: Task; newIndex: number; oldIndex: number }; added?: { element: Task; newIndex: number } },
  targetStatus: string
) => {
  if (event.added) {
    const task = event.added.element;
    await tasksStore.updateTaskStatus(task.id, targetStatus as Task['status']);
  } else if (event.moved) {
    const task = event.moved.element;
    if (task.status !== targetStatus) {
      await tasksStore.updateTaskStatus(task.id, targetStatus as Task['status']);
    }
  }
  
  await loadTasks();
  await updateProjectStatusIfCompleted();
};

const onDragEnd = async () => {
  const orderedTasks: Task[] = [];
  
  statuses.forEach(status => {
    orderedTasks.push(...tasksByStatus.value[status]);
  });

  const newOrder = orderedTasks.map((task, index) => ({
    id: task.id,
    order: index + 1
  }));

  try {
    await tasksStore.updateTaskOrder(newOrder);
    await loadTasks();
    await updateProjectStatusIfCompleted();
  } catch (error) {
    console.error('Ошибка при сохранении порядка:', error);
    await loadTasks();
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

const updateProjectStatusIfCompleted = async () => {
  if (!tasks.value.length) return

  const allDone = tasks.value.every(t => t.status === 'done')
  const newStatus = allDone ? 'completed' : 'active'
  const newTaskCount = tasks.value.length

  try {
    await projectsStore.updateExistProject(projectId, {
      status: newStatus,
      taskCount: newTaskCount
    })
  } catch (err) {
    console.error('Не удалось обновить проект:', err)
  }
}

</script>

<template>
  <div v-if="loading" class="loading">Завантаження...</div>

  <div v-else class="kanban-board-wrapper">

    <div v-if="tasks.length === 0" class="d-flex flex-column justify-content-center align-items-center py-5 border rounded bg-light">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-inbox mb-3 text-muted" viewBox="0 0 16 16">
        <path d="M4.98 3.5a.5.5 0 0 0-.49.598L5.57 10H10.43l1.08-5.902a.5.5 0 0 0-.49-.598H4.98zM2 2a2 2 0 0 0-2 2v7c0 1.105.895 2 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm12 10H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"/>
      </svg>
      <h5 class="text-muted">Немає завдань</h5>
      <p class="text-secondary mb-3">Додайте нове завдання, щоб почати роботу</p>
      <button class="btn btn-primary" @click="showModal = true">
        Add New Task
      </button>
    </div>

    <div v-else>
      <div class="kanban-topbar mb-2">
        <button class="btn btn-primary" @click="showModal = true">
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
            @end="onDragEnd"
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

.task-assignee, .task-deadline, .task-order {
  font-size: 0.9em;
  color: #555;
}

.task-order {
  font-style: italic;
  margin-top: 4px;
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