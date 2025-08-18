<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { fetchProjects } from '@/api/projects'
import type { Project } from '@/types/project'
import { useRouter } from 'vue-router'
import 'bootstrap/dist/css/bootstrap.min.css'
import AppModal from '@/components/common/AppModal.vue'
import AppTable from '@/components/common/AppTable.vue'

const router = useRouter()

const allProjects = ref<Project[]>([])

const filteredProjects = computed(() => {
  return allProjects.value.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(filters.value.search.toLowerCase())
    const matchesStatus = !filters.value.status || project.status === filters.value.status
    return matchesSearch && matchesStatus
  })
})

const loading = ref(false)

const columns = [
  { label: 'ID', field: 'id', width: '5%', sortable: true, isKey: true },
  { label: 'Назва проекту', field: 'name',width: '15%', sortable: true },
  { label: 'Кількість завдань', field: 'taskCount',width: '5%', sortable: true },
  { label: 'Статус', field: 'status', width: '10%',sortable: true },
  { label: 'Дата створення', field: 'createdAt', width: '10%',sortable: false },
]

const filters = ref({
  search: '',
  status: '' as '' | 'active' | 'completed'
})

const currentPage = ref(1)

const loadProjects = async () => {
  loading.value = true
  try {
    const response = await fetchProjects()
    allProjects.value = response
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const handleFilterChange = () => {
  currentPage.value = 1
  loadProjects()
}

onMounted(async() => await loadProjects())

const viewDetails = (id: number) => {
    router.push(`/projects/${id}`)
}

const showModal = ref(false)

const addNewProject = () => {
  showModal.value = true
}

const handleProjectAdded = () => {
  showModal.value = false
  loadProjects()
}
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
          Add New
        </button>
      </div>
      
      <!-- <VueTableLite
        :is-static-mode="true"
        :is-loading="loading"
        :columns="columns"
        :rows="filteredProjects"
        :total="filteredProjects.length"
        @is-finished="loading = false"
        @row-clicked="(row) => viewDetails(row.id)"
      /> -->
      
      <AppTable
        :columns="columns"
        :data="filteredProjects"
        :loading="loading"
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