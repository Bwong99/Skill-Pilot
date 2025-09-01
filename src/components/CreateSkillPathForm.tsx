'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type CreateSkillPathFormProps = {
  onSuccess?: (skillPathId: string) => void
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

export default function CreateSkillPathForm({ onSuccess }: CreateSkillPathFormProps) {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClientComponentClient()
  
  const [formData, setFormData] = useState({
    skillName: '',
    category: '',
    customCategory: '',
    targetWeeks: 8,
    difficultyLevel: 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    description: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError('')
    
    try {
      console.log('Starting skill path creation...')
      
      // First, create or find the skill
      const skillCategory = formData.category === 'Other' ? formData.customCategory : formData.category
      
      console.log('Looking for existing skill:', formData.skillName)
      let { data: existingSkill, error: skillCheckError } = await supabase
        .from('skills')
        .select('id')
        .eq('name', formData.skillName)
        .maybeSingle()

      if (skillCheckError) {
        console.error('Error checking for existing skill:', skillCheckError)
        throw new Error(`Failed to check existing skills: ${skillCheckError.message}`)
      }

      let skillId = existingSkill?.id

      if (!skillId) {
        console.log('Creating new skill...')
        // Create new skill
        const { data: newSkill, error: skillError } = await supabase
          .from('skills')
          .insert({
            name: formData.skillName,
            category: skillCategory,
            description: formData.description,
            difficulty_level: formData.difficultyLevel,
            estimated_hours: formData.targetWeeks * 10 // Rough estimate
          })
          .select('id')
          .single()

        if (skillError) {
          console.error('Error creating skill:', skillError)
          throw new Error(`Failed to create skill: ${skillError.message}`)
        }
        
        skillId = newSkill.id
        console.log('Created new skill with ID:', skillId)
      } else {
        console.log('Using existing skill with ID:', skillId)
      }

      // Create the skill path
      console.log('Creating skill path...')
      const { data: skillPath, error: pathError } = await supabase
        .from('skill_paths')
        .insert({
          user_id: user.id,
          skill_id: skillId,
          title: `Learn ${formData.skillName} in ${formData.targetWeeks} Weeks`,
          description: formData.description,
          target_duration_weeks: formData.targetWeeks,
          difficulty_level: formData.difficultyLevel,
          status: 'not_started'
        })
        .select('id')
        .single()

      if (pathError) {
        console.error('Error creating skill path:', pathError)
        throw new Error(`Failed to create skill path: ${pathError.message}`)
      }

      console.log('Created skill path with ID:', skillPath.id)

      // Generate AI roadmap (we'll implement this next)
      await generateBasicRoadmap(skillPath.id, formData)

      console.log('Successfully created skill path!')
      onSuccess?.(skillPath.id)
      
    } catch (error: any) {
      console.error('Error creating skill path:', error)
      setError(error.message || 'Failed to create skill path. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateBasicRoadmap = async (skillPathId: string, formData: any) => {
    console.log('Generating basic roadmap for skill path:', skillPathId)
    
    // Create basic milestone structure
    const milestones = Array.from({ length: formData.targetWeeks }, (_, index) => ({
      skill_path_id: skillPathId,
      title: `Week ${index + 1}: ${formData.skillName} - Module ${index + 1}`,
      description: `Learn fundamental concepts and practice exercises for week ${index + 1}`,
      order_index: index,
      week_number: index + 1,
      estimated_hours: 10,
      resources: [
        {
          type: 'article',
          title: `${formData.skillName} - Week ${index + 1} Resources`,
          description: `Curated learning materials for week ${index + 1}`
        }
      ]
    }))

    const { error: milestonesError } = await supabase
      .from('roadmap_milestones')
      .insert(milestones)

    if (milestonesError) {
      console.error('Error creating milestones:', milestonesError)
      throw new Error(`Failed to create roadmap milestones: ${milestonesError.message}`)
    }
    
    console.log('Successfully created', milestones.length, 'milestones')
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Your Learning Path</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Skill Name */}
        <div>
          <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-2">
            What skill do you want to learn?
          </label>
          <input
            id="skillName"
            type="text"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Python Programming, Guitar, Spanish"
            value={formData.skillName}
            onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            <option value="">Select a category</option>
            {SKILL_CATEGORIES.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {/* Custom Category */}
        {formData.category === 'Other' && (
          <div>
            <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-2">
              Custom Category
            </label>
            <input
              id="customCategory"
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your custom category"
              value={formData.customCategory}
              onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
            />
          </div>
        )}

        {/* Target Duration */}
        <div>
          <label htmlFor="targetWeeks" className="block text-sm font-medium text-gray-700 mb-2">
            Target Duration (weeks)
          </label>
          <input
            id="targetWeeks"
            type="number"
            min="1"
            max="52"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={formData.targetWeeks}
            onChange={(e) => setFormData({ ...formData, targetWeeks: parseInt(e.target.value) || 8 })}
          />
          <p className="text-sm text-gray-500 mt-1">
            Recommended: 8-12 weeks for most skills
          </p>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Current Level
          </label>
          <div className="space-y-2">
            {DIFFICULTY_LEVELS.map(level => (
              <label key={level.value} className="flex items-center">
                <input
                  type="radio"
                  name="difficultyLevel"
                  value={level.value}
                  checked={formData.difficultyLevel === level.value}
                  onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as any })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">{level.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Learning Goals (Optional)
          </label>
          <textarea
            id="description"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="What do you hope to achieve with this skill?"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-700">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Your Learning Path...' : 'Generate AI Roadmap'}
        </button>
      </form>
    </div>
  )
}
