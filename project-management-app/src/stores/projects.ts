import { defineStore } from 'pinia'
import { fetchProjects, createProject } from '@/api/projects'
import type { Project, ProjectForm } from '@/types/project'

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
    error: null as string | null
  }),
  actions: {
    async loadProjects() {
      this.loading = true
      try {
        this.projects = await fetchProjects()
      } catch (error) {
        this.error = (error as Error).message
      } finally {
        this.loading = false
      }
    },
    async addProject(projectData: ProjectForm) {
      try {
        const newProject = await createProject(projectData)
        this.projects.push(newProject)
        return newProject
      } catch (error) {
        this.error = (error as Error).message
        throw error
      }
    }
  }
})