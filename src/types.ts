export type Status = 'planned' | 'in-progress' | 'done'

export interface RoadmapItem {
  id: string
  title: string
  description: string
  status: Status
  priority: 'low' | 'medium' | 'high'
  startDate?: string
  endDate?: string
  createdAt: string
}

export interface Roadmap {
  id: string
  name: string
  description: string
  items: RoadmapItem[]
  createdAt: string
}
