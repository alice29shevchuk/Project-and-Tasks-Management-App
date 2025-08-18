import apiClient from './http'
import type { Task, TaskForm } from '@/types/task'

export const fetchTasks = async (projectId: number): Promise<Task[]> => {
  const response = await apiClient.get('/tasksCRUD', {
    params: { projectId }
  })
  return response.data
}

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await apiClient.get(`/tasksCRUD/${id}`)
  return response.data
}

export const createTask = async (taskData: TaskForm): Promise<Task> => {
  const response = await apiClient.post('/tasksCRUD', taskData)
  return response.data
}

export const updateTask = async (id: number, taskData: Partial<TaskForm>): Promise<Task> => {
  const response = await apiClient.patch(`/tasksCRUD/${id}`, taskData)
  return response.data
}

export const deleteTask = async (id: number): Promise<void> => {
  await apiClient.delete(`/tasksCRUD/${id}`)
}

export const reorderTasks = async (newOrder: { id: number, order: number }[]): Promise<void> => {
  await apiClient.patch('/tasksCRUD/reorder', { newOrder })
}