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
  const [currentWeek, setCurrentWeek] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

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

  const nextWeek = () => {
    if (currentWeek < milestones.length - 1 && !isAnimating) {
      setIsAnimating(true)
      setCurrentWeek(prev => prev + 1)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const prevWeek = () => {
    if (currentWeek > 0 && !isAnimating) {
      setIsAnimating(true)
      setCurrentWeek(prev => prev - 1)
      setTimeout(() => setIsAnimating(false), 300)
    }
  }

  const goToWeek = (weekIndex: number) => {
    if (weekIndex !== currentWeek && !isAnimating) {
      setIsAnimating(true)
      setCurrentWeek(weekIndex)
      setTimeout(() => setIsAnimating(false), 300)
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

      {/* Milestones Flip-Through Interface */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Learning Roadmap Preview</h2>
          <div className="text-sm text-slate-600">
            Week {currentWeek + 1} of {milestones.length}
          </div>
        </div>
        
        {milestones.length > 0 && (
          <>
            {/* Week Navigation */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={prevWeek}
                disabled={currentWeek === 0 || isAnimating}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Previous Week</span>
              </button>

              {/* Week Indicator Dots */}
              <div className="flex items-center space-x-2">
                {milestones.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToWeek(index)}
                    disabled={isAnimating}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentWeek
                        ? 'bg-indigo-600 scale-125'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextWeek}
                disabled={currentWeek === milestones.length - 1 || isAnimating}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all duration-200"
              >
                <span>Next Week</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Current Milestone Display */}
            <div className="relative overflow-hidden">
              <div className={`transition-all duration-300 ease-in-out ${
                isAnimating ? 'transform translate-x-2 opacity-50' : 'transform translate-x-0 opacity-100'
              }`}>
                {milestones[currentWeek] && (
                  <div className="rounded-lg shadow-xl border-2 p-8 border-indigo-200 bg-white">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                            {currentWeek + 1}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">
                              {milestones[currentWeek].title}
                            </h3>
                            <p className="text-slate-600 font-medium">
                              Week {milestones[currentWeek].week_number} • {milestones[currentWeek].estimated_hours}h estimated
                            </p>
                          </div>
                        </div>
                        <p className="text-base leading-relaxed text-slate-700 mb-6">
                          {milestones[currentWeek].description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Resources Section */}
                    {milestones[currentWeek].resources && milestones[currentWeek].resources.length > 0 && (
                      <div className="mb-8">
                        <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                          📚 Learning Resources ({milestones[currentWeek].resources.length})
                        </h4>
                        <div className="grid gap-4 md:grid-cols-2">
                          {milestones[currentWeek].resources.map((resource, resourceIndex) => (
                            <div key={resourceIndex} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start space-x-3">
                                <span className="text-2xl flex-shrink-0">
                                  {resource.type === 'video' && '🎥'}
                                  {resource.type === 'article' && '📖'}
                                  {resource.type === 'book' && '📚'}
                                  {resource.type === 'practice' && '💻'}
                                  {resource.type === 'project' && '🚀'}
                                  {resource.type === 'documentation' && '📋'}
                                  {resource.type === 'course' && '🎓'}
                                  {resource.type === 'tutorial' && '👨‍💻'}
                                </span>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-slate-800 mb-1">
                                    {resource.title}
                                  </h5>
                                  {resource.description && (
                                    <p className="text-sm text-slate-600 mb-2">{resource.description}</p>
                                  )}
                                  <div className="flex flex-wrap gap-2">
                                    {resource.duration && (
                                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                        ⏱️ {resource.duration}
                                      </span>
                                    )}
                                    {resource.platform && (
                                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                                        📍 {resource.platform}
                                      </span>
                                    )}
                                    {resource.difficulty && (
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        resource.difficulty === 'beginner'
                                          ? 'bg-green-100 text-green-700'
                                          : resource.difficulty === 'intermediate'
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-red-100 text-red-700'
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
                    {milestones[currentWeek].exercises && milestones[currentWeek].exercises.length > 0 && (
                      <div>
                        <h4 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                          💪 Practice Exercises ({milestones[currentWeek].exercises.length})
                        </h4>
                        <div className="grid gap-3">
                          {milestones[currentWeek].exercises.map((exercise, exerciseIndex) => (
                            <div key={exerciseIndex} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium text-indigo-900 flex items-center space-x-2">
                                  <span>
                                    {exercise.type === 'coding' && '💻'} 
                                    {exercise.type === 'practice' && '🔄'} 
                                    {exercise.type === 'project' && '🚀'} 
                                    {exercise.type === 'reading' && '📖'}
                                  </span>
                                  <span>{exercise.title}</span>
                                </span>
                                <div className="flex gap-2">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    exercise.difficulty === 'easy' 
                                      ? 'bg-green-100 text-green-700'
                                      : exercise.difficulty === 'medium'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                  }`}>
                                    {exercise.difficulty}
                                  </span>
                                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">
                                    ⏱️ {exercise.estimated_time}
                                  </span>
                                </div>
                              </div>
                              <p className="text-sm text-indigo-700 leading-relaxed">{exercise.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Week Overview at Bottom */}
            <div className="mt-8 bg-slate-50 rounded-lg p-4">
              <h4 className="font-semibold text-slate-800 mb-3">Roadmap Overview</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
                {milestones.map((milestone, index) => (
                  <button
                    key={milestone.id}
                    onClick={() => goToWeek(index)}
                    disabled={isAnimating}
                    className={`p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      index === currentWeek
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-slate-700 hover:bg-indigo-50 hover:text-indigo-600'
                    }`}
                  >
                    Week {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

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
