'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

type SkillPath = {
  id: string
  user_id: string
  title: string
  description: string
  target_duration_weeks: number
  difficulty_level: string
  status: string
  created_at: string
  skill: {
    name: string
    category: string
  }
}

type Milestone = {
  id: string
  title: string
  description: string
  week_number: number
  estimated_hours: number
  completed: boolean
  resources: Array<{
    type: string
    title: string
    description?: string
    url?: string
    duration?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    platform?: string
    section?: string
    chapter?: string
  }>
  exercises?: Array<{
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    estimated_time: string
    type: 'coding' | 'reading' | 'practice' | 'project'
  }>
}

export default function SkillPathPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [skillPath, setSkillPath] = useState<SkillPath | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user && params.pathId) {
      loadSkillPath()
    }
  }, [user, params.pathId])

  const loadSkillPath = async () => {
    try {
      console.log('Loading skill path:', params.pathId)
      
      // Load skill path with skill details
      const { data: pathData, error: pathError } = await supabase
        .from('skill_paths')
        .select(`
          *,
          skill:skills(name, category)
        `)
        .eq('id', params.pathId)
        .eq('user_id', user?.id)
        .single()

      if (pathError) {
        console.error('Error loading skill path:', pathError)
        throw new Error('Failed to load skill path')
      }

      setSkillPath(pathData)

      // Load milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('roadmap_milestones')
        .select('*')
        .eq('skill_path_id', params.pathId)
        .order('week_number')

      if (milestonesError) {
        console.error('Error loading milestones:', milestonesError)
        throw new Error('Failed to load milestones')
      }

      setMilestones(milestonesData || [])
      
    } catch (error: any) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleMilestoneComplete = async (milestoneId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('roadmap_milestones')
        .update({ 
          completed: !completed,
          completed_at: !completed ? new Date().toISOString() : null
        })
        .eq('id', milestoneId)

      if (error) throw error

      // Update local state
      setMilestones(milestones.map(m => 
        m.id === milestoneId 
          ? { ...m, completed: !completed }
          : m
      ))
    } catch (error) {
      console.error('Error updating milestone:', error)
    }
  }

  const handleDeletePath = async () => {
    if (!skillPath) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/skill-paths/${skillPath.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete learning path')
      }

      // Navigate back to dashboard
      router.push('/dashboard')
      
    } catch (error: any) {
      console.error('Error deleting path:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setDeleting(false)
      setDeleteModal(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your learning path...</p>
        </div>
      </div>
    )
  }

  if (error || !skillPath) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Oops! Something went wrong</h1>
          <p className="text-gray-600 mb-4">{error || 'Skill path not found'}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const completedMilestones = milestones.filter(m => m.completed).length
  const progress = milestones.length > 0 ? (completedMilestones / milestones.length) * 100 : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-indigo-600 hover:text-indigo-500 mb-4 flex items-center"
          >
            ← Back to Dashboard
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{skillPath.title}</h1>
              <p className="text-gray-600 mt-1">
                {skillPath.skill?.category} • {skillPath.target_duration_weeks} weeks • {skillPath.difficulty_level}
              </p>
              {skillPath.description && (
                <p className="text-gray-700 mt-2">{skillPath.description}</p>
              )}
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-600">{Math.round(progress)}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {completedMilestones} of {milestones.length} milestones completed
            </p>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Roadmap</h2>
        
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id}
              className={`bg-white rounded-lg shadow-sm border p-6 ${
                milestone.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => toggleMilestoneComplete(milestone.id, milestone.completed)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        milestone.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-indigo-500'
                      }`}
                    >
                      {milestone.completed && '✓'}
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${
                      milestone.completed ? 'text-green-900' : 'text-gray-900'
                    }`}>
                      {milestone.title}
                    </h3>
                    <p className={`mt-1 ${
                      milestone.completed ? 'text-green-700' : 'text-gray-600'
                    }`}>
                      {milestone.description}
                    </p>
                    
                    {/* Enhanced Resources Section */}
                    {milestone.resources && milestone.resources.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          📚 Learning Resources
                        </h4>
                        <div className="grid gap-3">
                          {milestone.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="bg-gray-50 rounded-lg p-3 border">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="text-lg">
                                      {resource.type === 'video' && '🎥'}
                                      {resource.type === 'article' && '📖'}
                                      {resource.type === 'book' && '📚'}
                                      {resource.type === 'practice' && '💻'}
                                      {resource.type === 'project' && '🚀'}
                                      {resource.type === 'documentation' && '📋'}
                                      {resource.type === 'course' && '🎓'}
                                      {resource.type === 'tutorial' && '👨‍💻'}
                                    </span>
                                    {resource.url ? (
                                      <a 
                                        href={resource.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
                                      >
                                        {resource.title}
                                      </a>
                                    ) : (
                                      <span className="text-sm font-medium text-gray-900">
                                        {resource.title}
                                      </span>
                                    )}
                                    {resource.url && (
                                      <span className="text-xs text-indigo-500">↗</span>
                                    )}
                                  </div>
                                  
                                  {resource.description && (
                                    <p className="text-xs text-gray-600 mb-2">{resource.description}</p>
                                  )}
                                  
                                  <div className="flex flex-wrap gap-2 text-xs">
                                    {resource.platform && (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                        {resource.platform}
                                      </span>
                                    )}
                                    {resource.duration && (
                                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        ⏱️ {resource.duration}
                                      </span>
                                    )}
                                    {resource.difficulty && (
                                      <span className={`px-2 py-1 rounded-full ${
                                        resource.difficulty === 'beginner' 
                                          ? 'bg-green-100 text-green-700'
                                          : resource.difficulty === 'intermediate'
                                          ? 'bg-yellow-100 text-yellow-700'
                                          : 'bg-red-100 text-red-700'
                                      }`}>
                                        {resource.difficulty}
                                      </span>
                                    )}
                                    {resource.section && (
                                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                        📖 {resource.section}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Exercises Section */}
                    {milestone.exercises && milestone.exercises.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          💪 Practice Exercises
                        </h4>
                        <div className="grid gap-2">
                          {milestone.exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-indigo-900">
                                  {exercise.type === 'coding' && '💻'} 
                                  {exercise.type === 'practice' && '🔄'} 
                                  {exercise.type === 'project' && '🚀'} 
                                  {exercise.type === 'reading' && '📖'} 
                                  {exercise.title}
                                </span>
                                <div className="flex gap-1">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    exercise.difficulty === 'easy' 
                                      ? 'bg-green-100 text-green-700'
                                      : exercise.difficulty === 'medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {exercise.difficulty}
                                  </span>
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                    ⏱️ {exercise.estimated_time}
                                  </span>
                                </div>
                              </div>
                              <p className="text-xs text-indigo-700">{exercise.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>Week {milestone.week_number}</div>
                  <div>{milestone.estimated_hours}h estimated</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {milestones.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No milestones found for this learning path.</p>
          </div>
        )}
      </div>
    </div>
  )
}
