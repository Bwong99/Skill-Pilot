'use client'

import { useUser, UserButton } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/welcome')
    }
  }, [user, isLoaded, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Welcome Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SP</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      SkillPilot Dashboard
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Ready to Learn
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
                      Learning Progress
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      0% Complete
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Card */}
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
                      Skills Learned
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      Get Started
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Welcome to SkillPilot! 🚀
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>You've successfully logged in to your SkillPilot dashboard.</p>
              <p>Here you'll be able to:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Track your learning progress</li>
                <li>Access AI-powered learning resources</li>
                <li>View your skill development journey</li>
                <li>Connect with other learners</li>
              </ul>
              <p className="mt-4 font-medium">Your learning adventure starts here! 🎓</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
