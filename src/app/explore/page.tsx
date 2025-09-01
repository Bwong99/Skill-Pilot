'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  user_name: string
  skill: {
    name: string
    category: string
  }
  milestones: Array<{
    id: string
    title: string
    week_number: number
    estimated_hours: number
  }>
}

export default function ExplorePage() {
  const { user } = useUser()
  const router = useRouter()
  const [publicPaths, setPublicPaths] = useState<PublicSkillPath[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')

  const supabase = createClientComponentClient()

  const categories = [
    'All', 'Programming Languages', 'Web Development', 'Data Science', 
    'Design', 'Business', 'Languages', 'Music', 'Fitness', 'Cooking', 'Other'
  ]

  useEffect(() => {
    loadPublicPaths()
  }, [user?.id]) // Reload when user changes

  const loadPublicPaths = async () => {
    try {
      setLoading(true)
      
      // Load skill paths from other users only (exclude current user's paths)
      let query = supabase
        .from('skill_paths')
        .select(`
          id,
          title,
          description,
          target_duration_weeks,
          hours_per_week,
          difficulty_level,
          created_at,
          user_id,
          skill:skills(name, category),
          milestones:roadmap_milestones(id, title, week_number, estimated_hours)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      // Exclude current user's roadmaps if user is logged in
      if (user?.id) {
        query = query.neq('user_id', user.id)
      }

      const { data: pathsData, error: pathsError } = await query

      if (pathsError) {
        throw pathsError
      }

      // Add mock user names (in a real app, you'd join with a users table or store display names)
      const pathsWithUserNames = (pathsData || []).map((path: any, index) => ({
        ...path,
        user_name: `SkillPilot User ${Math.floor(Math.random() * 1000) + 1}`, // Mock user names
        milestones: path.milestones || [],
        skill: path.skill && path.skill.length > 0 ? path.skill[0] : { name: 'Unknown', category: 'Other' }
      }))

      setPublicPaths(pathsWithUserNames)
      
    } catch (error: any) {
      console.error('Error loading public paths:', error)
      setError('Failed to load public learning paths')
    } finally {
      setLoading(false)
    }
  }

  const filteredPaths = publicPaths.filter(path => {
    const matchesCategory = selectedCategory === 'All' || path.skill?.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      path.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.skill?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      path.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

  const handleCloneRoadmap = async (pathId: string) => {
    if (!user) {
      router.push('/sign-in')
      return
    }

    try {
      // Here you would implement cloning logic
      alert('Roadmap cloning will be implemented soon! For now, create your own roadmap.')
      router.push('/dashboard/create-path')
    } catch (error) {
      console.error('Error cloning roadmap:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="mt-6 text-slate-600 text-lg">Discovering amazing roadmaps...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Explore Learning Roadmaps
            </h1>
          </div>
        </div>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white/70 backdrop-blur-sm rounded-xl shadow-lg border border-indigo-100 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search roadmaps..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
            </div>
            
            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-600">
            Found <span className="font-semibold text-indigo-600">{filteredPaths.length}</span> roadmaps
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => loadPublicPaths()}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Roadmaps Grid */}
        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPaths.map((path) => (
              <div
                key={path.id}
                className="group bg-white/70 backdrop-blur-sm rounded-xl p-6 hover:bg-white/90 transition-all duration-300 cursor-pointer border border-indigo-100 hover:border-indigo-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors line-clamp-2">
                      {path.title}
                    </h3>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium ml-2 flex-shrink-0">
                      {path.skill?.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 mb-3">
                    <span className="font-medium text-indigo-600">{path.skill?.name}</span>
                    {' • '}
                    <span className="text-slate-500">
                      {path.target_duration_weeks} weeks • {path.hours_per_week || 5} hrs/week • {path.difficulty_level}
                    </span>
                  </p>
                  
                  {path.description && (
                    <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                      {path.description}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                  <span>📚 {path.milestones.length} milestones</span>
                  <span>👤 by {path.user_name}</span>
                  <span>📅 {new Date(path.created_at).toLocaleDateString()}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/explore/${path.id}`)}
                    className="flex-1 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors font-medium"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCloneRoadmap(path.id)
                    }}
                    className="bg-emerald-500 text-white px-4 py-2 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                  >
                    Clone
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!error && filteredPaths.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-slate-400 mb-4">
              🔍
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No roadmaps found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search or filters' 
                : 'Be the first to create a public roadmap!'
              }
            </p>
            {user && (
              <button
                onClick={() => router.push('/dashboard/create-path')}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Create a Roadmap
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}