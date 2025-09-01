'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@clerk/nextjs'

type PublicSkillPath = {
  id: string
  title: string
  description: string
  target_duration_weeks: number
  hours_per_week: number
  difficulty_level: string
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
  resources: Array<{
    type: string
    title: string
    description?: string
    url?: string
    duration?: string
    difficulty?: 'beginner' | 'intermediate' | 'advanced'
    platform?: string
    section?: string
  }>
  exercises: Array<{
    title: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    estimated_time: string
    type: 'coding' | 'reading' | 'practice' | 'project'
  }>
}

export default function ExploreRoadmapDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [skillPath, setSkillPath] = useState<PublicSkillPath | null>(null)
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (params.pathId) {
      loadRoadmapDetails()
    }
  }, [params.pathId])

  const loadRoadmapDetails = async () => {
    try {
      console.log('Loading public roadmap:', params.pathId)
      
      // Load skill path details
      const { data: pathData, error: pathError } = await supabase
        .from('skill_paths')
        .select(`
          *,
          skill:skills(name, category)
        `)
        .eq('id', params.pathId)
        .single()

      if (pathError) {
        console.error('Error loading skill path:', pathError)
        throw new Error('Roadmap not found')
      }

      setSkillPath(pathData)

      // Load milestones
      const { data: milestonesData, error: milestonesError } = await supabase
        .from('roadmap_milestones')
        .select('*')
        .eq('skill_path_id', params.pathId)
        .order('week_number', { ascending: true })

      if (milestonesError) {
        console.error('Error loading milestones:', milestonesError)
        throw new Error('Failed to load roadmap details')
      }

      setMilestones(milestonesData || [])
      setLoading(false)
    } catch (error: any) {
      console.error('Error loading roadmap details:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleCloneRoadmap = async () => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    try {
      alert('Roadmap cloning will be implemented soon! For now, create your own roadmap.')
      router.push('/dashboard/create-path')
    } catch (error) {
      console.error('Error cloning roadmap:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading roadmap details...</p>
        </div>
      </div>
    )
  }

  if (error || !skillPath) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Roadmap Not Found</h1>
          <p className="text-slate-600 mb-4">{error || 'The requested roadmap could not be found'}</p>
          <button
            onClick={() => router.push('/explore')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Back to Explore
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push('/explore')}
            className="text-indigo-600 hover:text-indigo-500 mb-4 flex items-center font-medium"
          >
            ← Back to Explore
          </button>
          
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-900">{skillPath.title}</h1>
              <p className="text-slate-600 mt-1 font-medium">
                {skillPath.skill?.category} • {skillPath.target_duration_weeks} weeks • {skillPath.hours_per_week || 5} hrs/week • {skillPath.difficulty_level}
              </p>
              {skillPath.description && (
                <p className="text-slate-700 mt-2 text-base leading-relaxed">{skillPath.description}</p>
              )}
              
              {/* Roadmap Stats */}
              <div className="flex items-center space-x-6 mt-4 text-sm text-slate-600">
                <span>📚 {milestones.length} milestones</span>
                <span>⏱️ {skillPath.hours_per_week || 5} hours per week</span>
                <span>📅 Created {new Date(skillPath.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Clone Button */}
            <div className="ml-6">
              <button
                onClick={handleCloneRoadmap}
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center space-x-2"
              >
                <span>🔗</span>
                <span>Clone Roadmap</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Learning Roadmap Preview</h2>
        <p className="text-slate-600 mb-8">
          This is a preview of the learning roadmap. Clone it to add it to your dashboard and track your progress!
        </p>
        
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div 
              key={milestone.id}
              className="rounded-lg shadow-lg border-2 p-6 border-slate-200 bg-white hover:border-indigo-300 transition-all duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full border-2 border-slate-300 bg-slate-100">
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 text-slate-900">
                      {milestone.title}
                    </h3>
                    <p className="mt-1 text-base leading-relaxed text-slate-700">
                      {milestone.description}
                    </p>
                    
                    {/* Resources Section */}
                    {milestone.resources && milestone.resources.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                          📚 Learning Resources
                        </h4>
                        <div className="grid gap-4">
                          {milestone.resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="bg-slate-50 border-2 border-slate-200 rounded-xl p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-xl">
                                      {resource.type === 'video' && '🎥'}
                                      {resource.type === 'article' && '📖'}
                                      {resource.type === 'book' && '📚'}
                                      {resource.type === 'practice' && '💻'}
                                      {resource.type === 'project' && '🚀'}
                                      {resource.type === 'documentation' && '📋'}
                                      {resource.type === 'course' && '🎓'}
                                      {resource.type === 'tutorial' && '👨‍💻'}
                                    </span>
                                    <span className="text-base font-semibold text-slate-800">
                                      {resource.title}
                                    </span>
                                  </div>
                                  {resource.description && (
                                    <p className="text-sm text-slate-600 mb-2">{resource.description}</p>
                                  )}
                                  <div className="flex items-center space-x-2 text-xs">
                                    {resource.duration && (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                        ⏱️ {resource.duration}
                                      </span>
                                    )}
                                    {resource.platform && (
                                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full font-medium">
                                        📍 {resource.platform}
                                      </span>
                                    )}
                                    {resource.difficulty && (
                                      <span className={`px-2 py-1 rounded-full font-medium ${
                                        resource.difficulty === 'beginner'
                                          ? 'bg-green-200 text-green-800'
                                          : resource.difficulty === 'intermediate'
                                          ? 'bg-amber-200 text-amber-800'
                                          : 'bg-red-200 text-red-800'
                                      }`}>
                                        {resource.difficulty}
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
            <p className="text-gray-500">No milestones found for this roadmap.</p>
          </div>
        )}

        {/* Clone CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Ready to start your learning journey?</h3>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Clone this roadmap to your dashboard to track progress, mark milestones as complete, and make it your own!
          </p>
          <button
            onClick={handleCloneRoadmap}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg hover:bg-indigo-50 transition-colors font-semibold text-lg"
          >
            🔗 Clone This Roadmap
          </button>
        </div>
      </div>
    </div>
  )
}
