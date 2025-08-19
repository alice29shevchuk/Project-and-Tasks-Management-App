import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Task, TaskForm } from '@/types/task'
import { fetchTasks, reorderTasks, createTask, updateTask } from '@/api/tasks'

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  
  const loadTasks = async (projectId: number) => {
    loading.value = true
    try {
      tasks.value = await fetchTasks(projectId)
      tasks.value.sort((a, b) => a.order - b.order)
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

  const createNewTask = async (taskData: TaskForm) => {
    try {
      const response = await createTask(taskData)
      tasks.value.push(response)
      tasks.value.sort((a, b) => a.order - b.order)
      return response
    } catch (error) {
      console.error('Failed to create task:', error)
      throw error
    }
  }

  const updateTaskStatus = async (id: number, status: Task['status']) => {
    try {
      const updated = await updateTask(id, { status })
      const taskIndex = tasks.value.findIndex(t => t.id === id)
      if (taskIndex !== -1) {
        tasks.value[taskIndex].status = updated.status
        tasks.value[taskIndex].order = tasks.value.length + 1
      }
      return updated
    } catch (error) {
      console.error('Failed to update task status:', error)
      throw error
    }
  }  
  
  return {
    tasks,
    loading,
    loadTasks,
    updateTaskOrder,
    createNewTask,
    updateTaskStatus
  }
})