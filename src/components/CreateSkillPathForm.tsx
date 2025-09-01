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

      // Generate AI-powered roadmap
      console.log('Generating AI-powered roadmap...')
      await generateAIRoadmap(skillPath.id, formData)

      console.log('Successfully created skill path!')
      onSuccess?.(skillPath.id)
      
    } catch (error: any) {
      console.error('Error creating skill path:', error)
      setError(error.message || 'Failed to create skill path. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const generateAIRoadmap = async (skillPathId: string, formData: any) => {
    console.log('Generating AI-powered roadmap for skill path:', skillPathId)
    
    try {
      // Call the AI generation API
      const response = await fetch('/api/generate-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skillName: formData.skillName,
          duration: formData.targetWeeks,
          difficulty: formData.difficultyLevel.charAt(0).toUpperCase() + formData.difficultyLevel.slice(1),
          userContext: formData.description
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate AI roadmap')
      }

      const aiPath = await response.json()
      console.log('Generated AI path:', aiPath.title)

      // Update the skill path with AI-generated title and description
      const { error: updateError } = await supabase
        .from('skill_paths')
        .update({
          title: aiPath.title,
          description: aiPath.description
        })
        .eq('id', skillPathId)

      if (updateError) {
        console.error('Error updating skill path:', updateError)
        // Don't throw here - we can still create milestones with original title
      }

      // Create AI-generated milestones
      const milestones = aiPath.milestones.map((milestone: any, index: number) => ({
        skill_path_id: skillPathId,
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
        console.error('Error creating AI milestones:', milestonesError)
        throw new Error(`Failed to create AI roadmap milestones: ${milestonesError.message}`)
      }
      
      console.log('Successfully created', milestones.length, 'AI-generated milestones')
      
    } catch (error: any) {
      console.error('Error generating AI roadmap:', error)
      
      // Fallback to basic roadmap if AI fails
      console.log('Falling back to basic roadmap generation...')
      await generateFallbackRoadmap(skillPathId, formData)
    }
  }

  const generateFallbackRoadmap = async (skillPathId: string, formData: any) => {
    console.log('Generating fallback roadmap for skill path:', skillPathId)
    
    // Create basic milestone structure as fallback
    const milestones = Array.from({ length: formData.targetWeeks }, (_, index) => ({
      skill_path_id: skillPathId,
      title: `Week ${index + 1}: ${formData.skillName} - Module ${index + 1}`,
      description: `Learn fundamental concepts and practice exercises for week ${index + 1}. Build a solid foundation in ${formData.skillName}.`,
      order_index: index,
      week_number: index + 1,
      estimated_hours: Math.ceil(40 / formData.targetWeeks), // Distribute 40 hours across weeks
      resources: [
        {
          type: 'article',
          title: `${formData.skillName} Fundamentals - Week ${index + 1}`,
          description: `Essential reading material and tutorials for week ${index + 1}`
        },
        {
          type: 'practice',
          title: `Hands-on Practice`,
          description: `Coding exercises and practical tasks to reinforce learning`
        },
        {
          type: 'project',
          title: `Week ${index + 1} Project`,
          description: `Apply your learning with a practical project`
        }
      ]
    }))

    const { error: milestonesError } = await supabase
      .from('roadmap_milestones')
      .insert(milestones)

    if (milestonesError) {
      console.error('Error creating fallback milestones:', milestonesError)
      throw new Error(`Failed to create roadmap milestones: ${milestonesError.message}`)
    }
    
    console.log('Successfully created', milestones.length, 'fallback milestones')
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

        {/* AI Feature Highlight */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <span className="text-2xl mr-2">�</span>
            <h3 className="text-lg font-semibold text-blue-900">Gemini AI-Powered Learning Path</h3>
          </div>
          <p className="text-sm text-blue-700">
            Powered by Google Gemini AI to create personalized roadmaps with:
          </p>
          <ul className="text-sm text-blue-600 mt-2 space-y-1">
            <li>• Week-by-week learning milestones</li>
            <li>• Real links to documentation, courses, and tutorials</li>
            <li>• Hands-on exercises and project ideas</li>
            <li>• Realistic time estimates and difficulty progression</li>
          </ul>
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Generating Gemini AI Roadmap...
            </>
          ) : (
            <>
              <span className="mr-2">🧠</span>
              Generate Gemini AI Learning Roadmap
            </>
          )}
        </button>
      </form>
    </div>
  )
}
