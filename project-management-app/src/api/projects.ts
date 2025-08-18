import apiClient from './http'
import type { Project, ProjectForm } from '@/types/project'

export const fetchProjects = async (): Promise<Project[]> => {
    try {
      const response = await apiClient.get('/projects')
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  }

export const getProjectById = async (id: number): Promise<Project> => {
  try {
    const response = await apiClient.get(`/projects/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error)
    throw error
  }
}

export const createProject = async (projectData: ProjectForm): Promise<Project> => {
  try {
    const response = await apiClient.post('/projects', {
      ...projectData,
      taskCount: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    })
    return response.data
  } catch (error) {
    console.error('Error creating project:', error)
    throw error
  }
}

export const updateProject = async (id: number, projectData: Partial<ProjectForm>): Promise<Project> => {
  try {
    const response = await apiClient.patch(`/projects/${id}`, projectData)
    return response.data
  } catch (error) {
    console.error(`Error updating project ${id}:`, error)
    throw error
  }
}

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`/projects/${id}`)
  } catch (error) {
    console.error(`Error deleting project ${id}:`, error)
    throw error
  }
}