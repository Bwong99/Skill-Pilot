'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  const [stats, setStats] = useState({
    totalPaths: 0,
    completedMilestones: 0,
    totalMilestones: 0,
    avgProgress: 0
  })
  
  const supabase = createClientComponentClient()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/welcome')
    } else if (isLoaded && user) {
      loadDashboardData()
    }
  }, [user, isLoaded, router])

  const loadDashboardData = async () => {
    try {
      console.log('Loading dashboard data for user:', user?.id)
      
      // Load skill paths with skills and milestones
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
        throw new Error('Failed to load skill paths')
      }

      const paths = pathsData || []
      setSkillPaths(paths)

      // Calculate stats
      const totalMilestones = paths.reduce((sum, path) => sum + path.milestones.length, 0)
      const completedMilestones = paths.reduce((sum, path) => 
        sum + path.milestones.filter((m: any) => m.completed).length, 0
      )
      const avgProgress = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0

      setStats({
        totalPaths: paths.length,
        completedMilestones,
        totalMilestones,
        avgProgress: Math.round(avgProgress)
      })

    } catch (error: any) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user.firstName || user.emailAddresses[0].emailAddress}</p>
            </div>
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10"
                }
              }}
              afterSignOutUrl="/welcome"
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Learning Paths Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🛤️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Learning Paths
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalPaths}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">📈</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Overall Progress
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.avgProgress}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Milestones Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🎯</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Milestones
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.completedMilestones}/{stats.totalMilestones}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">🔥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Learning Streak
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stats.totalPaths > 0 ? '1 day' : '0 days'}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths Section */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Your Learning Paths
                </h3>
                <p className="text-sm text-gray-600">
                  {skillPaths.length > 0 
                    ? `${skillPaths.length} active learning ${skillPaths.length === 1 ? 'path' : 'paths'}`
                    : 'Start your learning journey'
                  }
                </p>
              </div>
              <button
                onClick={() => router.push('/dashboard/create-path')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                + New Path
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
                      className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors cursor-pointer border"
                      onClick={() => router.push(`/dashboard/paths/${path.id}`)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            {path.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {path.skill?.category} • {path.target_duration_weeks} weeks • {path.difficulty_level}
                          </p>
                        </div>
                        <div className="ml-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold text-indigo-600">
                              {Math.round(progress)}%
                            </div>
                            <div className="text-xs text-gray-500">
                              complete
                            </div>
                          </div>
                        </div>
                      </div>

                      {path.description && (
                        <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                          {path.description}
                        </p>
                      )}

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">
                          {completedCount} of {totalCount} milestones completed
                        </p>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          path.status === 'completed' 
                            ? 'bg-green-100 text-green-800'
                            : path.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'  
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {path.status.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-gray-500">
                          Created {new Date(path.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Empty State
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                  🚀
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No learning paths yet</h3>
                <p className="mt-1 text-sm text-gray-500 mb-6">
                  Get started by creating your first AI-powered learning roadmap!
                </p>
                <button
                  onClick={() => router.push('/dashboard/create-path')}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
                >
                  Create Your First Learning Path
                </button>
                <div className="mt-8 text-left max-w-md mx-auto">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">What you can do:</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <span className="mr-2">🤖</span>
                      Create personalized learning roadmaps with AI
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📊</span>
                      Track your progress week by week
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">📚</span>
                      Access curated resources for each skill
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">🎯</span>
                      Set and achieve learning goals
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
