<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import AppModal from '@/components/common/AppModal.vue'
import AppTable from '@/components/common/AppTable.vue'
import { useProjectsStore } from '@/stores/projects'

const router = useRouter()
const projectsStore = useProjectsStore()

const FILTER_STORAGE_KEY = 'projects_filters';

const filters = ref({
  search: '',
  status: '' as '' | 'active' | 'completed'
})

const filteredProjects = computed(() => {
  return projectsStore.projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchesStatus = !filters.value.status || project.status === filters.value.status
    return matchesSearch && matchesStatus
  })
})

const handleFilterChange = async() => {
  localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filters.value))
  await projectsStore.loadProjects()
}

onMounted(async () => {
  const savedFilters = localStorage.getItem(FILTER_STORAGE_KEY)
  if (savedFilters) {
    Object.assign(filters.value, JSON.parse(savedFilters))
  }
  await projectsStore.loadProjects()
})

const viewDetails = (id: number) => {
    router.push(`/projects/${id}`)
}

const showModal = ref(false)
const addNewProject = () => showModal.value = true

const handleProjectAdded = async() => {
  showModal.value = false
  await projectsStore.loadProjects()
}

const columns = [
  { label: 'ID', field: 'id', width: '5%', sortable: true, isKey: true },
  { label: 'Назва проекту', field: 'name', width: '15%', sortable: true },
  { label: 'Кількість завдань', field: 'taskCount', width: '5%', sortable: true },
  { label: 'Статус', field: 'status', width: '10%', sortable: true },
  { label: 'Дата створення', field: 'createdAt', width: '10%', sortable: false },
]
</script>

<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex gap-2">
        <input
          v-model="filters.search"
          placeholder="Пошук за назвою"
          @input="handleFilterChange"
          class="form-control"
          style="min-width: 200px;"
        />
        <select 
          v-model="filters.status" 
          @change="handleFilterChange"
          class="form-select"
          style="min-width: 150px;"
        >
          <option value="">Всі статуси</option>
          <option value="active">Активні</option>
          <option value="completed">Завершені</option>
        </select>
      </div>

      <button @click="addNewProject" class="btn btn-primary">
        Add New Project
      </button>
    </div>

    <div 
      v-if="!projectsStore.loading && projectsStore.projects.length === 0" 
      class="d-flex flex-column justify-content-center align-items-center py-5 border rounded bg-light"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
          width="48" height="48" 
          fill="currentColor" 
          class="bi bi-folder2-open mb-3 text-muted" 
          viewBox="0 0 16 16">
        <path d="M.54 3.87.5 3.98V13a2 2 0 0 0 2 2h11.5a2 2 0 0 0 2-2V5.98a2 2 0 0 0-2-2H8.828a2 2 0 0 1-1.414-.586L6.172 2.414A2 2 0 0 0 4.757 1.828H2.5a2 2 0 0 0-1.96 2.042z"/>
      </svg>
      <h5 class="text-muted">Немає проектів</h5>
      <p class="text-secondary mb-0">Додайте новий проект, щоб почати</p>
    </div>

    <div 
      v-else-if="!projectsStore.loading && projectsStore.projects.length > 0 && filteredProjects.length === 0" 
      class="d-flex flex-column justify-content-center align-items-center py-5 border rounded bg-light"
    >
      <svg xmlns="http://www.w3.org/2000/svg" 
          width="48" height="48" 
          fill="currentColor" 
          class="bi bi-search mb-3 text-muted" 
          viewBox="0 0 16 16">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001l3.85 3.85a1 1 0 0 0 
                 1.415-1.414l-3.85-3.85zm-5.242.656a5 
                 5 0 1 1 0-10 5 5 0 0 1 0 10z"/>
      </svg>
      <h5 class="text-muted">Нічого не знайдено</h5>
      <p class="text-secondary mb-0">Спробуйте зняти або змінити фільтри</p>
    </div>

    <AppTable
      v-else
      :columns="columns"
      :data="filteredProjects"
      :loading="projectsStore.loading"
      @row-clicked="(row) => viewDetails(row.id)"
    />

    <AppModal 
      :show="showModal" 
      title="Додати новий проект"
      @update:show="val => showModal = val"
      @project-added="handleProjectAdded"
    />
  </div>
</template>

