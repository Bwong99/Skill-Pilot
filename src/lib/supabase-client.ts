// This module is deliberately free of side effects. It used to construct a
// client at module scope, which throws outright when the environment variables
// are absent, so merely importing anything from here took down every page that
// did. Nothing referenced that client anyway: each page builds its own with
// createClientComponentClient().

// Both values are NEXT_PUBLIC_, so Next inlines them at build time and this
// answers correctly in the browser. Pages that read from Supabase check it
// first and render a placeholder rather than querying a client that has no
// project to talk to, which is what left them spinning indefinitely.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

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
