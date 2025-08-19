import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchProjects, createProject, updateProject } from '@/api/projects'
import type { Project, ProjectForm, ProjectUpdate } from '@/types/project'

export const useProjectsStore = defineStore('projects', () => {
  const projects = ref<Project[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const loadProjects = async () => {
    loading.value = true
    try {
      projects.value = await fetchProjects()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  const addProject = async (projectData: ProjectForm) => {
    try {
      const newProject = await createProject(projectData)
      projects.value.push(newProject)
      return newProject
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  const updateExistProject = async (projectId: string, projectData: ProjectUpdate) => {
    try {
      const updatingProject = await updateProject(projectId, projectData)

      const index = projects.value.findIndex(p => p.id === projectId)
      if (index !== -1) {
        projects.value[index] = updatingProject
      }

      return updatingProject
    } catch (err) {
      error.value = (err as Error).message
      throw err
    }
  }

  return {
    projects,
    loading,
    error,
    loadProjects,
    addProject,
    updateExistProject
  }
})
