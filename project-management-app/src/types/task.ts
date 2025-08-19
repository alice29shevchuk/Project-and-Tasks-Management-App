export type TaskStatus = 'todo' | 'in-progress' | 'done'

export interface Task {
  id: string
  projectId: string
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
  projectId: string,
  order?: number
}

export interface TaskReorderPayload {
  id: string
  order: number
}

export interface TaskStatusChangePayload {
  id: string
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