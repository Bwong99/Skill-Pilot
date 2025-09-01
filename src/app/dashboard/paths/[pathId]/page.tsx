'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
                    
                    {/* Resources */}
                    {milestone.resources && milestone.resources.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Resources:</h4>
                        <ul className="space-y-1">
                          {milestone.resources.map((resource, resourceIndex) => (
                            <li key={resourceIndex} className="text-sm text-gray-600 flex items-center">
                              <span className="mr-2">
                                {resource.type === 'video' && '🎥'}
                                {resource.type === 'article' && '📖'}
                                {resource.type === 'book' && '📚'}
                                {resource.type === 'practice' && '💻'}
                                {resource.type === 'project' && '🚀'}
                              </span>
                              {resource.title}
                            </li>
                          ))}
                        </ul>
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
