import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task } from '@/types/task'
import { fetchTasks, reorderTasks } from '@/api/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  
  const loadTasks = async (projectId: number) => {
    loading.value = true
    try {
      tasks.value = await fetchTasks(projectId)
    } finally {
      loading.value = false
    }
  }
  
  const updateTaskOrder = async (newOrder: { id: number, order: number }[]) => {
    try {
      await reorderTasks(newOrder)
      newOrder.forEach(item => {
        const task = tasks.value.find(t => t.id === item.id)
        if (task) {
          task.order = item.order
        }
      })
      tasks.value.sort((a, b) => a.order - b.order)
    } catch (error) {
      console.error('Failed to reorder tasks:', error)
      throw error
    }
  }
  
  return {
    tasks,
    loading,
    loadTasks,
    updateTaskOrder
  }
})