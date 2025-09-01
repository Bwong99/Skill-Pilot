import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const supabase = createClientComponentClient()

// Database types for TypeScript
export type Skill = {
  id: string
  name: string
  category: string
  description?: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  estimated_hours: number
  created_at: string
  updated_at: string
}

export type SkillPath = {
  id: string
  user_id: string
  skill_id: string
  title: string
  description?: string
  target_duration_weeks: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  status: 'not_started' | 'in_progress' | 'completed' | 'paused'
  ai_generated: boolean
  created_at: string
  updated_at: string
  skill?: Skill
}

export type RoadmapMilestone = {
  id: string
  skill_path_id: string
  title: string
  description?: string
  order_index: number
  week_number: number
  estimated_hours: number
  resources: Array<{
    type: 'video' | 'article' | 'book' | 'practice' | 'project'
    title: string
    url?: string
    description?: string
  }>
  completed: boolean
  completed_at?: string
  created_at: string
  updated_at: string
}

export type UserProgress = {
  id: string
  user_id: string
  skill_path_id: string
  milestone_id: string
  hours_logged: number
  notes?: string
  completed_at?: string
  created_at: string
  updated_at: string
}
