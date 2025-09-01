'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type SkillPath = {
  id: string
  title: string
  description: string
  target_duration_weeks: number
  hours_per_week: number
  difficulty_level: string
  skill: {
    name: string
    category: string
  }
}

const SKILL_CATEGORIES = [
  'Programming Languages',
  'Web Development',
  'Data Science',
  'Design',
  'Business',
  'Languages',
  'Music',
  'Fitness',
  'Cooking',
  'Other'
]

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner - No prior experience' },
  { value: 'intermediate', label: 'Intermediate - Some experience' },
  { value: 'advanced', label: 'Advanced - Significant experience' }
]

export default function EditSkillPathPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState('')
  const [skillPath, setSkillPath] = useState<SkillPath | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skillName: '',
    category: '',
    customCategory: '',
    targetWeeks: 8,
    hoursPerWeek: 5,
    difficultyLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced'
  })

  const supabase = createClientComponentClient()

  useEffect(() => {
    if (user && params.pathId) {
      loadSkillPath()
    }
  }, [user, params.pathId])

  const loadSkillPath = async () => {
    try {
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
      
      // Populate form with existing data
      setFormData({
        title: pathData.title || '',
        description: pathData.description || '',
        skillName: pathData.skill?.name || '',
        category: pathData.skill?.category || '',
        customCategory: '',
        targetWeeks: pathData.target_duration_weeks || 8,
        hoursPerWeek: pathData.hours_per_week || 5,
        difficultyLevel: pathData.difficulty_level as 'beginner' | 'intermediate' | 'advanced'
      })

      setLoading(false)
    } catch (error: any) {
      console.error('Error loading skill path:', error)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !skillPath) return

    setSaving(true)
    setError('')

    try {
      const category = formData.category === 'Other' ? formData.customCategory : formData.category
      
      // Update skill path (remove skill update for now to avoid errors)
      const { error: pathError } = await supabase
        .from('skill_paths')
        .update({
          title: formData.title,
          description: formData.description,
          target_duration_weeks: formData.targetWeeks,
          hours_per_week: formData.hoursPerWeek,
          difficulty_level: formData.difficultyLevel
        })
        .eq('id', skillPath.id)

      if (pathError) {
        throw new Error(pathError.message || 'Failed to update skill path')
      }

      // If hours per week changed, regenerate the roadmap to match new time allocation
      const originalHoursPerWeek = skillPath.hours_per_week
      if (formData.hoursPerWeek !== originalHoursPerWeek) {
        console.log(`Hours per week changed from ${originalHoursPerWeek} to ${formData.hoursPerWeek}, regenerating roadmap...`)
        setRegenerating(true)
        await regenerateRoadmap()
        setRegenerating(false)
      }

      // Redirect back to the skill path view
      router.push(`/dashboard/paths/${skillPath.id}`)
      
    } catch (error: any) {
      console.error('Error updating skill path:', error)
      setError(error.message || 'Failed to update skill path. Please try again.')
    } finally {
      setSaving(false)
      setRegenerating(false)
    }
  }

  const regenerateRoadmap = async () => {
    if (!skillPath) return

    try {
      console.log('Regenerating roadmap with new time allocation...')
      
      // Delete existing milestones
      const { error: deleteError } = await supabase
        .from('roadmap_milestones')
        .delete()
        .eq('skill_path_id', skillPath.id)

      if (deleteError) {
        console.error('Error deleting old milestones:', deleteError)
        throw new Error('Failed to clear existing roadmap')
      }

      // Generate new AI-powered roadmap with updated parameters
      const response = await fetch('/api/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skillName: formData.skillName,
          duration: formData.targetWeeks,
          difficulty: formData.difficultyLevel.charAt(0).toUpperCase() + formData.difficultyLevel.slice(1),
          hoursPerWeek: formData.hoursPerWeek,
          userContext: formData.description || `Updated learning path for ${formData.skillName}`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate updated roadmap')
      }

      const aiPath = await response.json()
      console.log('Generated updated AI roadmap:', aiPath.title)

      // Create new milestones with updated time allocation
      const milestones = aiPath.milestones.map((milestone: any, index: number) => ({
        skill_path_id: skillPath.id,
        title: milestone.title,
        description: milestone.description,
        order_index: index,
        week_number: milestone.week_number,
        estimated_hours: milestone.estimated_hours,
        resources: milestone.resources || []
      }))

      const { error: milestonesError } = await supabase
        .from('roadmap_milestones')
        .insert(milestones)

      if (milestonesError) {
        console.error('Error creating updated milestones:', milestonesError)
        throw new Error('Failed to create updated roadmap milestones')
      }
      
      console.log(`Successfully regenerated roadmap with ${milestones.length} milestones for ${formData.hoursPerWeek} hours/week`)
      
    } catch (error: any) {
      console.error('Error regenerating roadmap:', error)
      
      // Create fallback milestones if AI generation fails
      console.log('Creating fallback milestones with updated time allocation...')
      await createFallbackMilestones()
    }
  }

  const createFallbackMilestones = async () => {
    if (!skillPath) return

    const milestones = Array.from({ length: formData.targetWeeks }, (_, index) => ({
      skill_path_id: skillPath.id,
      title: `Week ${index + 1}: ${formData.skillName} - Module ${index + 1}`,
      description: `Learn fundamental concepts and practice exercises for week ${index + 1}. Build a solid foundation in ${formData.skillName} with ${formData.hoursPerWeek} hours of structured content.`,
      order_index: index,
      week_number: index + 1,
      estimated_hours: formData.hoursPerWeek, // Use the updated hours per week
      resources: [
        {
          type: 'article',
          title: `${formData.skillName} Fundamentals - Week ${index + 1}`,
          description: `Essential reading material and tutorials for week ${index + 1}`,
          duration: `${Math.ceil(formData.hoursPerWeek * 0.6)} hours`
        },
        {
          type: 'practice',
          title: `Hands-on Practice`,
          description: `Coding exercises and practical tasks to reinforce learning`,
          duration: `${Math.ceil(formData.hoursPerWeek * 0.3)} hours`
        },
        {
          type: 'project',
          title: `Week ${index + 1} Project`,
          description: `Apply your learning with a practical project`,
          duration: `${Math.ceil(formData.hoursPerWeek * 0.1)} hours`
        }
      ]
    }))

    const { error: milestonesError } = await supabase
      .from('roadmap_milestones')
      .insert(milestones)

    if (milestonesError) {
      console.error('Error creating fallback milestones:', milestonesError)
      throw new Error('Failed to create updated roadmap')
    }
    
    console.log('Successfully created fallback milestones with updated time allocation')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-blue-600">Loading skill path...</p>
        </div>
      </div>
    )
  }

  if (error || !skillPath) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Oops! Something went wrong</h1>
          <p className="text-blue-600 mb-4">{error || 'Skill path not found'}</p>
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

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-blue-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => router.push(`/dashboard/paths/${skillPath.id}`)}
            className="text-indigo-600 hover:text-indigo-500 mb-4 flex items-center font-medium"
          >
            ← Back to Learning Path
          </button>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Edit Learning Path</h1>
            <p className="text-blue-600 mt-1">Update your learning path details</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-blue-100">
          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Learning Path Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter a title for your learning path"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe what you want to learn and your goals"
                />
              </div>

              {/* Skill Name */}
              <div>
                <label htmlFor="skillName" className="block text-sm font-medium text-slate-700 mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  id="skillName"
                  value={formData.skillName}
                  onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., React, Python, Digital Marketing"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select a category</option>
                    {SKILL_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-slate-700 mb-2">
                    Target Duration (weeks)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    min="1"
                    max="52"
                    value={formData.targetWeeks}
                    onChange={(e) => setFormData({ ...formData, targetWeeks: parseInt(e.target.value) || 8 })}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                {/* Weekly Hours Commitment */}
                <div>
                  <label htmlFor="hoursPerWeek" className="block text-sm font-medium text-slate-700 mb-2">
                    Hours per Week
                  </label>
                  <select
                    id="hoursPerWeek"
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value={2}>2 hours/week</option>
                    <option value={3}>3 hours/week</option>
                    <option value={5}>5 hours/week</option>
                    <option value={7}>7 hours/week</option>
                    <option value={10}>10 hours/week</option>
                    <option value={15}>15 hours/week</option>
                    <option value={20}>20 hours/week</option>
                    <option value={25}>25 hours/week</option>
                  </select>
                  <p className="text-sm text-blue-600 mt-1">
                    💡 Changing hours per week will regenerate your roadmap with content that fits the new time allocation
                  </p>
                </div>
              </div>

              {/* Custom Category */}
              {formData.category === 'Other' && (
                <div>
                  <label htmlFor="customCategory" className="block text-sm font-medium text-slate-700 mb-2">
                    Custom Category
                  </label>
                  <input
                    type="text"
                    id="customCategory"
                    value={formData.customCategory}
                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter your custom category"
                    required
                  />
                </div>
              )}

              {/* Difficulty Level */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Difficulty Level
                </label>
                <div className="space-y-3">
                  {DIFFICULTY_LEVELS.map((level) => (
                    <label key={level.value} className="flex items-center">
                      <input
                        type="radio"
                        name="difficulty"
                        value={level.value}
                        checked={formData.difficultyLevel === level.value}
                        onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as any })}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-blue-300"
                      />
                      <span className="ml-3 text-sm text-slate-700">{level.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-blue-100">
                <button
                  type="button"
                  onClick={() => router.push(`/dashboard/paths/${skillPath.id}`)}
                  className="px-6 py-3 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                
                <button
                  type="submit"
                  disabled={saving || regenerating}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {(saving || regenerating) && (
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {regenerating ? 'Regenerating Roadmap...' : saving ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
