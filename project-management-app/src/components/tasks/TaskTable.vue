<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import draggable from "vuedraggable";
import type { Task } from '@/types/task';
import { fetchTasks } from '@/api/tasks';
import { useRoute } from 'vue-router';
import TaskModal from '@/components/tasks/TaskModal.vue'

const emit = defineEmits(["update:tasks", "statusChanged"]);

const loading = ref(false);
const originalTasks = ref<Task[]>([]);
const displayedTasks = ref<Task[]>([]);

const columnWidths = ref<Record<string, string>>({
  id: '80px',
  title: '200px',
  assignee: '150px',
  status: '120px',
  dueDate: '120px'
});

const filters = ref({
  assignee: '',
  status: ''
});

const sortConfig = ref({
  field: '',
  direction: '' as 'asc' | 'desc' | ''
});

const route = useRoute();
const projectId = Number(route.params.id);


const loadTasks = async () => {
  loading.value = true;
  try {
    const response = await fetchTasks(projectId);
    originalTasks.value = response;
    applyFiltersAndSorting();
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const applyFiltersAndSorting = () => {
  let result = [...originalTasks.value];

  result = result.filter(task => {
    if (filters.value.assignee && 
        !task.assignee.toLowerCase().includes(filters.value.assignee.toLowerCase())) {
      return false;
    }
    if (filters.value.status && task.status !== filters.value.status) {
      return false;
    }
    return true;
  });

  if (sortConfig.value.field) {
    result.sort((a, b) => {
      const field = sortConfig.value.field as keyof Task;
      if (a[field] < b[field]) {
        return sortConfig.value.direction === 'asc' ? -1 : 1;
      }
      if (a[field] > b[field]) {
        return sortConfig.value.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  displayedTasks.value = result;
};

watch(filters, () => {
  applyFiltersAndSorting();
}, { deep: true });

const onDragEnd = () => {
  originalTasks.value = [...displayedTasks.value];
  applyFiltersAndSorting();
  emit("update:tasks", originalTasks.value);
};

const sortTable = (field: string) => {
  if (sortConfig.value.field === field) {
    sortConfig.value.direction = 
      sortConfig.value.direction === 'asc' ? 'desc' : 
      sortConfig.value.direction === 'desc' ? '' : 'asc';
  } else {
    sortConfig.value.field = field;
    sortConfig.value.direction = 'asc';
  }
  
  if (sortConfig.value.direction === '') {
    sortConfig.value.field = '';
  }
  
  applyFiltersAndSorting();
};

const startResize = (event: MouseEvent, column: string) => {
  const startX = event.pageX;
  const startWidth = parseInt(columnWidths.value[column]);

  const doResize = (moveEvent: MouseEvent) => {
    const newWidth = startWidth + (moveEvent.pageX - startX);
    columnWidths.value[column] = `${Math.max(50, newWidth)}px`;
  };

  const stopResize = () => {
    document.removeEventListener('mousemove', doResize);
    document.removeEventListener('mouseup', stopResize);
  };

  document.addEventListener('mousemove', doResize);
  document.addEventListener('mouseup', stopResize);
};

onMounted(async()=> await loadTasks());

const showModal = ref(false);
const handleTaskAdded = async() => {
    showModal.value = false;
    await loadTasks();
};
</script>

<template>
  <div v-if="loading" class="text-center">Завантаження...</div>
  
    <div 
        v-else-if="originalTasks.length === 0" 
        class="d-flex flex-column justify-content-center align-items-center py-5 border rounded bg-light"
    >
        <svg xmlns="http://www.w3.org/2000/svg" 
            width="48" height="48" 
            fill="currentColor" 
            class="bi bi-inbox mb-3 text-muted" 
            viewBox="0 0 16 16">
            <path d="M4.98 3.5a.5.5 0 0 0-.49.598L5.57 10H10.43l1.08-5.902a.5.5 0 0 0-.49-.598H4.98zM2 2a2 2 0 0 0-2 2v7c0 1.105.895 2 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H2zm12 10H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1z"/>
        </svg>
        <h5 class="text-muted">Немає завдань</h5>
        <p class="text-secondary mb-0">Додайте нове завдання, щоб почати роботу</p>
    </div>

    <div v-else class="table-container">
        <button class="btn btn-primary mb-2" @click="showModal = true">
          Add New Task
      </button>
        <div class="filters mb-3">
        <div class="row">
            <div class="col-md-6">
            <label>Фільтр по виконавцю:</label>
            <input 
                v-model="filters.assignee" 
                type="text" 
                class="form-control" 
                placeholder="Введіть ім'я"
                @input="applyFiltersAndSorting"
            >
            </div>
            <div class="col-md-6">
            <label>Фільтр по статусу:</label>
            <select v-model="filters.status" class="form-control" @change="applyFiltersAndSorting">
                <option value="">Всі статуси</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
            </select>
            </div>
        </div>
        </div>

        <table class="table table-bordered table-hover">
        <thead class="table-dark">
            <tr>
            <th :style="{ width: columnWidths.id }" @click="sortTable('id')">
                ID
                <span v-if="sortConfig.field === 'id'" class="sort-icon">
                {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                </span>
                <span class="resize-handle" @mousedown="startResize($event, 'id')"></span>
            </th>
            <th :style="{ width: columnWidths.title }" @click="sortTable('title')">
                Назва завдання
                <span v-if="sortConfig.field === 'title'" class="sort-icon">
                {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                </span>
                <span class="resize-handle" @mousedown="startResize($event, 'title')"></span>
            </th>
            <th :style="{ width: columnWidths.assignee }" @click="sortTable('assignee')">
                Виконавець
                <span v-if="sortConfig.field === 'assignee'" class="sort-icon">
                {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                </span>
                <span class="resize-handle" @mousedown="startResize($event, 'assignee')"></span>
            </th>
            <th :style="{ width: columnWidths.status }" @click="sortTable('status')">
                Статус
                <span v-if="sortConfig.field === 'status'" class="sort-icon">
                {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                </span>
                <span class="resize-handle" @mousedown="startResize($event, 'status')"></span>
            </th>
            <th :style="{ width: columnWidths.dueDate }" @click="sortTable('dueDate')">
                Термін виконання
                <span v-if="sortConfig.field === 'dueDate'" class="sort-icon">
                {{ sortConfig.direction === 'asc' ? '↑' : '↓' }}
                </span>
                <span class="resize-handle" @mousedown="startResize($event, 'dueDate')"></span>
            </th>
            </tr>
        </thead>

        <draggable 
            v-model="displayedTasks"
            tag="tbody"
            item-key="id"
            @end="onDragEnd"
        >
            <template #item="{ element }">
            <tr class="task-row">
                <td>{{ element.id }}</td>
                <td>{{ element.title }}</td>
                <td>{{ element.assignee }}</td>
                <td>{{ element.status }}</td>
                <td>{{ element.dueDate }}</td>
            </tr>
            </template>
        </draggable>
        </table>

        <TaskModal 
            :show="showModal" 
            title="Додати нове завдання"
            @update:show="val => showModal = val"
            @task-added="handleTaskAdded"
      />
    </div>
</template>

<style scoped>
.table-container {
  overflow-x: auto;
}

.task-row {
  background: white;
  transition: all 0.3s;
  cursor: move;
  user-select: none;
}

.task-row.sortable-chosen {
  background: #e3f2fd;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.task-row.sortable-ghost {
  opacity: 0.5;
  background: #c8e6c9;
}

.sort-icon {
  margin-left: 5px;
}

th {
  position: relative;
  cursor: pointer;
  user-select: none;
}

.resize-handle {
  display: inline-block;
  width: 6px;
  height: 100%;
  background: transparent;
  cursor: col-resize;
  position: absolute;
  right: 0;
  top: 0;
}
.resize-handle:hover {
  background: #aaa;
}

.filters {
  background: #f8f9fa;
  border-radius: 5px;
}
</style>