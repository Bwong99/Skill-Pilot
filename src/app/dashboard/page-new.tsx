'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import DeleteConfirmModal from '@/components/DeleteConfirmModal'

type SkillPath = {
  id: string
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
  milestones: Array<{
    id: string
    completed: boolean
  }>
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const [skillPaths, setSkillPaths] = useState<SkillPath[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean
    pathId: string
    pathTitle: string
  }>({
    isOpen: false,
    pathId: '',
    pathTitle: ''
  })
  const [deleting, setDeleting] = useState(false)
  const [stats, setStats] = useState({
    totalPaths: 0,
    completedMilestones: 0,
    totalMilestones: 0,
    avgProgress: 0
  })
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (!isLoaded) return

    if (!user) {
      router.push('/sign-in')
      return
    }

    loadSkillPaths()
  }, [isLoaded, user, router])

  const loadSkillPaths = async () => {
    try {
      console.log('Loading skill paths for user:', user?.id)
      
      // Fetch skill paths with related skill and milestone data
      const { data: pathsData, error: pathsError } = await supabase
        .from('skill_paths')
        .select(`
          *,
          skill:skills(name, category),
          milestones:roadmap_milestones(id, completed)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })

      if (pathsError) {
        console.error('Error loading skill paths:', pathsError)
        throw pathsError
      }

      console.log('Loaded skill paths:', pathsData)
      setSkillPaths(pathsData || [])

      // Calculate stats
      const totalPaths = pathsData?.length || 0
      const totalMilestones = pathsData?.reduce((sum, path) => sum + (path.milestones?.length || 0), 0) || 0
      const completedMilestones = pathsData?.reduce((sum, path) => 
        sum + (path.milestones?.filter((m: any) => m.completed).length || 0), 0
      ) || 0
      const avgProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

      setStats({
        totalPaths,
        completedMilestones,
        totalMilestones,
        avgProgress: Math.round(avgProgress)
      })

      setLoading(false)

    } catch (error: any) {
      console.error('Error loading skill paths:', error)
      setLoading(false)
    }
  }

  const handleDeleteClick = (pathId: string, pathTitle: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDeleteModal({
      isOpen: true,
      pathId,
      pathTitle
    })
  }

  const handleDeleteConfirm = async () => {
    if (!deleteModal.pathId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/skill-paths/${deleteModal.pathId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete learning path')
      }

      // Remove from local state
      setSkillPaths(prev => prev.filter(path => path.id !== deleteModal.pathId))
      
      // Recalculate stats
      const updatedPaths = skillPaths.filter(path => path.id !== deleteModal.pathId)
      const totalMilestones = updatedPaths.reduce((sum, path) => sum + path.milestones.length, 0)
      const completedMilestones = updatedPaths.reduce((sum, path) => 
        sum + path.milestones.filter((m: any) => m.completed).length, 0
      )
      const avgProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

      setStats({
        totalPaths: updatedPaths.length,
        completedMilestones,
        totalMilestones,
        avgProgress: Math.round(avgProgress)
      })

      // Close modal
      setDeleteModal({ isOpen: false, pathId: '', pathTitle: '' })
      
    } catch (error: any) {
      console.error('Error deleting path:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setDeleting(false)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, pathId: '', pathTitle: '' })
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-indigo-500 mx-auto"></div>
          <p className="mt-6 text-slate-600 text-lg">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-indigo-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-slate-600 mt-1">Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}</p>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-12 w-12 ring-2 ring-indigo-500 ring-offset-2 transition-all duration-200 hover:ring-purple-500"
                }
              }}
              afterSignOutUrl="/welcome"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {/* Learning Paths Card */}
          <div className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Learning Paths</p>
                  <p className="text-white text-3xl font-bold mt-2">{stats.totalPaths}</p>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">🛤️</span>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-blue-400/30 rounded-full px-3 py-1">
                  <span className="text-blue-100 text-xs font-medium uppercase tracking-wide">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="group bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium">Overall Progress</p>
                  <p className="text-white text-3xl font-bold mt-2">{stats.avgProgress}%</p>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">📈</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="bg-emerald-400/30 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-white rounded-full h-2.5 transition-all duration-700 ease-out"
                    style={{ width: `${stats.avgProgress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Card */}
          <div className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Milestones</p>
                  <p className="text-white text-3xl font-bold mt-2">
                    {stats.completedMilestones}<span className="text-purple-200 text-xl">/{stats.totalMilestones}</span>
                  </p>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-purple-400/30 rounded-full px-3 py-1">
                  <span className="text-purple-100 text-xs font-medium uppercase tracking-wide">Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="group bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">Learning Streak</p>
                  <p className="text-white text-3xl font-bold mt-2">7</p>
                </div>
                <div className="bg-white/20 rounded-full p-3 group-hover:bg-white/30 transition-colors">
                  <span className="text-2xl">🔥</span>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <div className="bg-amber-400/30 rounded-full px-3 py-1">
                  <span className="text-amber-100 text-xs font-medium uppercase tracking-wide">Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths Section */}
        <div className="bg-white/70 backdrop-blur-sm shadow-xl rounded-2xl border border-indigo-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-indigo-100 bg-gradient-to-r from-indigo-500 to-purple-600">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-white">
                  Your Learning Paths
                </h3>
                <p className="text-indigo-100 mt-1">
                  {skillPaths.length > 0 
                    ? `${skillPaths.length} active learning ${skillPaths.length === 1 ? 'path' : 'paths'}`
                    : 'Start your learning journey today'
                  }
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard/create-path')}
                className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-indigo-50 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">+</span>
                  <span>New Path</span>
                </span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {skillPaths.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillPaths.map((path) => {
                  const completedCount = path.milestones.filter((m: any) => m.completed).length
                  const totalCount = path.milestones.length
                  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

                  return (
                    <div
                      key={path.id}
                      className="group bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 cursor-pointer border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-lg transform hover:scale-105"
                      onClick={() => router.push(`/dashboard/paths/${path.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-900 transition-colors">
                            {path.title}
                          </h4>
                          <p className="text-sm text-slate-600 mb-3">
                            <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium mr-2">
                              {path.skill?.category}
                            </span>
                            <span className="text-slate-500">
                              {path.target_duration_weeks} weeks • {path.difficulty_level}
                            </span>
                          </p>
                        </div>
                        
                        <div className="ml-4 flex items-start space-x-3">
                          {/* Progress Display */}
                          <div className="text-right">
                            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                              {Math.round(progress)}%
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              complete
                            </div>
                          </div>
                          
                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDeleteClick(path.id, path.title, e)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
                            title="Delete learning path"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-600 mt-2">
                          {completedCount} of {totalCount} milestones completed
                        </p>
                      </div>

                      {/* Description */}
                      {path.description && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {path.description.length > 100 
                            ? `${path.description.substring(0, 100)}...` 
                            : path.description
                          }
                        </p>
                      )}

                      {/* Quick Stats */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center space-x-4 text-xs text-slate-500">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1"></span>
                            {path.status}
                          </span>
                          <span>Started {new Date(path.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Start Learning?</h3>
                <p className="text-slate-600 mb-6 max-w-md mx-auto">
                  Create your first learning path and let AI generate a personalized roadmap to master any skill.
                </p>
                <button
                  onClick={() => router.push('/dashboard/create-path')}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Create Your First Path
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        pathTitle={deleteModal.pathTitle}
        isDeleting={deleting}
      />
    </div>
  )
}
