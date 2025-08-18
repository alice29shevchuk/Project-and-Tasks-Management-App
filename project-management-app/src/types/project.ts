export interface Project {
    id: number
    name: string
    description: string
    taskCount: number
    status: 'active' | 'archived' | 'completed'
    createdAt: string
  }
  
  export interface ProjectForm {
    name: string
    description: string
  }