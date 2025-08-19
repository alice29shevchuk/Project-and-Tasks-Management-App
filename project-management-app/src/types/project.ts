export interface Project {
    id: string
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

  export type ProjectUpdate = Partial<Pick<Project, 'name' | 'description' | 'taskCount' | 'status'>>