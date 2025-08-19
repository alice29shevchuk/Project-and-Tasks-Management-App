export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: number
  projectId: number
  title: string
  assignee: string
  status: TaskStatus
  dueDate: string
  order: number
}

export interface TaskForm {
  title: string
  assignee: string
  status: TaskStatus
  dueDate: string
  projectId: number
}

export interface TaskReorderPayload {
  id: number
  order: number
}

export interface TaskStatusChangePayload {
  id: number
  newStatus: TaskStatus
}

export interface TaskFilter {
  assignee?: string
  status?: TaskStatus
}

export interface TaskSort {
  field: 'dueDate' | 'status' | 'title' | 'assignee'
  direction: 'asc' | 'desc'
}